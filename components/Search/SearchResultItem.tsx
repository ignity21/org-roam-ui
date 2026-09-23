import { ListItem, Tag, Text, Wrap, WrapItem, Heading } from '@chakra-ui/react'
import Fuse from 'fuse.js'
import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../util/themecontext'
import { highlightMatches } from './highlight'
import { SearchableNode } from './SearchContent'

type Props = {
  result: Fuse.FuseResult<SearchableNode>
  onClick: (id: string) => void
}

const EXCERPT_RADIUS = 60

// Fuse gives match indices into the full note text; a search result should
// show a short excerpt around the match, not the whole note.
const buildExcerpt = (text: string, indices: readonly Fuse.RangeTuple[]) => {
  if (!indices.length) {
    return { excerpt: '', indices: [] as Fuse.RangeTuple[] }
  }
  const start = Math.max(0, indices[0][0] - EXCERPT_RADIUS)
  const end = Math.min(text.length, indices[indices.length - 1][1] + 1 + EXCERPT_RADIUS)
  const prefix = start > 0 ? '…' : ''
  const suffix = end < text.length ? '…' : ''
  const excerpt = prefix + text.slice(start, end).trim() + suffix
  const shift = prefix.length - start
  const shifted = indices
    .filter(([s, e]) => s >= start && e < end)
    .map(([s, e]) => [s + shift, e + shift] as Fuse.RangeTuple)
  return { excerpt, indices: shifted }
}

export const SearchResultItem: React.FC<Props> = ({ result, onClick }) => {
  const { highlightColor, emacsTheme } = useContext(ThemeContext)
  type Theme = { [color: string]: string }
  const themeColors = emacsTheme[1] as Theme
  const { id, tags, title, content } = result.item
  const matches = result.matches

  const titleMatch = useMemo(() => matches?.find((m) => m.key === 'title'), [matches])
  const contentMatch = useMemo(() => matches?.find((m) => m.key === 'content'), [matches])
  const contentExcerpt = useMemo(
    () => (contentMatch ? buildExcerpt(content, contentMatch.indices) : null),
    [content, contentMatch],
  )

  return (
    <ListItem
      p={2}
      borderRadius={4}
      cursor="pointer"
      bgColor={themeColors['bg-alt']}
      _hover={{ borderColor: highlightColor, color: highlightColor, opacity: 0.8 }}
      onClick={() => onClick(id)}
    >
      <Heading size="sm">
        {titleMatch ? highlightMatches(title, titleMatch.indices) : title}
      </Heading>
      {!!tags?.length && (
        <Wrap marginTop={2} spacingY={1}>
          {tags.map((t) => (
            <WrapItem key={t}>
              <Tag size="sm" colorScheme="blue">
                {t}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      )}
      {contentExcerpt && (
        <Text fontSize="sm" opacity={0.8} marginTop={2} noOfLines={3}>
          {highlightMatches(contentExcerpt.excerpt, contentExcerpt.indices)}
        </Text>
      )}
    </ListItem>
  )
}
