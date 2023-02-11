GM_config.init({
  id: 'spxx',
  title: 'SPXX Userscript',
  fields: {
    translator: {
      label: 'Translator',
      type: 'text',
      default: 'SPXX User',
    },
    bugSource: {
      label: 'Translation Source',
      type: 'select',
      options: ['Guangyao', 'Github', 'Custom'],
      default: 'Guangyao',
    },
    bugCenterTranslation: {
      label: 'Custom translation source',
      type: 'text',
      default: 'https://bugs.guangyaostore.com/translations',
    },
    bugCenterTranslator: {
      label: 'Custom translator source',
      type: 'text',
      default: 'https://bugs.guangyaostore.com/translator',
    },
    bugCenterColor: {
      label: 'Custom color source',
      type: 'text',
      default: 'https://bugs.guangyaostore.com/color',
    },
  },
})

GM_registerMenuCommand('Edit Configuration', () => GM_config.open())

const src = GM_config.get('bugSource') as string
let tr = ""
let tor = ""
let c = ""
if (src == "Guangyao"){
  console.log("[SPXX] Using Guangyao bug center")
  tr = 'https://bugs.guangyaostore.com/translations'
  tor = 'https://bugs.guangyaostore.com/translator'
  c = 'https://bugs.guangyaostore.com/color'
}
else if (src == "Github"){
  console.log("[SPXX] Using Github bug center")
  tr = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/crowdin/zh-CN/zh_CN.json'
  tor = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/translator.json'
  c = 'https://raw.githubusercontent.com/SPXFellow/spxx-translation-database/master/color.json'
}
else{
  console.log("[SPXX] Using custom bug center")
  tr = GM_config.get('bugCenterTranslation') as string
  tor = GM_config.get('bugCenterTranslator') as string
  c = GM_config.get('bugCenterColor') as string
}

const config = {
  translator: GM_config.get('translator') as string,
  bugCenter: {
    translation: tr,
    translator: tor,
    color: c,
  },
}

export default config
