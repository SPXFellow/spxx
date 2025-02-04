import { Context, ResolvedBugs } from '../types'
import translate from './autoTranslation'
import {
  bugsCenter,
  bugsTranslatorsTable,
  spxxVersion,
  translatorColorTable,
} from './consts'

export const converters = {
  /**
   * Converts a ChildNode to a BBCode string according to the type of the node.
   */
  convert: async (node: ChildNode, ctx: Context): Promise<string> => {
    if ((node as HTMLElement).classList?.contains('spxx-userscript-ignored')) {
      return ''
    }
    // Listing all possible elements in the document
    switch (node.nodeName) {
      case 'A':
        return converters.a(node as HTMLAnchorElement, ctx)
      case 'B':
      case 'STRONG':
        return converters.strong(node as HTMLElement, ctx)
      case 'BLOCKQUOTE':
        return converters.blockquote(node as HTMLQuoteElement, ctx)
      case 'BR':
        return converters.br()
      case 'CITE':
        return converters.cite(node as HTMLElement, ctx)
      case 'CODE':
        return converters.code(node as HTMLElement, ctx)
      case 'DIV':
      case 'SECTION':
        return converters.div(node as HTMLDivElement, ctx)
      case 'DD':
        return converters.dd(node as HTMLElement, ctx)
      case 'DL':
        return converters.dl(node as HTMLElement, ctx)
      case 'DT':
        return converters.dt()
      case 'EM':
        return converters.em(node as HTMLElement, ctx)
      case 'H1':
        return converters.h1(node as HTMLElement, ctx)
      case 'H2':
        return converters.h2(node as HTMLElement, ctx)
      case 'H3':
        return converters.h3(node as HTMLElement, ctx)
      case 'H4':
        return converters.h4(node as HTMLElement, ctx)
      case 'I':
        return converters.i(node as HTMLElement, ctx)
      case 'IMG':
        return converters.img(node as HTMLImageElement)
      case 'LI':
        return converters.li(node as HTMLElement, ctx)
      case 'OL':
        return converters.ol(node as HTMLElement, ctx)
      case 'P':
        return converters.p(node as HTMLElement, ctx)
      case 'PICTURE': // TODO: If picture contains important img in the future. Then just attain the last <img> element in the <picture> element.
        return converters.picture(node as HTMLElement, ctx)
      case 'PRE':
        return converters.pre(node as HTMLElement, ctx)
      case 'SPAN':
        return converters.span(node as HTMLElement, ctx)
      case 'TABLE':
        return converters.table(node as HTMLElement, ctx)
      case 'TBODY':
        return converters.tbody(node as HTMLElement, ctx)
      case 'TH':
      case 'TD':
        return converters.td(node as HTMLElement, ctx)
      case 'TR':
        return converters.tr(node as HTMLElement, ctx)
      case 'UL':
        return converters.ul(node as HTMLElement, ctx)
      case '#text':
        if (node) {
          if (ctx.multiLineCode) {
            return node.textContent ? node.textContent : ''
          } else
            return ((node as Text).textContent as string)
              .replace(/[\n\r\t]+/g, '')
              .replace(/\s{2,}/g, '')
        } else {
          return ''
        }
      case 'BUTTON':
      case 'H5':
      case 'NAV':
      case 'svg':
      case 'SCRIPT':
        if (node) {
          return node.textContent ? node.textContent : ''
        } else {
          return ''
        }
      default:
        console.warn(`Unknown type: '${node.nodeName}'.`)
        if (node) {
          return node.textContent ? node.textContent : ''
        } else {
          return ''
        }
    }
  },
  /**
   * Convert child nodes of an HTMLElement to a BBCode string.
   */
  recurse: async (ele: HTMLElement, ctx: Context) => {
    let ans = ''

    if (!ele) {
      return ans
    }

    for (const child of Array.from(ele.childNodes)) {
      ans += await converters.convert(child, ctx)
    }

    return ans
  },
  a: async (anchor: HTMLAnchorElement, ctx: Context) => {
    const url = resolveUrl(anchor.href)
    let ans: string
    if (url) {
      ans = `[url=${url}][color=#388d40]${await converters.recurse(
        anchor,
        ctx
      )}[/color][/url]`
    } else {
      ans = await converters.recurse(anchor, ctx)
    }

    return ans
  },
  blockquote: async (ele: HTMLQuoteElement, ctx: Context) => {
    const prefix = ''
    const suffix = ''
    const ans = `${prefix}${await converters.recurse(ele, ctx)}${suffix}`

    return ans
  },
  br: async () => {
    const ans = '\n'

    return ans
  },
  cite: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '—— '
    const suffix = ''

    const ans = `${prefix}${await converters.recurse(ele, ctx)}${suffix}`

    return ans
  },
  code: async (ele: HTMLElement, ctx: Context) => {
    const prefix = ctx.multiLineCode
      ? '[code]'
      : '[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]'
    const suffix = ctx.multiLineCode ? '[/code]' : '[/font][/color][/backcolor]'

    const ans = `${prefix}${await converters.recurse(ele, {
      ...ctx,
      disablePunctuationConverter: true,
    })}${suffix}`

    return ans
  },
  div: async (ele: HTMLDivElement, ctx: Context) => {
    let ans = await converters.recurse(ele, ctx)

    if (ele.classList.contains('text-center')) {
      ans = `[/indent][/indent][align=center]${ans}[/align][indent][indent]\n`
    } else if (ele.classList.contains('article-image-carousel')) {
      // Image carousel.
      /*
       * <div> .article-image-carousel
       *   <div> .slick-list
       *     <div> .slick-track
       *       * <div> .slick-slide [.slick-cloned]
       *           <div>
       *             <div> .slick-slide-carousel
       *               <img> .article-image-carousel__image
       *               <div> .article-image-carousel__caption
       */
      const prefix = `[/indent][/indent][album]\n`
      const suffix = `\n[/album][indent][indent]\n`
      const slides: [string, string][] = []
      const findSlides = async (
        ele: HTMLDivElement | HTMLImageElement
      ): Promise<void> => {
        if (ele.classList.contains('slick-cloned')) {
          return
        }
        if (
          ele.nodeName === 'IMG' &&
          ele.classList.contains('article-image-carousel__image')
        ) {
          slides.push([resolveUrl((ele as HTMLImageElement).src), ' '])
        } else if (
          ele.nodeName === 'DIV' &&
          ele.classList.contains('article-image-carousel__caption')
        ) {
          if (slides.length > 0) {
            slides[slides.length - 1][1] = `[b]${await converters.recurse(
              ele,
              ctx
            )}[/b]`
          }
        } else {
          for (const child of Array.from(ele.childNodes)) {
            if (child.nodeName === 'DIV' || child.nodeName === 'IMG') {
              await findSlides(child as HTMLDivElement | HTMLImageElement)
            }
          }
        }
      }
      await findSlides(ele)
      if (shouldUseAlbum(slides)) {
        ans = `${prefix}${slides
          .map(([url, caption]) => `[aimg=${url}]${caption}[/aimg]`)
          .join('\n')}${suffix}`
      } else if (slides.length > 0) {
        ans = `[/indent][/indent][align=center]${slides
          .map(([url, caption]) => `[img]${url}[/img]\n${caption}`)
          .join('\n')}[/align][indent][indent]\n`
      } else {
        ans = ''
      }
    } else if (ele.classList.contains('video')) {
      // Video.
      ans =
        '\n[/indent][/indent][align=center][media=x,720,480]https://www.bilibili.com/video/BV1GJ411x7h7[/media]\n【请替换此处视频链接的BV号】[/align][indent][indent]\n'
    } else if (
      ele.classList.contains('quote') ||
      ele.classList.contains('attributed-quote')
    ) {
      ans = `\n[quote]\n${ans}\n[/quote]\n`
    } else if (ele.classList.contains('article-social')) {
      // End of the content.
      ans = ''
    } else if (ele.classList.contains('modal')) {
      // Unknown useless content
      ans = ''
    }
    // else if (ele.classList.contains('end-with-block')) {
    //     ans = ans.trimRight() + '[img=16,16]https://ooo.0o0.ooo/2017/01/30/588f60bbaaf78.png[/img]'
    // }

    return ans
  },
  dt: async () => {
    // const ans = `${converters.rescure(ele)}：`

    // return ans
    return ''
  },
  dl: async (ele: HTMLElement, ctx: Context) => {
    // The final <dd> after converted will contains an footer comma '，'
    // So I don't add any comma before '译者'.
    const ans = `\n\n${await converters.recurse(
      ele,
      ctx
    )}\n【本文排版借助了：[url=https://www.mcbbs.net/thread-1266030-1-1.html][color=#388d40][u]SPXX[/u][/color][/url] v${spxxVersion}】\n\n`
    return ans
  },
  dd: async (ele: HTMLElement, ctx: Context) => {
    let ans = ''

    if (ele.classList.contains('pubDate')) {
      // Published:
      // `pubDate` is like '2019-03-08T10:00:00.876+0000'.
      const date = ele.attributes.getNamedItem('data-value')
      if (date) {
        ans = `[b]【${ctx.translator} 译自[url=${
          ctx.url
        }][color=#388d40][u]官网 ${date.value.slice(
          0,
          4
        )} 年 ${date.value.slice(5, 7)} 月 ${date.value.slice(
          8,
          10
        )} 日发布的 ${ctx.title}[/u][/color][/url]；原作者 ${ctx.author}】[/b]`
      } else {
        ans = `[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]官网 哪 年 哪 月 哪 日发布的 ${ctx.title}[/u][/color][/url]】[/b]`
      }
    } else {
      // Written by:
      ctx.author = await converters.recurse(ele, ctx)
    }

    return ans
  },
  em: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[i]${await converters.recurse(ele, ctx)}[/i]`

    return ans
  },
  h1: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '[size=6][b]'
    const suffix = '[/b][/size]'
    const rawInner = await converters.recurse(ele, ctx)
    const inner = makeUppercaseHeader(rawInner)
    const ans = `${prefix}[color=Silver]${usingSilver(inner).replace(
      /[\n\r]+/g,
      ' '
    )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  h2: async (ele: HTMLElement, ctx: Context) => {
    if (isBlocklisted(ele.textContent!)) return ''

    const prefix = '[size=5][b]'
    const suffix = '[/b][/size]'
    const rawInner = await converters.recurse(ele, ctx)
    const inner = makeUppercaseHeader(rawInner)
    const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
      /[\n\r]+/g,
      ' '
    )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  h3: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '[size=4][b]'
    const suffix = '[/b][/size]'
    const rawInner = await converters.recurse(ele, ctx)
    const inner = makeUppercaseHeader(rawInner)
    const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
      /[\n\r]+/g,
      ' '
    )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  h4: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '[size=3][b]'
    const suffix = '[/b][/size]'
    const rawInner = await converters.recurse(ele, ctx)
    const inner = makeUppercaseHeader(rawInner)
    const ans = `\n${prefix}[color=Silver]${usingSilver(inner).replace(
      /[\n\r]+/g,
      ' '
    )}[/color]${suffix}\n${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  i: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[i]${await converters.recurse(ele, ctx)}[/i]`

    return ans
  },
  img: async (img: HTMLImageElement) => {
    if (img.alt === 'Author image') {
      return ''
    }

    let w: number | undefined
    let h: number | undefined

    if (img.classList.contains('attributed-quote__image')) {
      // for in-quote avatar image
      h = 92
      w = 53
    } else if (img.classList.contains('mr-3')) {
      // for attributor avatar image
      h = 121
      w = 82
    }

    const prefix = w && h ? `[img=${w},${h}]` : '[img]'
    const imgUrl = resolveUrl(img.src)
    if (imgUrl === '') return '' // in case of empty image

    let ans: string
    if (
      img.classList.contains('attributed-quote__image') ||
      img.classList.contains('mr-3')
    ) {
      // Attributed quote author avatar.
      ans = `\n[float=left]${prefix}${imgUrl}[/img][/float]`
    } else {
      ans = `\n\n[/indent][/indent][align=center]${prefix}${imgUrl}[/img][/align][indent][indent]\n`
    }

    return ans
  },
  li: async (ele: HTMLElement, ctx: Context) => {
    let ans: string

    let nestedList = false
    for (const child of ele.childNodes) {
      if (child.nodeName === 'OL' || child.nodeName === 'UL') {
        nestedList = true
      }
    }

    if (nestedList) {
      // Nested lists.
      let theParagragh = ''
      let theList = ''
      let addingList = false
      for (let i = 0; i < ele.childNodes.length - 1; i++) {
        const nodeName = ele.childNodes[i].nodeName
        if (nodeName === 'OL' || nodeName === 'UL') {
          addingList = true
        }
        if (!addingList) {
          const paragraghNode = await converters.convert(ele.childNodes[i], {
            ...ctx,
            inList: true,
          })
          theParagragh = `${theParagragh}${paragraghNode}`
        } else {
          const listNode = await converters.convert(ele.childNodes[i], {
            ...ctx,
            inList: true,
          })
          theList = `${theList}${listNode}`
        }
      }
      ans = `[*][color=Silver]${usingSilver(
        theParagragh
      )}[/color]\n[*]${translate(
        translateBugs(theParagragh, ctx),
        ctx,
        'code'
      )}\n${theList}`
    } else if (isBlocklisted(ele.textContent!)) {
      return ''
    } else {
      const inner = await converters.recurse(ele, { ...ctx, inList: true })
      ans = `[*][color=Silver]${usingSilver(inner)}[/color]\n[*]${translate(
        translateBugs(inner, ctx),
        ctx,
        'code'
      )}\n`
    }

    return ans
  },
  ol: async (ele: HTMLElement, ctx: Context) => {
    const inner = await converters.recurse(ele, ctx)
    const ans = `[list=1]\n${inner}[/list]\n`

    return ans
  },
  p: async (ele: HTMLElement, ctx: Context) => {
    const inner = await converters.recurse(ele, ctx)

    let ans: string

    if (ele.classList.contains('lead')) {
      ans = `[size=4][b][size=2][color=Silver]${inner}[/color][/size][/b][/size]\n[size=4][b]${translate(
        inner,
        ctx,
        'headings'
      )}[/b][/size]\n\n`
    } else if (
      ele.querySelector('strong') !== null &&
      ele.querySelector('strong')!.textContent === 'Posted:'
    ) {
      return ''
    } else if (isBlocklisted(ele.textContent!)) {
      return ''
    } else if (ele.innerHTML === '&nbsp;') {
      return '\n'
    } else if (
      /\s{0,}/.test(ele.textContent!) &&
      ele.querySelectorAll('img').length === 1
    ) {
      return inner
    } else {
      if (ctx.inList) {
        ans = inner
      } else {
        ans = `[size=2][color=Silver]${usingSilver(
          inner
        )}[/color][/size]\n${translate(inner, ctx, [
          'punctuation',
          'imgCredits',
        ])}\n\n`
      }
    }

    return ans
  },
  picture: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recurse(ele, ctx)
    return ans
  },
  pre: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recurse(ele, { ...ctx, multiLineCode: true })
    return ans
  },
  span: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recurse(ele, ctx)

    if (ele.classList.contains('bedrock-server')) {
      // Inline code.
      const prefix =
        '[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]'
      const suffix = '[/font][/color][/backcolor]'
      return `${prefix}${await converters.recurse(ele, {
        ...ctx,
        disablePunctuationConverter: true,
      })}${suffix}`
    } else if (ele.classList.contains('strikethrough')) {
      // Strikethrough text.
      const prefix = '[s]'
      const suffix = '[/s]'
      return `${prefix}${ans}${suffix}`
    } else if (
      ele.childElementCount === 1 &&
      ele.firstElementChild!.nodeName === 'IMG'
    ) {
      // Image.
      const img = ele.firstElementChild! as HTMLImageElement
      return await converters.img(img)
    }

    return ans
  },
  strong: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[b]${await converters.recurse(ele, ctx)}[/b]`

    return ans
  },
  table: async (ele: HTMLElement, ctx: Context) => {
    const ans = `\n[table]\n${await converters.recurse(ele, ctx)}[/table]\n`

    return ans
  },
  tbody: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recurse(ele, ctx)

    return ans
  },
  td: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[td]${await converters.recurse(ele, ctx)}[/td]`

    return ans
  },
  tr: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[tr]${await converters.recurse(ele, ctx)}[/tr]\n`

    return ans
  },
  ul: async (ele: HTMLElement, ctx: Context) => {
    const inner = await converters.recurse(ele, ctx)
    const ans = `[list]\n${inner}[/list]\n`

    return ans
  },
}

/**
 * Resolve relative URLs.
 */
export function resolveUrl(url: string) {
  if (url[0] === '/') {
    return `https://${location.host}${url}`
  } else {
    return url
  }
}

export function usingSilver(text: string) {
  return text.replace(/#388d40/g, 'Silver').replace(/#7824c5/g, 'Silver')
}

export function makeUppercaseHeader(header: string) {
  let retStr = ''
  let idx = 0
  let bracket = 0
  for (let i = 0; i < header.length; i++) {
    if (header[i] == '[') {
      if (bracket == 0) {
        retStr = retStr.concat(header.substring(idx, i).toUpperCase())
        idx = i
      }
      bracket++
    } else if (header[i] == ']') {
      if (bracket <= 1) {
        retStr = retStr.concat(header.substring(idx, i + 1))
        idx = i + 1
      }
      bracket = Math.max(0, bracket - 1)
    }
  }
  if (bracket > 0) {
    console.error('bracket not closed!')
    retStr = retStr.concat(header.substring(idx, header.length))
  } else {
    retStr = retStr.concat(header.substring(idx, header.length).toUpperCase())
  }
  return retStr
}

/**
 * Get bugs from BugCenter.
 */
export async function getBugs(): Promise<ResolvedBugs> {
  return new Promise((rs, rj) => {
    GM.xmlhttpRequest({
      method: 'GET',
      url: bugsCenter,
      fetch: true,
      nocache: true,
      timeout: 7_000,
      onload: (r) => {
        try {
          rs(JSON.parse(r.responseText))
        } catch (e) {
          rj(e)
        }
      },
      onabort: () => rj(new Error('Aborted')),
      onerror: (e) => rj(e),
      ontimeout: () => rj(new Error('Time out')),
    })
  })
}

export async function getBugsTranslators(): Promise<ResolvedBugs> {
  return new Promise((rs, rj) => {
    GM.xmlhttpRequest({
      method: 'GET',
      url: bugsTranslatorsTable,
      fetch: true,
      nocache: true,
      timeout: 7_000,
      onload: (r) => {
        try {
          rs(JSON.parse(r.responseText))
        } catch (e) {
          rj(e)
        }
      },
      onabort: () => rj(new Error('Aborted')),
      onerror: (e) => rj(e),
      ontimeout: () => rj(new Error('Time out')),
    })
  })
}

export async function getTranslatorColor(): Promise<ResolvedBugs> {
  return new Promise((rs, rj) => {
    GM.xmlhttpRequest({
      method: 'GET',
      url: translatorColorTable,
      fetch: true,
      nocache: true,
      timeout: 7_000,
      onload: (r) => {
        try {
          rs(JSON.parse(r.responseText))
        } catch (e) {
          rj(e)
        }
      },
      onabort: () => rj(new Error('Aborted')),
      onerror: (e) => rj(e),
      ontimeout: () => rj(new Error('Time out')),
    })
  })
}

function markdownToBbcode(value: string): string {
  return value.replace(
    /`([^`]+)`/g,
    '[backcolor=#f1edec][color=#7824c5][font=SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace]$1[/font][/color][/backcolor]'
  )
}

/**
 * Replace untranslated bugs.
 */
function translateBugs(str: string, ctx: Context): string {
  if (
    str.startsWith('[url=https://bugs.mojang.com/browse/MC-') &&
    ctx.bugs != null // nullish
  ) {
    const id = str.slice(36, str.indexOf(']'))
    const data = ctx.bugs[id]

    if (data) {
      let bugColor = '#388d40'
      if (ctx.bugsTranslators[id]) {
        const bugTranslator = ctx.bugsTranslators[id]
        if (ctx.translatorColor[bugTranslator]) {
          bugColor = ctx.translatorColor[bugTranslator]
        }
      }
      const bbcode = markdownToBbcode(data)
      return `[url=https://bugs.mojang.com/browse/${id}][b][color=${bugColor}]${id}[/color][/b][/url]- ${bbcode}`
    } else {
      return str
    }
  } else {
    return str
  }
}

/**
 * Determine if we should use album, depending on image count.
 */
function shouldUseAlbum(slides: [string, string][]) {
  const enableAlbum = true
  return enableAlbum
    ? slides.length > 1 && slides.every(([_, caption]) => caption === ' ') // do not use album if there is any caption
    : false
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //  slides.every(([_, caption]) => caption === ' ')
}

function isBlocklisted(text: string): boolean {
  const blocklist: string[] = [
    'Information on the Minecraft Preview and Beta:',
    'While the version numbers between Preview and Beta are different, there is no difference in game content',
    'These work-in-progress versions can be unstable and may not be representative of final version quality',
    'Minecraft Preview is available on Xbox, Windows 10/11, and iOS devices. More information can be found at aka.ms/PreviewFAQ',
    'The beta is available on Android (Google Play). To join or leave the beta, see aka.ms/JoinMCBeta for detailed instructions',
  ]
  return blocklist
    .map((i) => {
      return i.replace(/\p{General_Category=Space_Separator}*/, '')
    })
    .some((block) =>
      text
        .trim()
        .trim()
        .replace(/\p{General_Category=Space_Separator}*/, '')
        .includes(block)
    )
}
