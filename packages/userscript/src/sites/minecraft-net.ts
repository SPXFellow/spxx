import config from '../config'
import { ColorMap, Context, ResolvedBugs, Translator } from '../types'
import { VersionType, getHeader, getFooter } from '../utils/articleTemplate'
import { spxxVersion } from '../utils/consts'
import {
  getBugs,
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
  const title = html.title.split(' | ').slice(0, -1).join(' | ')

  const content = await getContent(html, {
    bugs,
    bugsTranslators,
    translatorColor,
    title,
    date: null,
    translator,
    url: articleUrl,
  })

  // Get the server URL if it exists.
  const serverUrl = html.querySelector(
    `a[href^="https://piston-data.mojang.com/"][href$="/server.jar"]`
  )

  const footer = getFooter(
    articleType,
    versionType,
    serverUrl !== null ? serverUrl.getAttribute('href')! : undefined
  )

  const footerInfo = {
    year: 'XXXX',
    month: 'XX',
    day: 'XX',
    author: 'XXXXXX',
  }
  const ldJsonEle = html.querySelector('script[type="application/ld+json"]')
  if (ldJsonEle) {
    const ldJson = JSON.parse(ldJsonEle.textContent!)
    if (ldJson.datePublished) {
      const date = new Date(ldJson.datePublished)
      footerInfo.year = date.getFullYear().toString()
      footerInfo.month = (date.getMonth() + 1).toString()
      footerInfo.day = date.getDate().toString()
    }
    if (ldJson.author?.name) {
      footerInfo.author = ldJson.author.name
    }
  }

  const ans = `${header}${content}\n
**【${translator} 译自[官网 ${footerInfo.year} 年 ${footerInfo.month} 月 ${footerInfo.day} 日发布的 ${
    title
  }](${articleUrl})】**
【本文排版借助了：SPXX Userscript v${spxxVersion}】${footer}`

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

  // Remove 'GET THE SNAPSHOT/PRE-RELEASE/RELEASE-CANDIDATE/RELEASE' for releasing
  const index = ans
    .toLowerCase()
    .search(/#+ get the (pre-release|release|release candidate|snapshot)/)
  if (index !== -1) {
    console.log(index)
    ans = ans.slice(0, index)
  }

  return ans
}
