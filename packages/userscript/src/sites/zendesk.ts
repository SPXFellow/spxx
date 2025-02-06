import { VersionType, getHeader, getFooter } from '../utils/articleTemplate'
import { converters } from '../utils/converter'
import { Context } from '../types'
import translate from '../utils/autoTranslation'
import config from '../config'
import { spxxVersion } from '../utils/consts'

export default function getZendesk(
  controlDOM: (button: HTMLElement) => void,
  titleSlice: string,
  contentClass: string,
  versionType: VersionType | null
) {
  const button = document.createElement('a')
  button.classList.add('navLink')
  button.innerText = 'Copy Markdown'
  button.onclick = async () => {
    button.innerText = 'Processing...'
    const bbcode = await convertZendeskArticleToMarkdown(
      document,
      location.href,
      config.translator,
      titleSlice,
      contentClass,
      versionType
    )
    GM.setClipboard(bbcode, { type: 'text', mimetype: 'text/plain' })
    button.innerText = 'Copied Markdown!'
    setTimeout(() => (button.innerText = 'Copy Markdown'), 5_000)
  }

  controlDOM(button)
}

async function convertZendeskArticleToMarkdown(
  html: Document,
  articleUrl: string,
  translator = config.translator,
  titleSlice: string,
  contentClass: string,
  versionType: VersionType | null
) {
  const title = html.title.slice(0, html.title.lastIndexOf(titleSlice))
  const ctx: Context = {
    bugs: {},
    title: title,
    date: null,
    translator,
    url: articleUrl,
  }
  const content = await getZendeskContent(html, ctx, contentClass)
  const posted = await getZendeskDate(location.href)
  const header = versionType ? getHeader('news', versionType) : ''
  const footer = versionType ? getFooter('news', versionType) : ''

  const ans = `${header}
# ${translate(`${title}`, ctx, 'headings')}\n\n${content}\n
**【${ctx.translator} 译自[${
    ctx.url.match(/https:\/\/(.*?)\//)?.[1] ?? 'unknown'
  } ${posted.year} 年 ${posted.month} 月 ${posted.day} 日发布的 ${
    ctx.title
  }](${ctx.url})】**
【本文排版借助了：[SPXX Userscript v${spxxVersion}](https://www.mczwlt.net/resource/ilm1b1xr)】${footer}`

  return ans
}

async function getZendeskContent(
  html: Document,
  ctx: Context,
  contentClass: string
) {
  const rootSection = html.getElementsByClassName(
    contentClass
  )[0] as HTMLElement // Yep, this is the only difference.
  let ans = await converters.recursive(rootSection, ctx)

  // Add spaces between texts and '[x'.
  ans = ans.replace(/([a-zA-Z0-9\-._])(\[[A-Za-z])/g, '$1 $2')
  // Add spaces between '[/x]' and texts.
  ans = ans.replace(/(\[\/[^\]]+?\])([a-zA-Z0-9\-._])/g, '$1 $2')

  return ans
}

export async function getZendeskDate(url: string) {
  const req = new Promise((rs, rj) => {
    GM.xmlHttpRequest({
      method: 'GET',
      url:
        '/api/v2/help_center/en-us/articles/' +
        url.match(/\/articles\/(\d+)/)![1],
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
  let res: Date
  await req.then((value) => {
    const rsp = JSON.parse(value as string)
    res = new Date(rsp.article.created_at)
  })

  const year = res.getFullYear()
  const month = res.getMonth() + 1
  const day = res.getDate()
  return { year, month, day }
}
