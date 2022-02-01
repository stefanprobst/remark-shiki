import { visit } from 'unist-util-visit'

const MISSING_HIGHLIGHTER = `Please, provide a valid configuration: .use(remarkShiki, { /* Missing configuration */ highlighter })\n\nCheck \`README.md\` for details`;

export default function attacher(options) {
  if (!options?.highlighter) throw MISSING_HIGHLIGHTER;
  
  const highlighter = options.highlighter
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
