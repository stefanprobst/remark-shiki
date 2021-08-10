# `remark-shiki`

Highlight code blocks in markdown with
[`shiki`](https://github.com/shikijs/shiki).

## How to install

```sh
yarn add shiki @stefanprobst/remark-shiki
```

## How to use

This package is a [`remark`](https://github.com/remarkjs/remark) plugin.

Note that `shiki` only runs async, so you must use the `process`, not the
`processSync` method on your [`unified`](https://github.com/unifiedjs/unified)
processor.

To highlight code blocks in markdown:

````js
const unified = require("unified")
const fromMarkdown = require("remark-parse")
const shiki = require("shiki")
const withShiki = require("@stefanprobst/remark-shiki")
const toMarkdown = require("remark-stringify")

const doc = "```js\nconst hello = 'World';\n```\n"

async function createProcessor() {
  const highlighter = await shiki.getHighlighter({ theme: "poimandres " })

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

When transforming to html, make sure to parse `html` nodes with `rehype-raw`:

````js
const unified = require("unified")
const fromMarkdown = require("remark-parse")
const shiki = require("shiki")
const withShiki = require("@stefanprobst/remark-shiki")
const toHast = require("remark-rehype")
const withHtmlInMarkdown = require("rehype-raw")
const toHtml = require("rehype-stringify")

const doc = "```js\nconst hello = 'World';\n```\n"

async function createProcessor() {
  const highlighter = await shiki.getHighlighter({ theme: "poimandres " })

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
  fs.readFileSync(path.join(process.cwd(), "gloom.json"), "utf-8"),
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
  id: "sparql",
  scopeName: "source.sparql",
  // provide either `path` or `grammar`
  path: path.join(process.cwd(), "sparql.tmLanguage.json"),
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
