# `remark-shiki`

Highlight code blocks in markdown with
[`shiki`](https://github.com/shikijs/shiki).

## How to install

```sh
yarn add @stefanprobst/remark-shiki
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
const withShiki = require("@stefanprobst/remark-shiki")
const toMarkdown = require("remark-stringify")

const doc = "```js\nconst hello = 'World';\n```\n"

const processor = unified().use(fromMarkdown).use(withShiki).use(toMarkdown)

processor.process(doc).then((vfile) => {
  console.log(vfile.toString())
})
````

When transforming to html, make sure to parse `html` nodes with `rehype-raw`:

````js
const unified = require("unified")
const fromMarkdown = require("remark-parse")
const withShiki = require("../src")
const toHast = require("remark-rehype")
const withHtmlInMarkdown = require("rehype-raw")
const toHtml = require("rehype-stringify")

const doc = "```js\nconst hello = 'World';\n```\n"

const processor = unified()
  .use(fromMarkdown)
  .use(withShiki)
  .use(toHast, { allowDangerousHtml: true })
  .use(withHtmlInMarkdown)
  .use(toHtml)

processor.process(doc).then((vfile) => {
  console.log(vfile.toString())
})
````

## Options

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

const processor = unified()
  .use(fromMarkdown)
  .use(withShiki, { theme: gloom })
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

const processor = unified()
  .use(fromMarkdown)
  .use(withShiki, { langs: [...shiki.BUNDLED_LANGUAGES, sparql] })
  .use(toMarkdown)
```

Note that `langs` will substitute the default languages. To keep the built-in
grammars, concat `shiki.BUNDLED_LANGUAGES`.
