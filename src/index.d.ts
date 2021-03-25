import { Plugin } from 'unified'

declare namespace withShiki {
  interface Options {
    theme?: string
  }
}

declare const withShiki: Plugin<[withShiki.Options?]>

export = withShiki
