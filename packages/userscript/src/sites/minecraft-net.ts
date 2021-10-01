import '@types/tampermonkey'
import { Context, ResolvedBugs } from '../types'
import { VersionType, getBeginning, getEnding } from '../utils/beginningEnding'
import { getBugs, resolveUrl, converters } from '../utils/converter'

export async function minecraftNet() {
  const url = document.location.toString()
  if (url.match(/^https:\/\/www\.minecraft\.net\/(?:[a-z-]+)\/article\//)) {
    const pointerModifier = document
      .getElementsByClassName('article-attribution-container')
      .item(0) as HTMLDivElement
    pointerModifier.style.pointerEvents = 'inherit'

    const button = document.createElement('button')
    button.classList.add(
      'btn',
      'btn-primary',
      'btn-sm',
      'btn-primary--grow',
      'spx-converter-ignored'
    )
    button.innerText = 'Copy BBCode'
    button.onclick = async () => {
      button.innerText = 'Processing...'
      const bbcode = await convertMCArticleToBBCode(document, url)
      GM_setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' })
      button.innerText = 'Copied BBCode!'
      setTimeout(() => (button.innerText = 'Copy BBCode'), 5_000)
    }

    const container = document
      .getElementsByClassName('attribution')
      .item(0) as HTMLDivElement
    container.append(button)
  }
}

async function convertMCArticleToBBCode(
  html: Document,
  articleUrl: string,
  translator = '？？？'
) {
  const articleType = getArticleType(html)
  const versionType = getVersionType(articleUrl)

  let bugs: ResolvedBugs
  try {
    bugs = await getBugs()
  } catch (e) {
    bugs = {}
    console.error('[convertMCArticleToBBCode#getBugs]', e)
  }

  const beginning = getBeginning(articleType, versionType)
  const heroImage = getHeroImage(html, articleType)
  const content = await getContent(html, {
    bugs,
    title: html.title.split(' | ').slice(0, -1).join(' | '),
    translator,
    url: articleUrl,
  })
  const ending = getEnding(articleType, versionType)

  const ans = `${beginning}${heroImage}${content}[/indent][/indent]${ending}`

  return ans
}

/**
 * Returns the type of the article.
 */
function getArticleType(html: Document): string {
  try {
    const type =
      html.getElementsByClassName('article-category__text')?.[0]?.textContent ??
      ''
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
  } else if (url.toLowerCase().includes('minecraft java edition')) {
    return VersionType.Release
  } else {
    return VersionType.Normal
  }
}

/**
 * Get the hero image (head image) of an article as the form of a BBCode string.
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
 * Get the content of an article as the form of a BBCode string.
 * @param html An HTML Document.
 */
async function getContent(html: Document, ctx: Context) {
  const rootDiv = html.getElementsByClassName('article-body')[0] as HTMLElement
  let ans = await converters.recurse(rootDiv, ctx)

  // Get the server URL if it exists.
  const serverUrls = ans.match(
    /(https:\/\/launcher.mojang.com\/.+\/server.jar)/
  )
  let serverUrl = ''
  if (serverUrls) {
    serverUrl = serverUrls[0]
  }
  // Remove the text after '】'
  ans = ans.slice(0, ans.lastIndexOf('】') + 1)
  // Remove 'GET THE SNAPSHOT/PRE-RELEASE/RELEASE-CANDIDATE/RELEASE' for releasing
  let index = ans
    .toLowerCase()
    .lastIndexOf('[size=6][b][color=silver]get the snapshot[/color][/b][/size]')
  if (index === -1) {
    index = ans
      .toLowerCase()
      .lastIndexOf(
        '[size=6][b][color=silver]get the pre-release[/color][/b][/size]'
      )
  }
  if (index === -1) {
    index = ans
      .toLowerCase()
      .lastIndexOf(
        '[size=6][b][color=silver]get the release[/color][/b][/size]'
      )
  }
  if (index === -1) {
    index = ans
      .toLowerCase()
      .lastIndexOf(
        '[size=6][b][color=silver]get the release candidate[/color][/b][/size]'
      )
  }
  if (index !== -1) {
    ans = ans.slice(0, index)
  }
  // Add spaces between texts and '[x'.
  ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2')
  // Add spaces between '[/x]' and texts.
  ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2')
  // Append the server URL if it exists.
  if (serverUrl) {
    ans += `\n[align=center][table=70%,#EDFBFF]
[tr][td=2,1][align=center][size=3][color=#D6D604][b]官方服务端下载地址[/b][/color][/size][/align][/td][/tr]
[tr][td][align=center][url=${serverUrl}]Minecraft server.jar[/url][/align][/td][/tr]
[/table][/align]`
  }

  return ans
}