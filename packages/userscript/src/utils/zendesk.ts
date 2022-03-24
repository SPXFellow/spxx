import { VersionType, getBeginning, getEnding } from '../utils/beginningEnding'
import { converters } from '../utils/converter'
import { Context } from '../types'
import translateMachinely from '../utils/autoTranslation'
import config from '../config'

export default function fireZendesk(controlDOM: Function, titleSlice: string, contentClass: string, versionType: VersionType | null) {
  const button = document.createElement('a')
  button.classList.add('navLink')
  button.innerText = 'Copy BBCode'
  button.onclick = async () => {
    button.innerText = 'Processing...'
    const bbcode = await convertZendeskArticleToBBCode(document, location.href, config.translator, titleSlice, contentClass, versionType)
    GM_setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' })
    button.innerText = 'Copied BBCode!'
    setTimeout(() => (button.innerText = 'Copy BBCode'), 5_000)
  }

  controlDOM(button)
}

async function convertZendeskArticleToBBCode(
  html: Document,
  articleUrl: string,
  translator = config.translator,
  titleSlice: string,
  contentClass: string,
  versionType: VersionType | null,
) {
  const title = html.title.slice(0, html.title.lastIndexOf(titleSlice))
  const ctx = {
    bugs: {},
    title: title,
    date: null,
    translator,
    url: articleUrl,
  }
  const content = await getZendeskContent(html, ctx, contentClass)
  const posted = await getZendeskDate(location.href)
  const beginning = versionType ? getBeginning('news', versionType) : ''
  const ending = versionType ? getEnding('news', versionType) : ''

  const ans = `[postbg]bg3.png[/postbg]${beginning}[align=center][size=6][b][color=Silver]${title}[/color][/b][/size]
${translateMachinely(
  `[size=6][b]${title}[/b][/size]`,
  ctx, 'headings'
)}[/align]\n\n${content}[/indent][/indent]\n
[b]【${ctx.translator} 译自[url=${
    ctx.url
  }][color=#388d40][u]help.minecraft.net ${posted.year} 年 ${posted.month} 月 ${posted.day} 日发布的 ${
    ctx.title
  }[/u][/color][/url]】[/b]
【本文排版借助了：[url=https://www.mcbbs.net/thread-1266030-1-1.html][color=#388d40][u]SPXX[/u][/color][/url]】\n\n${ending}`

  return ans
}

async function getZendeskContent(html: Document, ctx: Context, contentClass: string) {
  const rootSection = html.getElementsByClassName(
    contentClass
  )[0] as HTMLElement // Yep, this is the only difference.
  let ans = await converters.recurse(rootSection, ctx)

  // Add spaces between texts and '[x'.
  ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2')
  // Add spaces between '[/x]' and texts.
  ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2')

  return ans
}

export async function getZendeskDate(url: string) {
  const req = new Promise((rs, rj) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: '/api/v2/help_center/en-us/articles/' + url.match(/\/articles\/(\d+)/)![1],
      fetch: true,
      nocache: true,
      timeout: 7_000,
      onload: (r) => {
        try {
          rs(r.responseText)
        } catch (e) {
          rj(e)
        }
      },
      onabort: () => rj(new Error('Aborted')),
      onerror: (e) => rj(e),
      ontimeout: () => rj(new Error('Time out')),
    })
  })
  let res: any
  await req.then((value) => {
    const rsp = JSON.parse(value as string)
    res = new Date(rsp.article.created_at)
  })

  const year = res.getFullYear()
  const month = res.getMonth() + 1
  const day = res.getDate()
  return { year, month, day }
}
