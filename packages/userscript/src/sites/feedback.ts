import { VersionType } from '../utils/articleTemplate'
import getZendesk from './zendesk'

export function feedback() {
  let versionType = VersionType.Normal
  if (
    document.querySelector(
      '[title="Beta and Preview Information and Changelogs"]'
    )
  ) {
    versionType = VersionType.BedrockBeta
  } else if (document.querySelector('[title="Release Changelogs"]')) {
    versionType = VersionType.BedrockRelease
  }

  getZendesk(
    (button) => {
      document.querySelector('.topNavbar nav')!.append(button)
    },
    ' – Minecraft Feedback',
    'article-info',
    versionType
  )
}
