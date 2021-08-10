const visit = require('unist-util-visit')

function attacher(options) {
  const highlighter = options.highlighter

  return transformer

  async function transformer(tree) {
    visit(tree, 'code', visitor)

    function visitor(node) {
      const highlighted = highlighter.codeToHtml(node.value, node.lang)
      node.type = 'html'
      node.value = highlighted
    }
  }
}

module.exports = attacher
