// Static (published) mode: built with NEXT_PUBLIC_STATIC=1, the UI reads a
// pre-exported snapshot of the graph instead of talking to Emacs.  The
// snapshot is laid out next to the page as
//   data/graphdata.json   the `graphdata` message payload
//   data/variables.json   the `variables` message payload
//   data/notes/<id>.org   what the `/node/:id` servlet returns
//   files/<path>          note resources, by path relative to the roam root
export const isStatic = process.env.NEXT_PUBLIC_STATIC === '1'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const staticUrl = (path: string) => `${basePath}/${path}`

export const nodeTextUrl = (id: string) =>
  isStatic
    ? staticUrl(`data/notes/${encodeURIComponent(id)}.org`)
    : `http://localhost:35901/node/${encodeURIComponent(encodeURIComponent(id))}`
