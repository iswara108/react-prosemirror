import { Plugin, PluginKey } from 'prosemirror-state'

export const readOnlyPlugin = () =>
  new Plugin({
    key: new PluginKey('Read Only Plugin'),
    filterTransaction: transaction => !transaction.docChanged
  })
