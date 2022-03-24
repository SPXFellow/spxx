import { VersionType } from '../utils/beginningEnding'
import fireZendesk from '../utils/zendesk'

export function feedback() {
  let versionType = VersionType.Normal
  if (document.querySelector('[title="Beta and Preview Information and Changelogs"]')) {
    versionType = VersionType.BedrockBeta
  } else if (document.querySelector('[title="Release Changelogs"]')) {
    versionType = VersionType.BedrockRelease
  }

  fireZendesk((button: HTMLElement) => {
    document.querySelector('.topNavbar nav')!.append(button)
  }, ' – Minecraft Feedback', 'article-info', versionType)
}
