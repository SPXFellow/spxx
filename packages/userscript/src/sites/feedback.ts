import { VersionType, getBeginning, getEnding } from '../utils/beginningEnding'
import { converters } from '../utils/converter'
import { Context } from '../types'
import translateMachinely from '../utils/translateMachinely'

export function feedback() {
  const button = document.createElement('a')
  button.classList.add('navLink')
  button.innerText = 'Copy BBCode'
  button.onclick = async () => {
    button.innerText = 'Processing...'
    const bbcode = await convertFeedbackArticleToBBCode(document, location.href)
    GM_setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' })
    button.innerText = 'Copied BBCode!'
    setTimeout(() => (button.innerText = 'Copy BBCode'), 5_000)
  }

  document.querySelector('.topNavbar nav')!.append(button)
}

async function convertFeedbackArticleToBBCode(
  html: Document,
  articleUrl: string,
  translator = '？？？'
) {
  const title = html.title.slice(
    0,
    html.title.lastIndexOf(' – Minecraft Feedback')
  )
  const ctx = {
    bugs: {},
    title: title,
    translator,
    url: articleUrl,
  }

  let versionType = VersionType.Normal

  if (document.querySelector('[title="Beta Information and Changelogs"]')) {
    versionType = VersionType.BedrockBeta
  } else if (document.querySelector('[title="Release Changelogs"]')) {
    versionType = VersionType.BedrockRelease
  }

  const content = await getFeedbackContent(html, ctx)

  const ans = `${getBeginning(
    'news',
    versionType
  )}[size=6][b][color=Silver]${title}[/color][/b][/size]
${translateMachinely(
  `[size=6][b]${title}[/b][/size]`,
  ctx
)}\n\n${content.replace(
    /\[size=2\]\[color=Silver\]\[b\]PLEASE READ before participating in the Minecraft Beta: \[\/b\]\[\/color\]\[\/size\].*?\[\/list\]/ims,
    ''
  )}[/indent][/indent]\n
[b]【${ctx.translator} 译自[url=${
    ctx.url
  }][color=#388d40][u]feedback.minecraft.net 哪 年 哪 月 哪 日发布的 ${
    ctx.title
  }[/u][/color][/url]】[/b]
【本文排版借助了：[url=https://spx.spgoding.com][color=#388d40][u]SPX[/u][/color][/url]】\n\n${getEnding(
    'news',
    versionType
  )}`

  return ans
}

async function getFeedbackContent(html: Document, ctx: Context) {
  const rootSection = html.getElementsByClassName(
    'article-info'
  )[0] as HTMLElement
  let ans = await converters.recurse(rootSection, ctx)

  // Add spaces between texts and '[x'.
  ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2')
  // Add spaces between '[/x]' and texts.
  ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2')

  return ans
}
