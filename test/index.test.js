const fs = require('fs')
const withHtmlInMarkdown = require('rehype-raw')
const toHtml = require('rehype-stringify')
const fromMarkdown = require('remark-parse')
const toHast = require('remark-rehype')
const shiki = require('shiki')
const unified = require('unified')
const withShiki = require('../src')

const fixtures = {
  known: fs.readFileSync(__dirname + '/fixtures/test.md', {
    encoding: 'utf-8',
  }),
  none: fs.readFileSync(__dirname + '/fixtures/none.md', {
    encoding: 'utf-8',
  }),
  unknown: fs.readFileSync(__dirname + '/fixtures/unknown.md', {
    encoding: 'utf-8',
  }),
}

async function createProcessor(options = {}) {
  const highlighter = await shiki.getHighlighter({ theme: 'nord' })

  const processor = unified()
    .use(fromMarkdown)
    .use(withShiki, { highlighter, ...options })
    .use(toHast, { allowDangerousHtml: true })
    .use(withHtmlInMarkdown)
    .use(toHtml)

  return processor
}

it('highlights code block in markdown', async () => {
  const processor = await createProcessor()
  const vfile = await processor.process(fixtures.known)

  expect(vfile.toString()).toMatchInlineSnapshot(`
    "<h1>Heading</h1>
    <p>Text</p>
    <pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #81A1C1\\">const</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #D8DEE9\\">hello</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #81A1C1\\">=</span><span style=\\"color: #D8DEE9FF\\"> </span><span style=\\"color: #ECEFF4\\">\\"</span><span style=\\"color: #A3BE8C\\">World</span><span style=\\"color: #ECEFF4\\">\\"</span></span></code></pre>
    <p>More text</p>"
  `)
})

it('ignores code block without language', async () => {
  const processor = await createProcessor()

  const vfile = await processor.process(fixtures.none)

  expect(vfile.toString()).toMatchInlineSnapshot(`
    "<h1>Heading</h1>
    <p>Text</p>
    <pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #d8dee9ff\\">const hello = \\"World\\"</span></span></code></pre>
    <p>More text</p>"
  `)
})

it('ignores code block with unknown language', async () => {
  const processor = await createProcessor()

  const vfile = await processor.process(fixtures.unknown)

  expect(vfile.toString()).toMatchInlineSnapshot(`
    "<h1>Heading</h1>
    <p>Text</p>
    <pre class=\\"shiki\\" style=\\"background-color: #2e3440ff\\"><code><span class=\\"line\\"><span style=\\"color: #d8dee9ff\\">const hello = \\"World\\"</span></span></code></pre>
    <p>More text</p>"
  `)
})

it('throws when code block has unknown language and ignoreUnknownLanguage is set to false', async () => {
  const processor = await createProcessor({ ignoreUnknownLanguage: false })

  return expect(processor.process(fixtures.unknown)).rejects.toThrow(
    'No language registration for unknown',
  )
})
