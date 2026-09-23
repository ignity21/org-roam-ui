import { ListItem, Tag, Wrap, WrapItem, Heading } from '@chakra-ui/react'
import Fuse from 'fuse.js'
import { useContext, useMemo } from 'react'
import { ThemeContext } from '../../util/themecontext'
import { highlightMatches } from './highlight'
import { OrgRoamNode } from '../../api'

type Props = {
  result: Fuse.FuseResult<OrgRoamNode>
  onClick: (id: string) => void
}

export const SearchResultItem: React.FC<Props> = ({ result, onClick }) => {
  const { highlightColor, emacsTheme } = useContext(ThemeContext)
  type Theme = { [color: string]: string }
  const themeColors = emacsTheme[1] as Theme
  const { id, tags, title } = result.item
  const matches = result.matches

  const titleMatches = useMemo(() => {
    return matches?.find((m) => m.key === 'title')
  }, [matches])

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
        {titleMatches ? highlightMatches(title, titleMatches.indices) : title}
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
    </ListItem>
  )
}
