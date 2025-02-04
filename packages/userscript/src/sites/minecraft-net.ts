import config from '../config'
import { ColorMap, Context, ResolvedBugs, Translator } from '../types'
import { VersionType, getHeader, getFooter } from '../utils/articleTemplate'
import {
  getBugs,
  resolveUrl,
  converters,
  getBugsTranslators,
  getTranslatorColor,
} from '../utils/converter'

export async function minecraftNet() {
  const url = document.location.toString()
  if (url.match(/^https:\/\/www\.minecraft\.net\/(?:[a-z-]+)\/article\//)) {
    const button = document.createElement('button')
    button.classList.add(
      'mc-MC_Button',
      'MC_Button_Hero',
      'spxx-userscript-ignored'
    )
    button.innerText = 'Copy Markdown'
    button.onclick = async () => {
      button.innerText = 'Processing...'
      const markdown = await convertMCArticleToMarkdown(document, url)
      GM.setClipboard(markdown, { type: 'text', mimetype: 'text/plain' })
      button.innerText = 'Copied Markdown!'
      setTimeout(() => (button.innerText = 'Copy Markdown'), 5_000)
    }

    const container = document
      .getElementsByClassName('MC_articleHeroA_attribution')
      .item(0) as HTMLDivElement
    container.append(button)
  }
}

async function convertMCArticleToMarkdown(
  html: Document,
  articleUrl: string,
  translator = config.translator
) {
  const articleType = getArticleType(html)
  const versionType = getVersionType(articleUrl)

  let bugs: ResolvedBugs
  try {
    bugs = await getBugs()
  } catch (e) {
    bugs = {}
    console.error('[convertMCArticleToMarkdown#getBugs]', e)
  }

  let bugsTranslators: Translator
  try {
    bugsTranslators = await getBugsTranslators()
  } catch (e) {
    bugsTranslators = {}
    console.error('[convertMCArticleToMarkdown#getBugs]', e)
  }

  let translatorColor: ColorMap
  try {
    translatorColor = await getTranslatorColor()
  } catch (e) {
    translatorColor = {}
    console.error('[convertMCArticleToMarkdown#getBugs]', e)
  }

  const header = getHeader(articleType, versionType)
  const heroImage = getHeroImage(html, articleType)
  const content = await getContent(html, {
    bugs,
    bugsTranslators,
    translatorColor,
    title: html.title.split(' | ').slice(0, -1).join(' | '),
    date: null,
    translator,
    url: articleUrl,
  })
  const footer = getFooter(articleType, versionType)

  const ans = `${header}${heroImage}${content}[/indent][/indent]${footer}`

  return ans
}

/**
 * Returns the type of the article.
 */
function getArticleType(html: Document): string {
  try {
    const type =
      html.getElementsByClassName('MC_articleHeroA_category')?.[0]
        ?.textContent ?? ''
    return type.toUpperCase()
  } catch (e) {
    console.error('[getArticleType]', e)
  }
  return 'INSIDER'
}

function getVersionType(url: string): VersionType {
  if (url.toLowerCase().includes('pre-release')) {
    return VersionType.PreRelease
  } else if (url.toLowerCase().includes('release-candidate')) {
    return VersionType.ReleaseCandidate
  } else if (url.toLowerCase().includes('snapshot')) {
    return VersionType.Snapshot
  } else if (url.toLowerCase().includes('minecraft-java-edition')) {
    return VersionType.Release
  } else if (url.toLowerCase().includes('minecraft-beta---preview---')) {
    return VersionType.BedrockBeta
  } else {
    return VersionType.Normal
  }
}

/**
 * Get the hero image (head image) of an article as the form of a Markdown string.
 * @param html An HTML Document.
 */
function getHeroImage(html: Document, articleType: string | undefined) {
  const category = articleType
    ? `\n[backcolor=Black][color=White][font="Noto Sans",sans-serif][b]${articleType}[/b][/font][/color][/backcolor][/align]`
    : ''
  const img = html.getElementsByClassName('article-head__image')[0] as
    | HTMLImageElement
    | undefined
  if (!img) {
    return `[postbg]bg3.png[/postbg]\n\n[align=center]${category}[indent][indent]\n`
  }
  const src = img.src
  const ans = `[postbg]bg3.png[/postbg][align=center][img=1200,513]${resolveUrl(
    src
  )}[/img]\n${category}[indent][indent]\n`

  return ans
}

/**
 * Get the content of an article as the form of a Markdown string.
 * @param html An HTML Document.
 */
async function getContent(html: Document, ctx: Context) {
  let ans = ''
  for (const rootDiv of html.querySelectorAll(
    '.MC_Layout_Article > div > *:not(:nth-last-child(-n + 2))'
  )) {
    ans += await converters.recursive(rootDiv as HTMLElement, ctx)
  }
  console.log(ans)

  // Get the server URL if it exists.
  const serverUrls = ans.match(
    /(https:\/\/piston-data.mojang.com\/.+\/server.jar)/
  )
  let serverUrl = ''
  if (serverUrls) {
    serverUrl = serverUrls[0]
  }

  // Remove 'GET THE SNAPSHOT/PRE-RELEASE/RELEASE-CANDIDATE/RELEASE' for releasing
  const index = ans
    .toLowerCase()
    .search(
      /\[size=\d]\[b\]\[color=silver\](\[b\])?get the (pre-release|release|release candidate|snapshot)(\[\/b\])?\[\/color\]\[\/b\]\[\/size\]/
    )
  if (index !== -1) {
    ans = ans.slice(0, index)

    // Add back 【SPXX】
    const attribution = await converters.recursive(
      document.querySelector('.attribution')!,
      ctx
    )
    ans = `${ans}${attribution}`
  }
  // Add spaces between texts and '[x'.
  ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2')
  // Add spaces between '[/x]' and texts.
  ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2')
  // Append the server URL if it exists.
  if (serverUrl) {
    ans += `\n[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/39/common_137_icon.png[/img][/float][size=24px][b][color=#645944] 实用链接[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=${serverUrl}][color=Sienna]官方服务端 jar 下载地址[/color][/url]`
  }

  return ans
}
