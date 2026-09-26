import path from 'path'
import { isStatic, staticUrl } from './static'

// A note's `file:' links (images, HTML demos, attachments) are relative to
// the note's own file.  Emacs serves them, whatever their type, from its
// `img' servlet; a static snapshot has copies of those under the roam root,
// by path relative to it, in `files/'.

// The path a `file:' link points to, resolved against the note's FILE.
export const resourcePath = (link: string, file: string) => {
  // uniorg-rehype URI-encodes file links; decode before re-encoding below.
  const target = decodeURI(link.replace(/^file:/, '').replace(/::.*$/, ''))
  return path.isAbsolute(target) || target.startsWith('~')
    ? target
    : path.join(path.dirname(file), target)
}

// The URL serving the resource at FULLPATH, or undefined if it cannot be served.
export const resourceUrl = (fullPath: string): string | undefined => {
  if (!isStatic) {
    return `http://localhost:35901/img/${encodeURIComponent(encodeURIComponent(fullPath))}`
  }
  // Node files are relative in a snapshot; anything else lies outside it.
  if (path.isAbsolute(fullPath) || fullPath.startsWith('~') || fullPath.startsWith('../')) {
    return undefined
  }
  return staticUrl(`files/${fullPath.split('/').map(encodeURIComponent).join('/')}`)
}
