declare module 'prosemirror-example-setup' {
  import { keymap } from 'prosemirror-keymap'
  import { history } from 'prosemirror-history'
  import { baseKeymap } from 'prosemirror-commands'
  import { Plugin } from 'prosemirror-state'
  import { dropCursor } from 'prosemirror-dropcursor'
  import { gapCursor } from 'prosemirror-gapcursor'
  import { menuBar, MenuElement } from 'prosemirror-menu'
  import { Schema } from 'prosemirror-model'

  export type MapKeys = { [key: string]: string }
  export function buildMenuItems(schema: Schema): void {}
  export function buildKeymap(schema: Schema, mapKeys: MapKeys): void {}
  export function buildInputRules(schema: Schema): Plugin {}
  export function exampleSetup(options: {
    schema?: Schema
    mapKeys?: MapKeys
    menuBar?: boolean
    history?: boolean
    floatingMenu?: boolean
    menuContent?: MenuElement<typeof schema>
  }): Plugin[] {}
}
