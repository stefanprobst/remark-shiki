const shiki = require('shiki')
const visit = require('unist-util-visit')

function attacher(options = {}) {
  const theme = options.theme !== undefined ? options.theme : 'nord'
  const langs = options.langs !== undefined ? options.langs : undefined

  return transformer

  async function transformer(tree) {
    /**
     * Since `getHighlighter` is async, this means that the `unified` processor
     * cannot be run with `processSync`. We could accept a `highlighter` instance
     * via plugin options to get around this.
     */
    const highlighter = await shiki.getHighlighter({ theme, langs })

    visit(tree, 'code', visitor)

    function visitor(node) {
      const highlighted = highlighter.codeToHtml(node.value, node.lang)
      node.type = 'html'
      node.value = highlighted
    }
  }
}

module.exports = attacher
