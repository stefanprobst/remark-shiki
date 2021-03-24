const fs = require('fs')
const withHtmlInMarkdown = require('rehype-raw')
const toHtml = require('rehype-stringify')
const fromMarkdown = require('remark-parse')
const toHast = require('remark-rehype')
const unified = require('unified')
const withShiki = require('../src')

const fixture = fs.readFileSync(__dirname + '/fixtures/test.md', {
  encoding: 'utf-8',
})

const processor = unified()
  .use(fromMarkdown)
  .use(withShiki)
  .use(toHast, { allowDangerousHtml: true })
  .use(withHtmlInMarkdown)
  .use(toHtml)



it('highlights code blocks in markdown', async () => {
  const vfile = await processor.process(fixture)
  expect(vfile.toString()).toMatchInlineSnapshot(`
    "<h1>Heading</h1>
    <p>Text</p>
    <pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #D8DEE9\\">hello</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #A3BE8C\\">World</span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #81A1C1\\">;</span></span></code></pre>
    <p>More text</p>"
  `)
})
