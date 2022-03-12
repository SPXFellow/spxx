import { converters } from '../utils/converter'
import { Context } from '../types'
import translateMachinely from '../utils/autoTranslation'
import { getZendeskDate } from '../utils/zendesk'
import config from '../config'

export function help() {
  const button = document.createElement('a')
  button.classList.add('navLink')
  button.innerText = 'Copy BBCode'
  button.onclick = async () => {
    button.innerText = 'Processing...'
    const bbcode = await convertHelpArticleToBBCode(document, location.href)
    GM_setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' })
    button.innerText = 'Copied BBCode!'
    setTimeout(() => (button.innerText = 'Copy BBCode'), 5_000)
  }

  const nav = document.createElement('nav')
  nav.classList.add('my-0')
  nav.append(button)

  document.querySelector('.topNavbar .d-flex')!.append(nav)
}

async function convertHelpArticleToBBCode(
  html: Document,
  articleUrl: string,
  translator = config.translator
) {
  const title = html.title.slice(0, html.title.lastIndexOf(' – Home'))
  const ctx = {
    bugs: {},
    title: title,
    date: null,
    translator,
    url: articleUrl,
  }
  const content = await getHelpContent(html, ctx)
  const posted = await getZendeskDate(location.href)

  const ans = `[postbg]bg3.png[/postbg][align=center][size=6][b][color=Silver]${title}[/color][/b][/size]
${translateMachinely(
  `[size=6][b]${title}[/b][/size]`,
  ctx, 'headings'
)}[/align]\n\n${content}[/indent][/indent]\n
[b]【${ctx.translator} 译自[url=${
    ctx.url
  }][color=#388d40][u]help.minecraft.net ${posted.year} 年 ${posted.month} 月 ${posted.day} 日发布的 ${
    ctx.title
  }[/u][/color][/url]】[/b]
【本文排版借助了：[url=https://www.mcbbs.net/thread-1266030-1-1.html][color=#388d40][u]SPXX[/u][/color][/url]】\n\n`

  return ans
}

async function getHelpContent(html: Document, ctx: Context) {
  const rootSection = html.getElementsByClassName(
    'article-body'
  )[0] as HTMLElement // Yep, this is the only difference.
  let ans = await converters.recurse(rootSection, ctx)

  // Add spaces between texts and '[x'.
  ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2')
  // Add spaces between '[/x]' and texts.
  ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2')

  return ans
}
