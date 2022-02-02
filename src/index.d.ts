import type { Plugin } from 'unified'
import type { Highlighter, HtmlRendererOptions } from 'shiki'
import type * as Mdast from 'mdast'

export interface Options {
  highlighter: Highlighter
  parseMeta?: (
    meta: string | undefined,
    node: Mdast.Code,
  ) => HtmlRendererOptions['lineOptions']
  /** @default true */
  ignoreUnknownLanguage?: boolean
}

declare const withShiki: Plugin<[Options]>

export default withShiki
