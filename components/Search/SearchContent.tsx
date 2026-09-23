import { useRef, useState, useMemo, useCallback, useContext, useEffect } from 'react'
import Fuse from 'fuse.js'
import { SearchIcon } from '@chakra-ui/icons'
import {
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ModalBody,
  ModalHeader,
  ModalContent,
  Box,
  Text,
} from '@chakra-ui/react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { SearchResultItem } from './SearchResultItem'
import { useDebounce } from './useDebounce'
import { ThemeContext } from '../../util/themecontext'
import { OrgRoamNode } from '../../api'
import { NodeById } from '../../pages'

export type SearchableNode = OrgRoamNode & { content: string }

export const SearchContent: React.FC<{
  nodeById: NodeById
  contentById: { [id: string]: string }
  contentLoading: boolean
  onClickResultItem: (id: string) => void
}> = ({ nodeById, contentById, contentLoading, onClickResultItem }) => {
  const { emacsTheme } = useContext(ThemeContext)
  type Theme = { [color: string]: string }
  const themeColors = emacsTheme[1] as Theme
  const inputValue = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<Fuse.FuseResult<SearchableNode>[]>([])

  // A word typed via IME (e.g. Pinyin) fires `onChange` with the in-progress
  // romanization on every keystroke; searching that garbles results and the
  // constant re-render can fight the IME's candidate window. Only search
  // once composition actually commits.
  const isComposingRef = useRef(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 200)

  // Indexed from the nodes org-roam-ui already has in memory (sent over the
  // websocket by Emacs) plus each node's file text, fetched lazily once by
  // the parent `Search' component -- so results stay in sync with the notes
  // currently loaded without a separate index-build step.
  const fuse = useMemo(() => {
    const list: SearchableNode[] = Object.values(nodeById)
      .filter((node): node is OrgRoamNode => !!node)
      .map((node) => ({
        ...node,
        // Drop property drawers and #+keyword lines; they're noise for
        // both matching and the result excerpt.
        content: (contentById[node.id] ?? '').replace(/^[ \t]*(:\S.*|#\+\S.*)$/gm, ''),
      }))
    return new Fuse(list, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'tags', weight: 0.25 },
        { name: 'olp', weight: 0.15 },
        { name: 'content', weight: 0.3 },
      ],
      // Titles rank first because they're weighted highest above; this only
      // keeps genuinely close matches instead of Fuse's default 0.6, which
      // surfaces a lot of loosely-related noise.
      threshold: 0.3,
      minMatchCharLength: 2,
      ignoreLocation: true,
      includeMatches: true,
    })
  }, [nodeById, contentById])

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([])
      return
    }
    setResults(fuse.search(debouncedQuery))
  }, [debouncedQuery, fuse])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposingRef.current) {
      return
    }
    setQuery(e.target.value)
  }, [])

  const onCompositionStart = useCallback(() => {
    isComposingRef.current = true
  }, [])

  const onCompositionEnd = useCallback((e: React.CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false
    setQuery(e.currentTarget.value)
  }, [])

  return (
    <ModalContent>
      <ModalHeader>
        <InputGroup borderColor={themeColors['fg']}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon />
          </InputLeftElement>
          <Input
            type="text"
            ref={inputValue}
            onChange={onChange}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder="Search node"
          />
        </InputGroup>
        {contentLoading && (
          <Text fontSize="xs" opacity={0.6} marginTop={1}>
            Loading note text for full-text search…
          </Text>
        )}
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
