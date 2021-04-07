import { Plugin } from 'unified'
import { HighlighterOptions } from 'shiki'

declare namespace withShiki {
  interface Options {
    theme?: HighlighterOptions['theme']
    langs?: HighlighterOptions['langs']
  }
}

declare const withShiki: Plugin<[withShiki.Options?]>

export = withShiki
