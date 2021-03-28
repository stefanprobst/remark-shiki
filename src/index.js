const shiki = require('shiki')
const visit = require('unist-util-visit')

function attacher(options = {}) {
  const theme = options.theme !== undefined ? options.theme : 'nord'

  return transformer

  async function transformer(tree) {
    /**
     * Since `getHighlighter` is async, this means that the `unified` processor
     * cannot be run with `processSync`. We could accept a `shiki` instance via
     * plugin options to get around this.
     */
    const highlighter = await shiki.getHighlighter({ theme })

    visit(tree, 'code', visitor)

    function visitor(node) {
      const highlighted = highlighter.codeToHtml(node.value, node.lang)
      node.type = 'html'
      node.value = highlighted
    }
  }
}

module.exports = attacher
