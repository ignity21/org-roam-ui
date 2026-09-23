import { useRef, useState, useMemo, useCallback, useContext } from 'react'
import Fuse from 'fuse.js'
import { SearchIcon } from '@chakra-ui/icons'
import {
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ModalBody,
  ModalContent,
  ModalHeader,
  Box,
} from '@chakra-ui/react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { SearchResultItem } from './SearchResultItem'
import { ThemeContext } from '../../util/themecontext'
import { OrgRoamNode } from '../../api'
import { NodeById } from '../../pages'

export const SearchContent: React.FC<{
  nodeById: NodeById
  onClickResultItem: (id: string) => void
}> = ({ nodeById, onClickResultItem }) => {
  const { emacsTheme } = useContext(ThemeContext)
  type Theme = { [color: string]: string }
  const themeColors = emacsTheme[1] as Theme
  const inputValue = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<Fuse.FuseResult<OrgRoamNode>[]>([])

  // Indexed straight from the nodes org-roam-ui already has in memory (sent
  // over the websocket by Emacs), so results always match the notes
  // currently loaded -- no separate search-index build step to keep in sync.
  const fuse = useMemo(
    () =>
      new Fuse(Object.values(nodeById).filter(Boolean) as OrgRoamNode[], {
        keys: ['title', 'tags', 'olp'],
        minMatchCharLength: 2,
        includeMatches: true,
      }),
    [nodeById],
  )

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setResults(fuse.search(e.target.value))
    },
    [fuse],
  )

  return (
    <ModalContent>
      <ModalHeader>
        <InputGroup borderColor={themeColors['fg']}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input type="text" ref={inputValue} onChange={onChange} placeholder="Search node" />
        </InputGroup>
      </ModalHeader>
      {!!results.length && (
        <Scrollbars
          autoHeight={true}
          autoHide={true}
          autoHeightMax={500}
          renderThumbVertical={({ style, ...props }) => (
            <Box
              style={{
                ...style,
                borderRadius: 0,
              }}
              {...props}
            />
          )}
        >
          <ModalBody maxHeight={500}>
            <List spacing={3}>
              {results.map((result) => (
                <SearchResultItem
                  key={result.item.id}
                  result={result}
                  onClick={onClickResultItem}
                />
              ))}
            </List>
          </ModalBody>
        </Scrollbars>
      )}
    </ModalContent>
  )
}
