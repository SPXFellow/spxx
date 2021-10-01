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
  [id: string]: {
    summary: string
    color: string
  }
}

export const BugsCenter = 'https://spx.spgoding.com/bugs'
