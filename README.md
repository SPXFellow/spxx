# spxx

[![Build Status](https://travis-ci.com/SPGoding/spx.svg?branch=master)](https://travis-ci.com/SPGoding/spx)
![GitHub Top Language](https://img.shields.io/github/languages/top/SPGoding/spx.svg)
![License](https://img.shields.io/github/license/SPGoding/spx.svg)

The new and rewritten version of [spx](https://github.com/SPGoding/spx), the ultimate MCBBS newslord utility.

## Components

### SPXX User Script™

Adds a "Copy BBCode" button to Minecraft.net, feedback.minecraft.net and help.minecraft.net articles and Tweets,
which sets the [BBCode][bbcode] representation of this blog article to your clipboard.

You can use browser extensions like [Tampermonkey][tampermonkey] to install this script from URL: `https://cdn.jsdelivr.net/npm/@spxx/userscript/dist/bundle.user.js`

### SPXX Web Dashboard™

Replacing the SPX Discord Bot™, the SPXX Web Dashboard™ Provides means for a selection of trusted individuals to translate the summaries of _Minecraft: Java Edition_ bugs. Also, it provides a list of Minecraft.net blogs for translators to navigate.

Translations done in the (SPXFellow-Hosted™ SPXX Web Dashboard™)™ is not yet accessible at [https://spx.spgoding.com/bugs][bugs], and
will be utilized by the SPXX User Script™ to auto translate the "Fixed bugs" section in _Minecraft: Java Edition_.

## Credits

- [SPGoding](https://github.com/SPGoding) - maintained the OG spx.
- [RicoloveFeng](https://github.com/RicoloveFeng) - maintains [minecraft.net-translations](https://github.com/RicoloveFeng/minecraft.net-translations/blob/master/rawtable.csv).

## Contributing

Development environment: [Node.js LTS][node] and [Yarn][yarn]

- `yarn` to install dependencies.
- `yarn run build` to compile the TypeScript code.
- `yarn run start` to start the compiled SPXX Web Dashboard™.
- `./out/user_script.js` is the compiled SPXX User Script™.

[bbcode]: https://en.wikipedia.org/wiki/BBCode
[bugs]: https://spx.spgoding.com/bugs
[node]: https://nodejs.org/
[yarn]: https://yarnpkg.com/
[tampermonkey]: https://www.tampermonkey.net
[user-script]: https://spx.spgoding.com/user-script
