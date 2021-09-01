import type { Plugin } from 'unified'
import type { Highlighter } from 'shiki'

export interface Options {
  highlighter: Highlighter
  /** @default true */
  ignoreUnknownLanguage?: boolean
}

declare const withShiki: Plugin<[Options]>

export default withShiki
