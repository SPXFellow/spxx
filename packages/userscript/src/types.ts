export interface Context {
  author?: string
  bugs?: ResolvedBugs
  bugsTranslators?: Translator
  translatorColor?: ColorMap
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

export interface Translator {
  [id: string]: string
}

export interface ColorMap {
  [id: string]: string
}

export type TranslationMappings = [RegExp, string][]
