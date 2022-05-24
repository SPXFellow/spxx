GM_config.init({
  id: 'spxx',
  title: 'SPXX Userscript',
  fields: {
    translator: {
      label: 'Translator',
      type: 'text',
      default: 'SPXX User',
    },
    bugCenterTranslation: {
      label: 'Bugs Center translation source',
      type: 'text',
      default: 'https://bugs.guangyaostore.com/translations',
    },
    bugCenterTranslator: {
      label: 'Bugs Center translator source',
      type: 'text',
      default: 'https://bugs.guangyaostore.com/translator',
    },
    bugCenterColor: {
      label: 'Bugs Center color source',
      type: 'text',
      default: 'https://bugs.guangyaostore.com/color',
    },
  },
})

GM_registerMenuCommand('Edit Configuration', () => GM_config.open())

const config = {
  translator: GM_config.get('translator') as string,
  bugCenter: {
    translation: GM_config.get('bugCenterTranslation') as string,
    translator: GM_config.get('bugCenterTranslator') as string,
    color: GM_config.get('bugCenterColor') as string,
  },
}

export default config
