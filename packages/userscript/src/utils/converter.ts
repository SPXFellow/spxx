import config from '../config'
import { Context, ResolvedBugs } from '../types'
import translate from './autoTranslation'
import { spxxVersion } from './consts'

export const converters = {
  /**
   * Converts a ChildNode to a Markdown string according to the type of the node.
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
   * Convert child nodes of an HTMLElement to a Markdown string.
   */
  recursive: async (ele: HTMLElement, ctx: Context) => {
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
      ans = `[${await converters.recursive(anchor, ctx)}](${url})`
    } else {
      ans = await converters.recursive(anchor, ctx)
    }

    return ans
  },
  blockquote: async (ele: HTMLQuoteElement, ctx: Context) => {
    const prefix = '> '
    const suffix = '\n'
    const ans = `${prefix}${await converters.recursive(ele, ctx)}${suffix}`

    return ans
  },
  br: async () => {
    const ans = '\n'

    return ans
  },
  cite: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '—— '
    const suffix = ''

    const ans = `${prefix}${await converters.recursive(ele, ctx)}${suffix}`

    return ans
  },
  code: async (ele: HTMLElement, ctx: Context) => {
    const prefix = ctx.multiLineCode ? '```\n' : '`'
    const suffix = ctx.multiLineCode ? '```' : '`'

    const ans = `${prefix}${await converters.recursive(ele, {
      ...ctx,
      disablePunctuationConverter: true,
    })}${suffix}`

    return ans
  },
  div: async (ele: HTMLDivElement, ctx: Context) => {
    let ans = await converters.recursive(ele, ctx)

    if (ele.classList.contains('text-center')) {
      // no way to center text
      // ans = `[/indent][/indent][align=center]${ans}[/align][indent][indent]\n`
    } else if (ele.classList.contains('article-image-carousel')) {
      // TODO: Image carousel.
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
            slides[slides.length - 1][1] = `[b]${await converters.recursive(
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
      // TODO: Video.
      ans =
        '\nhttps://www.bilibili.com/video/BV1GJ411x7h7【请替换此处视频链接的BV号】\n'
    } else if (
      ele.classList.contains('quote') ||
      ele.classList.contains('attributed-quote')
    ) {
      ans = `\n> ${ans}\n`
    } else if (ele.classList.contains('MC_articleHeroA_category')) {
      ans = `\n###### ${ans}\n`
    } else if (
      ele.classList.contains('MC_imageGridA') ||
      ele.classList.contains('MC_socialShareA')
    ) {
      // End of the content.
      ans = ''
    } else if (ele.classList.contains('MC_articleHeroA_attribution')) {
      // No need to convert
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
    const ans = `\n\n${await converters.recursive(
      ele,
      ctx
    )}\n【本文排版借助了：SPXX v${spxxVersion}】\n\n`
    return ans
  },
  dd: async (ele: HTMLElement, ctx: Context) => {
    let ans = ''

    if (ele.classList.contains('pubDate')) {
      // Published:
      // `pubDate` is like '2019-03-08T10:00:00.876+0000'.
      const date = ele.attributes.getNamedItem('data-value')
      if (date) {
        ans = `**【${ctx.translator} 译自[url=${
          ctx.url
        }][color=#388d40][u]官网 ${date.value.slice(
          0,
          4
        )} 年 ${date.value.slice(5, 7)} 月 ${date.value.slice(
          8,
          10
        )} 日发布的 ${ctx.title}[/u][/color][/url]；原作者 ${ctx.author}】**`
      } else {
        ans = `[b]【${ctx.translator} 译自[url=${ctx.url}][color=#388d40][u]官网 哪 年 哪 月 哪 日发布的 ${ctx.title}[/u][/color][/url]】[/b]`
      }
    } else {
      // Written by:
      ctx.author = await converters.recursive(ele, ctx)
    }

    return ans
  },
  em: async (ele: HTMLElement, ctx: Context) => {
    const ans = `_${await converters.recursive(ele, ctx)}_`

    return ans
  },
  h1: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '# '
    const suffix = ''
    const rawInner = await converters.recursive(ele, ctx)
    const inner = rawInner.toUpperCase()
    const ans = `${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  h2: async (ele: HTMLElement, ctx: Context) => {
    if (isBlocklisted(ele.textContent!)) return ''

    const prefix = '## '
    const suffix = ''
    const rawInner = await converters.recursive(ele, ctx)
    const inner = rawInner.toUpperCase()
    const ans = `${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  h3: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '### '
    const suffix = ''
    const inner = await converters.recursive(ele, ctx)
    const ans = `${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  h4: async (ele: HTMLElement, ctx: Context) => {
    const prefix = '#### '
    const suffix = ''
    const inner = await converters.recursive(ele, ctx)
    const ans = `${prefix}${translate(`${inner}`, ctx, [
      'headings',
      'punctuation',
    ]).replace(/[\n\r]+/g, ' ')}${suffix}\n\n`

    return ans
  },
  i: async (ele: HTMLElement, ctx: Context) => {
    const ans = `_${await converters.recursive(ele, ctx)}_`

    return ans
  },
  img: async (img: HTMLImageElement) => {
    if (img.alt === 'Author image') {
      return ''
    }

    // let w: number | undefined
    // let h: number | undefined

    // if (img.classList.contains('attributed-quote__image')) {
    //   // for in-quote avatar image
    //   h = 92
    //   w = 53
    // } else if (img.classList.contains('mr-3')) {
    //   // for attributor avatar image
    //   h = 121
    //   w = 82
    // }

    const prefix = `![${img.alt}]`
    const imgUrl = resolveUrl(img.src)
    if (imgUrl === '') return '' // in case of empty image

    const ans = `\n\n${prefix}(${imgUrl})\n`

    return ans
  },
  li: async (ele: HTMLElement, ctx: Context) => {
    let ans: string

    let depth = 0
    let parent = ele.parentElement
    while (parent) {
      if (parent.nodeName === 'UL' || parent.nodeName === 'OL') {
        depth++
      }
      parent = parent.parentElement
    }

    if (isBlocklisted(ele.textContent!)) {
      return ''
    } else {
      const inner = await converters.recursive(ele, { ...ctx, inList: true })
      ans = `${'  '.repeat(depth - 1)}${
        ele.parentElement!.nodeName === 'UL'
          ? '- '
          : `${Array.from(ele.parentElement!.children).indexOf(ele) + 1}. `
      }${translateBugs(inner, ctx)}\n`
    }

    return ans
  },
  ol: async (ele: HTMLElement, ctx: Context) => {
    let prefix = ''
    if (ele.parentElement?.nodeName === 'LI') {
      prefix = '\n'
    }
    const ans = `${prefix}${await converters.recursive(ele, ctx)}\n`

    return ans
  },
  p: async (ele: HTMLElement, ctx: Context) => {
    const inner = await converters.recursive(ele, ctx)

    let ans: string

    if (ele.classList.contains('MC_articleHeroA_header_subheadline')) {
      ans = `### ${translate(inner, ctx, 'headings')}\n\n`
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
        ans = `${translate(inner, ctx, ['punctuation', 'imgCredits'])}\n\n`
      }
    }

    return ans
  },
  picture: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recursive(ele, ctx)
    return ans
  },
  pre: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recursive(ele, { ...ctx, multiLineCode: true })
    return ans
  },
  span: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recursive(ele, ctx)

    if (ele.classList.contains('bedrock-server')) {
      // Inline code.
      const prefix = '`'
      const suffix = '`'
      return `${prefix}${await converters.recursive(ele, {
        ...ctx,
        disablePunctuationConverter: true,
      })}${suffix}`
    } else if (ele.classList.contains('strikethrough')) {
      // Strikethrough text.
      const prefix = '~~'
      const suffix = '~~'
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
    const ans = `**${await converters.recursive(ele, ctx)}**`

    return ans
  },
  table: async (ele: HTMLElement, ctx: Context) => {
    const ans = `\n[table]\n${await converters.recursive(ele, ctx)}[/table]\n`

    return ans
  },
  tbody: async (ele: HTMLElement, ctx: Context) => {
    const ans = await converters.recursive(ele, ctx)

    return ans
  },
  td: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[td]${await converters.recursive(ele, ctx)}[/td]`

    return ans
  },
  tr: async (ele: HTMLElement, ctx: Context) => {
    const ans = `[tr]${await converters.recursive(ele, ctx)}[/tr]\n`

    return ans
  },
  ul: async (ele: HTMLElement, ctx: Context) => {
    let prefix = ''
    if (ele.parentElement?.nodeName === 'LI') {
      prefix = '\n'
    }
    const ans = `${prefix}${await converters.recursive(ele, ctx)}\n`

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

/**
 * Get bugs from BugCenter.
 */
export async function getBugs(): Promise<ResolvedBugs> {
  return new Promise((rs, rj) => {
    GM.xmlHttpRequest({
      method: 'GET',
      url: config.bugCenter.translation,
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
    GM.xmlHttpRequest({
      method: 'GET',
      url: config.bugCenter.translator,
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
    GM.xmlHttpRequest({
      method: 'GET',
      url: config.bugCenter.color,
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

      return `[${id}](https://bugs.mojang.com/browse/${id}) - ${data}`
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
      return i.replace(/\p{General_Category=Space_Separator}*/u, '')
    })
    .some((block) =>
      text
        .trim()
        .trim()
        .replace(/\p{General_Category=Space_Separator}*/u, '')
        .includes(block)
    )
}
