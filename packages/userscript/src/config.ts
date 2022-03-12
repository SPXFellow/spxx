GM_config.init({
  id: 'spxx',
  title: 'SPXX Userscript',
  fields: {
    translator: {
      label: 'Translator',
      type: 'text',
      default: 'SPXX User',
    }
  }
})

GM_registerMenuCommand('Edit Configuration', () => GM_config.open())

const config = {
  translator: GM_config.get('translator') as string
}

export default config
