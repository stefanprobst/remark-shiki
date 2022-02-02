import { visit } from 'unist-util-visit'

const MISSING_HIGHLIGHTER = `Please provide a \`shiki\` highlighter instance via \`options\`.

Example:

const highlighter = await shiki.getHighlighter({ theme: 'poimandres' })
const processor = remark().use(withShiki, { highlighter })
`

export default function attacher(options = {}) {
  const highlighter = options.highlighter

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

      const highlighted = highlighter.codeToHtml(node.value, lang)
      node.type = 'html'
      node.value = highlighted
    }
  }
}
