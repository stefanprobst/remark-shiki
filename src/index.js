import json5 from 'json5'
import parseNumericRange from 'parse-numeric-range'
import { visit } from 'unist-util-visit'

const MISSING_HIGHLIGHTER = `Please provide a \`shiki\` highlighter instance via \`options\`.

Example:

const highlighter = await shiki.getHighlighter({ theme: 'poimandres' })
const processor = remark().use(withShiki, { highlighter })
`

export default function attacher(options = {}) {
  const highlighter = options.highlighter
  const parseMeta = options.parseMeta || parseMetaDefault

  if (!highlighter) {
    throw new Error(MISSING_HIGHLIGHTER)
  }

  const loadedLanguages = highlighter.getLoadedLanguages()
  const ignoreUnknownLanguage =
    options.ignoreUnknownLanguage == null ? true : options.ignoreUnknownLanguage

  return transformer

  function transformer(tree) {
    visit(tree, 'code', visitor)

    function visitor(node) {
      const lang =
        ignoreUnknownLanguage && !loadedLanguages.includes(node.lang)
          ? null
          : node.lang

      const lineOptions = parseMeta(node.meta, node)

      const highlighted = highlighter.codeToHtml(node.value, {
        lang,
        lineOptions,
      })

      node.type = 'html'
      node.value = highlighted
    }
  }
}

function parseMetaDefault(meta) {
  if (meta == null) return undefined
  if (meta.length === 0) return undefined

  try {
    const parsed = json5.parse(meta)
    if (parsed.highlight != null) {
      const highlighted = parseNumericRange(parsed.highlight)
      return highlighted.map((line) => {
        return { line, classes: ['highlighted-line'] }
      })
    }
    return undefined
  } catch {
    return undefined
  }
}
