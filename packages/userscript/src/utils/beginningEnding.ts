/**
 * Just a simple file to get the beginning and ending of an article.
 * This needs continuous updates according to https://www.mcbbs.net/thread-1253320-1-1.html#pid23311399.
 */

export function getBeginning(articleType: string, type: VersionType) {
  if (articleType.toLowerCase() !== 'news') {
    return ''
  }
  switch (type) {
    case VersionType.Snapshot:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=48,48]https://attachment.mcbbs.net/data/myattachment/common/6c/common_45_icon.png[/img][/float][size=32px][b][color=#645944]每周快照[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][b]每周快照[/b]是 Minecraft Java 版的测试机制，用于新特性的展示和反馈收集。
[*][color=#8E2609]快照有可能导致存档损坏，因此请注意备份，不要直接在你的主存档游玩快照。[/color]
[*]转载本贴时须要注明原作者以及本帖地址。
[*]部分新特性译名仅供参考，不代表最终结果。
[/list][/size][/td][/tr]
[/table][/font][/align]

[hr]\n
【如果没有新方块物品等内容，请删去上方待定译名行。】\n`
    case VersionType.PreRelease:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=48,48]https://attachment.mcbbs.net/data/myattachment/common/6c/common_45_icon.png[/img][/float][size=32px][b][color=#645944]预发布版[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][b]预发布版[/b]是 Minecraft Java 版的测试机制，主要是为了收集漏洞反馈，为正式发布做好准备。
[*][color=#8E2609]预发布版有可能导致存档损坏，因此请注意备份，不要直接在你的主存档游玩预发布版。[/color]
[*]转载本贴时须要注明原作者以及本帖地址。
[*]部分新特性译名仅供参考，不代表最终结果。
[/list][/size][/td][/tr]
[/table][/font][/align]

[hr]\n`
    case VersionType.ReleaseCandidate:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=48,48]https://attachment.mcbbs.net/data/myattachment/common/6c/common_45_icon.png[/img][/float][size=32px][b][color=#645944]候选版本[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][b]候选版本[/b]是 Minecraft Java 版的测试机制。如果没有重大漏洞，该版本将会被用于正式发布。
[*][color=#8E2609]候选版本有可能导致存档损坏，因此请注意备份，不要直接在你的主存档游玩候选版本。[/color]
[*]转载本贴时须要注明原作者以及本帖地址。
[*]部分新特性译名仅供参考，不代表最终结果。
[/list][/size][/td][/tr]
[/table][/font][/align]

[hr]\n`
    case VersionType.Release:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=46,48]https://ooo.0o0.ooo/2017/01/30/588f60bbaaf78.png[/img][/float][size=32px][b][color=#645944] Minecraft Java 版[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][b]Minecraft Java 版[/b]是指运行在 Windows、macOS 与 Linux 平台上，使用 Java 语言开发的 Minecraft 版本。
[*][b]正式版[/b]包含所有特性且安全稳定，所有玩家都可以尽情畅享。
[*]转载本贴时须要注明原作者以及本帖地址。
[/list][/size][/td][/tr]
[/table][/font][/align]

[hr]\n`

    case VersionType.BedrockRelease:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=46,48]https://ooo.0o0.ooo/2017/01/30/588f60bbaaf78.png[/img][/float][size=32px][b][color=#645944]Minecraft 基岩版[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][b]Minecraft 基岩版[/b]是指运行在移动平台（Android、iOS）、Windows 10、主机（Xbox One、Switch、PlayStation 4）上，使用「基岩引擎」（C++语言）开发的 Minecraft 版本。
[*][b]正式版[/b]包含所有特性且安全稳定，所有玩家都可以尽情畅享。
[*]转载本贴时须要注明原作者以及本帖地址。
[/list][/size][/td][/tr]
[/table][/font][/align]

[hr]\n`

    case VersionType.BedrockBeta:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=48,48]https://attachment.mcbbs.net/data/myattachment/common/6c/common_45_icon.png[/img][/float][size=32px][b][color=#645944]测试版[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][b]测试版[/b]是 Minecraft 基岩版的测试机制，主要用于下一个正式版的特性预览。
[*][color=#8E2609]测试版有可能导致存档损坏，因此请注意备份，不要直接在你的主存档游玩测试版。[/color]
[*]转载本贴时须要注明原作者以及本帖地址。
[*]部分新特性译名仅供参考，不代表最终结果。
[/list][/size][/td][/tr]
[/table][/font][/align]

[hr]\n`

    case VersionType.Normal:
    default:
      return `[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/3c/common_499_icon.png[/img][/float][size=24px][b][color=#645944] 转载须知[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]转载本贴时须要注明原作者以及本帖地址。
[/list][/size][/td][/tr]
[/table][/font][/align]
[hr]\n`
  }
}

export function getEnding(articleType: string, type: VersionType) {
  if (articleType.toLowerCase() !== 'news') {
    return ''
  }
  const feedbackSite = "[url=https://aka.ms/CavesCliffsFeedback?ref=minecraftnet][color=Sienna]官方反馈网站（仅限英文，适用于洞穴与山崖更新）[/color][/url]"
  switch (type) {
    case VersionType.Snapshot:
      return `\n[*][url=https://www.minecraft.net/zh-hans/download/][color=Sienna]正版启动器下载地址[/color][/url]
[*][url=https://bugs.mojang.com/browse/MC][color=Sienna]漏洞报告站点（仅限英文）[/color][/url]
[*]${feedbackSite}
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=40,32]https://attachment.mcbbs.net/data/myattachment/common/d6/common_39_icon.png[/img][/float][size=24px][b][color=#645944] 如何游玩快照？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]对于正版用户：请打开官方启动器，在「配置」选项卡中启用「快照」，选择「最新快照」即可。
[*]对于非正版用户：请于[url=http://www.mcbbs.net/forum.php?mod=viewthread&tid=38297&page=1#pid547821][color=Sienna]推荐启动器列表[/color][/url]寻找合适的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[url=http://www.mcbbs.net/forum-qanda-1.html][color=Sienna]原版问答[/color][/url]板块提问。
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`

    case VersionType.PreRelease:
      return `\n[*][url=https://www.minecraft.net/zh-hans/download/][color=Sienna]正版启动器下载地址[/color][/url]
[*][url=https://bugs.mojang.com/browse/MC][color=Sienna]漏洞报告站点（仅限英文）[/color][/url]
[*]${feedbackSite}
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=40,32]https://attachment.mcbbs.net/data/myattachment/common/d6/common_39_icon.png[/img][/float][size=24px][b][color=#645944] 如何游玩预发布版？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]对于正版用户：请打开官方启动器，在「配置」选项卡中启用「快照」，选择「最新快照」即可。
[*]对于非正版用户：请于[url=http://www.mcbbs.net/forum.php?mod=viewthread&tid=38297&page=1#pid547821][color=Sienna]推荐启动器列表[/color][/url]寻找合适的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[url=http://www.mcbbs.net/forum-qanda-1.html][color=Sienna]原版问答[/color][/url]板块提问。
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`

    case VersionType.ReleaseCandidate:
      return `\n[*][url=https://www.minecraft.net/zh-hans/download/][color=Sienna]正版启动器下载地址[/color][/url]
[*][url=https://bugs.mojang.com/browse/MC][color=Sienna]漏洞报告站点（仅限英文）[/color][/url]
[*]${feedbackSite}
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=40,32]https://attachment.mcbbs.net/data/myattachment/common/d6/common_39_icon.png[/img][/float][size=24px][b][color=#645944] 如何游玩候选版本？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]对于正版用户：请打开官方启动器，在「配置」选项卡中启用「快照」，选择「最新快照」即可。
[*]对于非正版用户：请于[url=http://www.mcbbs.net/forum.php?mod=viewthread&tid=38297&page=1#pid547821][color=Sienna]推荐启动器列表[/color][/url]寻找合适的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[url=http://www.mcbbs.net/forum-qanda-1.html][color=Sienna]原版问答[/color][/url]板块提问。
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`

    case VersionType.Release:
      return `\n[*][url=https://www.minecraft.net/zh-hans/download/][color=Sienna]正版启动器下载地址[/color][/url]
[*][url=https://bugs.mojang.com/browse/MC][color=Sienna]漏洞报告站点（仅限英文）[/color][/url]
[*]${feedbackSite}
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=40,32]https://attachment.mcbbs.net/data/myattachment/common/d6/common_39_icon.png[/img][/float][size=24px][b][color=#645944] 如何游玩正式版？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]对于正版用户：请打开官方启动器，选择「最新版本」即可。
[*]对于非正版用户：请于[url=http://www.mcbbs.net/forum.php?mod=viewthread&tid=38297&page=1#pid547821][color=Sienna]推荐启动器列表[/color][/url]寻找合适的启动器。目前绝大多数主流启动器都带有下载功能。如仍有疑惑请到[url=http://www.mcbbs.net/forum-qanda-1.html][color=Sienna]原版问答[/color][/url]板块提问。
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`

    case VersionType.BedrockRelease:
      return `\n[hr]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/39/common_137_icon.png[/img][/float][size=24px][b][color=#645944] 实用链接[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://bugs.mojang.com/browse/MCPE][color=Sienna]漏洞报告站点（仅限英文）[/color][/url]
[*]${feedbackSite}
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=40,32]https://attachment.mcbbs.net/data/myattachment/common/d6/common_39_icon.png[/img][/float][size=24px][b][color=#645944] 如何游玩测试版？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]请访问[url=https://www.minecraft.net/zh-hans/get-minecraft][color=Sienna]官方游戏获取地址[/color][/url]，根据您所使用的平台获取游戏。
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`

    case VersionType.BedrockBeta:
      return `\n[hr]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/39/common_137_icon.png[/img][/float][size=24px][b][color=#645944] 实用链接[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://bugs.mojang.com/browse/MCPE][color=Sienna]漏洞报告站点（仅限英文）[/color][/url]
[*]${feedbackSite}
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=40,32]https://attachment.mcbbs.net/data/myattachment/common/d6/common_39_icon.png[/img][/float][size=24px][b][color=#645944] 如何游玩测试版？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*]请访问[url=https://www.minecraft.net/zh-hans/get-minecraft][color=Sienna]官方游戏获取地址[/color][/url]，根据您所使用的平台获取游戏。
[*]基岩测试版仅限于 Windows 10、Android、iOS、Xbox One 平台。请根据[url=https://www.mcbbs.net/thread-1183093-1-1.html][color=Sienna]官方指引[/color][/url]启用/关闭测试版。
[*]在新建/编辑地图时，请滑动到「实验性游戏内容（Experiments）」，选取你想体验的实验性内容。
[/list][/size][/td][/tr]
[/table][/font][/align]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`

    case VersionType.Normal:
    default:
      return `\n[hr]
[align=center][font=-apple-system, BlinkMacSystemFont,Segoe UI, Roboto, Helvetica, Arial, sans-serif][table=85%]
[tr=#E3C99E][td][float=left][img=32,32]https://attachment.mcbbs.net/data/myattachment/common/e0/common_139_icon.png[/img][/float][size=24px][b][color=#645944] 想了解更多资讯？[/color][/b][/size][/td][/tr]
[tr=#FDF6E5][td][size=16px][list]
[*][url=https://www.mcbbs.net/thread-874677-1-1.html][color=Sienna]外部来源以及详细的更新条目追踪[/color][/url]
[*][url=https://www.mcbbs.net/forum.php?mod=forumdisplay&fid=139][color=Sienna]我的世界中文论坛 - 幻翼块讯板块[/color][/url]
[/list][/size][/td][/tr]
[/table][/font][/align]`
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
