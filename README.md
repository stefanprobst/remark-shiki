# `remark-shiki`

Highlight code blocks in markdown with
[`shiki`](https://github.com/shikijs/shiki).

## How to install

```sh
yarn add shiki @stefanprobst/remark-shiki
```

## How to use

This package is a [`remark`](https://github.com/remarkjs/remark) plugin.

To highlight code blocks in markdown:

````js
import withShiki from '@stefanprobst/remark-shiki'
import toMarkdown from 'remark-stringify'
import fromMarkdown from 'remark-parse'
import * as shiki from 'shiki'
import { unified } from 'unified'

const doc = "```js\nconst hello = 'World';\n```\n"

async function createProcessor() {
  const highlighter = await shiki.getHighlighter({ theme: 'poimandres' })

  const processor = unified()
    .use(fromMarkdown)
    .use(withShiki, { highlighter })
    .use(toMarkdown)

  return processor
}

createProcessor()
  .then((processor) => processor.process(doc))
  .then((vfile) => {
    console.log(String(vfile))
  })
````

When transforming to html, make sure to parse `html` nodes with `rehype-raw`
(or, alternatively, consider using
[`@stefanprobst/rehype-shiki`](https://github.com/stefanprobst/rehype-shiki)):

````js
import withShiki from '@stefanprobst/remark-shiki'
import fromMarkdown from 'remark-parse'
import * as shiki from 'shiki'
import { unified } from 'unified'
import toHast from 'remark-rehype'
import withHtmlInMarkdown from 'rehype-raw'
import toHtml from 'rehype-stringify'

const doc = "```js\nconst hello = 'World';\n```\n"

async function createProcessor() {
  const highlighter = await shiki.getHighlighter({ theme: 'poimandres' })

  const processor = unified()
    .use(fromMarkdown)
    .use(withShiki, { highlighter })
    .use(toHast, { allowDangerousHtml: true })
    .use(withHtmlInMarkdown)
    .use(toHtml)

  return processor
}

createProcessor()
  .then((processor) => processor.process(doc))
  .then((vfile) => {
    console.log(String(vfile))
  })
````

## Configuration

This plugin accepts a preconfigured `highlighter` instance created with
`shiki.getHighlighter`.

### Theme

You can either pass one of the
[built-in themes](https://github.com/shikijs/shiki/blob/master/docs/themes.md#all-themes)
as string, or load a custom theme (any TextMate/VS Code theme should work):

```js
// const gloom = await shiki.loadTheme(path.join(process.cwd(), 'gloom.json'))
// const gloom = require('./gloom.json')
const gloom = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'gloom.json'), 'utf-8'),
)

const highlighter = await shiki.getHighlighter({ theme: gloom })

const processor = unified()
  .use(fromMarkdown)
  .use(withShiki, { highlighter })
  .use(toMarkdown)
```

### Supported languages

Languages which are not included in Shiki's
[built-in grammars](https://github.com/shikijs/shiki/blob/master/docs/languages.md#all-languages)
can be added as TextMate grammars:

```js
const sparql = {
  id: 'sparql',
  scopeName: 'source.sparql',
  // provide either `path` or `grammar`
  path: path.join(process.cwd(), 'sparql.tmLanguage.json'),
  // grammar: JSON.parse(
  //   fs.readFileSync(path.join(process.cwd(), "sparql.tmLanguage.json")),
  // ),
}

const highlighter = await shiki.getHighlighter({
  langs: [...shiki.BUNDLED_LANGUAGES, sparql],
})

const processor = unified()
  .use(fromMarkdown)
  .use(withShiki, { highlighter })
  .use(toMarkdown)
```

Note that `langs` will substitute the default languages. To keep the built-in
grammars, concat `shiki.BUNDLED_LANGUAGES`.

### Unknown languages

Unknown languages are ignored by default. You can set
`ignoreUnknownLanguage: false` to throw an error when an unsupported language is
encountered.

### Highlighted lines

Code block metadata can be used to add css classes to specific lines. By
default, a `highlighted-line` class will be added for line ranges defined like
this:

````md
```js {highlight: '2..3'}
function hi() {
  console.log('Hi!')
  return true
}
```
````

Since there is no specification or widely used convention how code block
metadata should be interpreted, it is possible to provide a custom parse
function:

```js
const processor = unified()
  .use(fromMarkdown)
  .use(withShiki, {
    highlighter,
    parseMeta(meta) {
      /** Parse the meta string however you want. */
      return [
        { line: 1, classes: ['highlighted'], }
        { line: 2, classes: ['highlighted'], }
      ]
    },
  })
  .use(toMarkdown)
```
