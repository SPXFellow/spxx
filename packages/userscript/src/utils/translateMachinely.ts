import { Context } from '../types'

/**
 * Replace all half-shape characters to full-shape characters.
 */
export default function translateMachinely(input: string, ctx: Context) {
  const mappings: [RegExp, string][] = [
    [/Block of the Week: /gi, '本周方块：'],
    [/Taking Inventory: /gi, '背包盘点：'],
    [/Around the Block: /gi, '群系漫游：'],
    [/A Minecraft Java Snapshot/gi, 'Minecraft Java版 快照'],
    [/A Minecraft Java Pre-Release/gi, 'Minecraft Java版 预发布版'],
    [/A Minecraft Java Release Candidate/gi, 'Minecraft Java版 候选版本'],
    [
      /Minecraft Beta (?:-|——) (.*?) \((.*?)\)/gi,
      'Minecarft 基岩版 Beta $1（$2）',
    ],
    [/Minecraft (?:-|——) (.*?) \(Bedrock\)/gi, 'Minecraft 基岩版 $1'],
    [
      /Minecraft (?:-|——) (.*?) \((.*?) Only\)/gi,
      'Minecraft 基岩版 $1（仅$2）',
    ],
    [/Minecraft (?:-|——) (.*?) \((.*?)\)/gi, 'Minecraft 基岩版 $1（仅$2）'],
    [/Caves & Cliffs Experimental Features/gi, '洞穴与山崖实验性特性'],
    [/Marketplace/gi, '市场'],
    [/Data-Driven/gi, '数据驱动'],
    [/Graphical/gi, '图像'],
    [/Player/gi, '玩家'],
    [/Experimental Features/gi, '实验性特性'],
    [/Mobs/gi, '生物'],
    [/Features and Bug Fixes/gi, '特性和漏洞修复'],
    [/Stability and Performance/gi, '稳定性和性能'],
    [/Accessibility/gi, '辅助功能'],
    [/Gameplay/gi, '玩法'],
    [/Items/gi, '物品'],
    [/Blocks/gi, '方块'],
    [/User Interface/gi, '用户界面'],
    [/Commands/gi, '命令'],
    [/Technical Updates/gi, '技术性更新'],
    [/Vanilla Parity/gi, '待同步特性'],
    [/Character Creator/gi, '角色创建器'],
    [/Minecraft Snapshot /gi, 'Minecraft 快照 '],
    [/Pre-Release /gi, '预发布版 '],
    [/Release Candidate /gi, '候选版本 '],
    [/Image credit:/gi, '图片来源：'],
    [/CC BY:/gi, '知识共享 署名'],
    [/CC BY-NC:/gi, '知识共享 署名-非商业性使用'],
    [/CC BY-ND:/gi, '知识共享 署名-禁止演绎'],
    [/CC BY-SA:/gi, '知识共享 署名-相同方式共享'],
    [/CC BY-NC-ND:/gi, '知识共享 署名-非商业性使用-禁止演绎'],
    [/CC BY-NC-SA:/gi, '知识共享 署名-非商业性使用-相同方式共享'],
    [/Public Domain:/gi, '公有领域'],
    [/The Caves & Cliffs Preview/gi, '洞穴与山崖预览数据包'], // to be deprecated
    [
      /\[size=6\]\[b\]New Features in ([^\r\n]+)\[\/b\]\[\/size\]/gi,
      '[size=6][b]$1 的新增特性[/b][/size]',
    ],
    [
      /\[size=6\]\[b\]Changes in ([^\r\n]+)\[\/b\]\[\/size\]/gi,
      '[size=6][b]$1 的修改内容[/b][/size]',
    ],
    [
      /\[size=6\]\[b\]Technical changes in ([^\r\n]+)\[\/b\]\[\/size\]/gi,
      '[size=6][b]$1 的技术性修改[/b][/size]',
    ],
    [
      /\[size=6\]\[b\]Fixed bugs in ([^\r\n]+)\[\/b\]\[\/size\]/gi,
      '[size=6][b]$1 修复的漏洞[/b][/size]',
    ],
    [/\[i\]/gi, '[font=楷体]'],
    [/\[\/i\]/g, '[/font]'],
    ...(ctx.disablePunctuationConverter
      ? []
      : ([
          [/,( |$)/g, '，'],
          [/!( |$)/g, '！'],
          [/\.\.\.( |$)/g, '…'],
          [/\.( |$)/g, '。'],
          [/\?( |$)/g, '？'],
          [/( |^)-( |$)/g, ' —— '],
        ] as [RegExp, string][])),
  ]

  for (const mapping of mappings) {
    input = input.replace(mapping[0], mapping[1])
  }

  const quoteArrays: [string, string, RegExp][] = [
    ['“', '”', /"/],
    // ['『', '』', "'"]
  ]

  for (const quoteArray of quoteArrays) {
    const split = input.split(quoteArray[2])
    input = ''
    for (let i = 0; i < split.length - 1; i++) {
      const element = split[i]
      input += element + quoteArray[i % 2]
    }
    input += split[split.length - 1]
  }

  return input
}
