export interface Context {
  author?: string
  bugs: ResolvedBugs
  disablePunctuationConverter?: boolean
  multiLineCode?: boolean
  inList?: boolean
  date: DateConstructor | null
  title: string
  translator: string
  url: string
}

export interface ResolvedBugs {
  [id: string]: string
}

export type TranslationMappings = [RegExp, string][]

export type AutoTranslationTypes =
  | 'code'
  | 'headings'
  | 'punctuation'
  | 'imgCredits'
