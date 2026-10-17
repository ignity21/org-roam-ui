import { Plugin } from 'unified'

// Languages whose src blocks are diagram sources: once the block has a
// `#+RESULTS:' (the rendered image), the note shows only the image.
const diagramLanguages = new Set(['plantuml'])

type OrgParent = { children?: OrgParent[]; type: string; [key: string]: any }

const isRenderedDiagram = (node: OrgParent, next?: OrgParent) =>
  node.type === 'src-block' &&
  diagramLanguages.has(node.language) &&
  next?.affiliated?.RESULTS !== undefined

const prune = (node: OrgParent) => {
  if (!node.children) {
    return
  }
  node.children = node.children.filter(
    (child, i, siblings) => !isRenderedDiagram(child, siblings[i + 1]),
  )
  node.children.forEach(prune)
}

// uniorg plugin removing rendered diagram sources from the tree.
export const hideDiagramSources: Plugin = () => (tree) => {
  prune(tree as OrgParent)
}
