import path from 'path'

// A note's `file:' links (images, HTML demos, attachments) are relative to
// the note's own file.  Emacs serves them, whatever their type, from its
// `img' servlet.

// The path a `file:' link points to, resolved against the note's FILE.
export const resourcePath = (link: string, file: string) => {
  // uniorg-rehype URI-encodes file links; decode before re-encoding below.
  const target = decodeURI(link.replace(/^file:/, '').replace(/::.*$/, ''))
  return path.isAbsolute(target) || target.startsWith('~')
    ? target
    : path.join(path.dirname(file), target)
}

// The URL serving the resource at FULLPATH, or undefined if it cannot be served.
export const resourceUrl = (fullPath: string): string | undefined =>
  `http://localhost:35901/img/${encodeURIComponent(encodeURIComponent(fullPath))}`
