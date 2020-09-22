# rollup-plugin-constructable-css

A rollup plugin for loading css files as `CSSStyleSheet`s.

![Core](https://github.com/Alorel/rollup-plugin-constructable-css/workflows/Core/badge.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/rollup-plugin-constructable-css/badge.svg?branch=master)](https://coveralls.io/github/Alorel/rollup-plugin-constructable-css)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Alorel/rollup-plugin-constructable-css.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Alorel/rollup-plugin-constructable-css/context:javascript)

-----

# Installation

Add the registry to `.npmrc`:

```
@alorel:registry=https://npm.pkg.github.com
```

Then install it:

```
npm install @alorel/rollup-plugin-constructable-css
```

# Options

All options are standard rollup plugin options.

```typescript
interface ConstructableCssRollupPluginOpts {
  exclude?: FilterPattern;

  include: FilterPattern;

  /** @default false */
  preferConst?: boolean;

  /** @default true */
  sourceMap?: boolean;
}
```

# Usage

```javascript
import {constructableCssRollupPlugin} from '@alorel/rollup-plugin-constructable-css';

export default {
  // ...
  plugins: [
    constructableCssRollupPlugin({
      include: /\.constructed\.css/
    })
  ]
}
```
