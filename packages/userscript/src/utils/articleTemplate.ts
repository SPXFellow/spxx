/**
 * Just a simple file to get the header and footer of an article.
 * This needs continuous updates according to https://www.mcbbs.net/thread-1253320-1-1.html#pid23311399.
 */

import { spxxVersion } from './consts'

export function getHeader(articleType: string, type: VersionType) {
  if (articleType.toLowerCase() !== 'news') {
    return ''
  }
  switch (type) {
    case VersionType.Snapshot:
      return `> 📅 **每周快照**是 Minecraft Java 版的测试机制，用于新特性的展示和反馈收集。
> 💀 快照有可能导致存档损坏，因此请注意备份，不要直接在你的主存档游玩快照。
> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。
> 📋 部分新特性译名仅供参考，不代表最终结果。

---

`
    case VersionType.PreRelease:
      return `> 📅 **预发布版**是 Minecraft Java 版的测试机制，如果该版本作为正式版发布，那么预发布版的游戏文件将与启动器推送的正式版完全相同。
> 🤔 然而，预发布版主要用于服主和 Mod 制作者的预先体验，如果发现重大漏洞，该预发布版会被新的预发布版代替。因此建议普通玩家持观望态度。
> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。
> 📋 部分新特性译名仅供参考，不代表最终结果。

---

`
    case VersionType.ReleaseCandidate:
      return `> 📅 **候选版**是 Minecraft Java 版正式版的候选版本，如果发现重大漏洞，该候选版会被新的候选版代替。如果一切正常，该版本将会作为正式版发布。
> 🤗 候选版已可供普通玩家进行抢鲜体验，但仍需当心可能存在的漏洞。
> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。
> 📋 部分新特性译名仅供参考，不代表最终结果。

---

`
    case VersionType.Release:
      return `> 📅 **Minecraft Java 版**是指运行在 Windows、macOS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。
> 😎 **正式版**包含所有特性且安全稳定，所有玩家都可以尽情畅享。
> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。

---

`

    case VersionType.BedrockRelease:
      return `> 📅 **Minecraft 基岩版**是指运行在移动平台（Android、iOS）、Windows 10/11、主机（Xbox One、Switch、PlayStation 4）上，使用「基岩引擎」（C++语言）开发的 Minecraft 版本。
> 😎 **正式版**包含所有特性且安全稳定，所有玩家都可以尽情畅享。
> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。

---

`

    case VersionType.BedrockBeta:
      return `> 📅 **测试版**是 Minecraft 基岩版的测试机制，主要用于下一个正式版的特性预览。
> 💀 测试版有可能导致存档损坏，因此请注意备份，不要直接在你的主存档游玩测试版。
> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。
> 📋 部分新特性译名仅供参考，不代表最终结果。

---

`

    case VersionType.Normal:
    default:
      return `> 📒 转载本帖时须要注明原作者以及本帖地址。本帖来自[红石中继站](https://forum.mczwlt.net/category/6) 。

---

`
  }
}

export function getFooter(
  articleType: string,
  type: VersionType,
  serverJar = '自行替换'
) {
  const time = new Date() // why javacript why

  function padTime(time: number) {
    return time.toString().padStart(2, '0')
  }

  function toHoursAndMinutes(totalMinutes: number) {
    const m = Math.abs(totalMinutes)
    const minutes = m % 60
    const hours = Math.floor(m / 60)

    return `${totalMinutes < 0 ? '+' : '-'}${padTime(hours)}${padTime(minutes)}`
  }

  const poweredBy = `=== Powered by SPXX ${spxxVersion} with love ===
=== Converted at ${time.getFullYear()}-${
    padTime(time.getMonth() + 1) // why +1 javascript
  }-${padTime(time.getDate())} ${padTime(time.getHours())}:${padTime(
    time.getMinutes()
  )} ${toHoursAndMinutes(time.getTimezoneOffset())} ===`

  if (articleType.toLowerCase() !== 'news') {
    return `\n${poweredBy}`
  }

  switch (type) {
    case VersionType.Snapshot:
      return `

---

>🔗 实用链接：
> 1. [官方服务端 jar 下载]({serverJar})
> 2. [正版启动器下载地址](https://www.minecraft.net/zh-hans/download/)
> 3. [漏洞报告站点（英文）](https://bugs.mojang.com/browse/MC)
> 4. [官方反馈网站（英文）](https://feedback.minecraft.net/hc/en-us)

---

>🎮 如何游玩快照？
> * 对于正版用户：请打开官方启动器，在「配置」选项卡中启用「快照」，选择「最新快照」即可。
> * 对于非正版用户：请先寻找适合自己的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[原版问答](https://forum.mczwlt.net/category/14/)板块提问。

---

> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`

    case VersionType.PreRelease:
      return `

---

>🔗 实用链接：
> 1. [官方服务端 jar 下载](${serverJar})
> 2. [正版启动器下载地址](https://www.minecraft.net/zh-hans/download/)
> 3. [漏洞报告站点（英文）](https://bugs.mojang.com/browse/MC)
> 4. [官方反馈网站（英文）](https://feedback.minecraft.net/hc/en-us)

---

>🎮 如何游玩预发布版？
> * 对于正版用户：请打开官方启动器，在「配置」选项卡中启用「快照」，选择「最新快照」即可。
> * 对于非正版用户：请先寻找适合自己的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[原版问答](https://forum.mczwlt.net/category/14/)板块提问。

---

> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`

    case VersionType.ReleaseCandidate:
      return `

---

>🔗 实用链接：
> 1. [官方服务端 jar 下载](${serverJar})
> 2. [正版启动器下载地址](https://www.minecraft.net/zh-hans/download/)
> 3. [漏洞报告站点（英文）](https://bugs.mojang.com/browse/MC)
> 4. [官方反馈网站（英文）](https://feedback.minecraft.net/hc/en-us)

---

>🎮 如何游玩候选版本？
> * 对于正版用户：请打开官方启动器，在「配置」选项卡中启用「快照」，选择「最新快照」即可。
> * 对于非正版用户：请先寻找适合自己的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[原版问答](https://forum.mczwlt.net/category/14/)板块提问。

---

> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`

    case VersionType.Release:
      return `

---

>🔗 实用链接：
> 1. [官方服务端 jar 下载]({serverJar})
> 2. [正版启动器下载地址](https://www.minecraft.net/zh-hans/download/)
> 3. [漏洞报告站点（英文）](https://bugs.mojang.com/browse/MC)
> 4. [官方反馈网站（英文）](https://feedback.minecraft.net/hc/en-us)

---

>🎮 如何游玩正式版？
> * 对于正版用户：请打开官方启动器，选择「最新版本」即可。
> * 对于非正版用户：请先寻找适合自己的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[原版问答](https://forum.mczwlt.net/category/14/)板块提问。

---

> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`

    case VersionType.BedrockRelease:
      return `

---

>🔗 实用链接：
> 1. [漏洞报告站点（英文）](https://bugs.mojang.com/browse/MCPE)
> 2. [官方反馈网站（英文）](https://feedback.minecraft.net/hc/en-us)

---

>🎮 如何游玩正式版？
> * 请访问[官方游戏获取地址](https://www.minecraft.net/zh-hans/get-minecraft)，根据您所使用的平台获取游戏。

---

> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`

    case VersionType.BedrockBeta:
      return `

---

>🔗 实用链接：
> 1. [漏洞报告站点（英文）](https://bugs.mojang.com/browse/MCPE)
> 2. [官方反馈网站（英文）](https://feedback.minecraft.net/hc/en-us)

---

>🎮 如何游玩测试版/预览版？
> * 请访问[官方游戏获取地址](https://www.minecraft.net/zh-hans/get-minecraft)，根据您所使用的平台获取游戏。
> * 基岩测试版/预览版仅限于 Windows 10/11、Android、iOS、Xbox One 平台。请根据[官方指引](https://www.mcbbs.net/thread-1299939-1-1.html)启用/关闭测试版/预览版。
> * 在新建/编辑地图时，请滑动到「实验性游戏内容（Experiments）」，选取你想体验的实验性内容。

---

> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`

    case VersionType.Normal:
    default:
      return `

---

> 📒 **转载本帖时须注明原作者以及本帖地址。**
> 📰 想了解更多 Minecraft 新闻资讯？>>>[幻翼块讯](https://forum.mczwlt.net/category/6)

${poweredBy}`
  }
}

export const enum VersionType {
  Snapshot,
  PreRelease,
  ReleaseCandidate,
  Release,
  Normal,
  BedrockBeta,
  BedrockRelease,
}
