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

export type TranslationMappings = [RegExp, string][]

export type AutoTranslationTypes = 'code' | 'headings' | 'punctuation' | 'imgCredits'

export const BugsCenter = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json'
