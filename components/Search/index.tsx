import { IconButton, Modal, ModalOverlay, Tooltip, useDisclosure } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { NodeObject } from 'force-graph'
import { SearchContent } from './SearchContent'
import { useCallback } from 'react'
import { NodeById } from '../../pages'

export const Search: React.FC<{
  nodeById: NodeById
  setPreviewNode: (newPresent: NodeObject) => void
  onClickResultItem?: (nodeId: string) => void
}> = ({ nodeById, setPreviewNode, onClickResultItem }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleOnClickResultItem = useCallback(
    (id: string) => {
      const node = nodeById[id]
      onClose()
      if (!!node) {
        setPreviewNode(node)
        history.replaceState(null, '', window.location.pathname + `#${node.id}`)
        if (onClickResultItem) onClickResultItem(node.id)
      }
    },
    [nodeById, onClickResultItem, onClose, setPreviewNode],
  )

  return (
    <>
      <Tooltip label="Search node">
        <IconButton
          m={1}
          aria-label="Search node"
          variant="subtle"
          icon={<SearchIcon />}
          onClick={(e) => {
            e.currentTarget.blur()
            onOpen()
          }}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <SearchContent nodeById={nodeById} onClickResultItem={handleOnClickResultItem} />
      </Modal>
    </>
  )
}
