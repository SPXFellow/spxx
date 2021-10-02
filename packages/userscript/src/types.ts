export interface Context {
  author?: string
  bugs: ResolvedBugs
  disablePunctuationConverter?: boolean
  inList?: boolean
  title: string
  translator: string
  url: string
}

export interface ResolvedBugs {
  [id: string]: string
}

export const BugsCenter = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json'
