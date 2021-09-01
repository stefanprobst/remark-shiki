import { visit } from 'unist-util-visit'

export default function attacher(options) {
  const highlighter = options.highlighter
  const loadedLanguages = highlighter.getLoadedLanguages()
  const ignoreUnknownLanguage =
    options.ignoreUnknownLanguage == null ? true : options.ignoreUnknownLanguage

  return transformer

  async function transformer(tree) {
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
