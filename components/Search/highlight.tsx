import Fuse from 'fuse.js'
import { Text } from '@chakra-ui/react'

export const highlightMatches = (text: string, indices: readonly Fuse.RangeTuple[] = []) => {
  const children: React.ReactNode[] = []
  let nextNoMatchedIndex = 0

  indices.forEach((idc, i) => {
    const lastRegionNextIndex = idc[1] + 1
    children.push(
      ...[
        text.substring(nextNoMatchedIndex, idc[0]).replace(' ', ' '),
        <Text key={idc + ' ' + i} as="u">
          {text.substring(idc[0], lastRegionNextIndex).replace(' ', ' ')}
        </Text>,
      ],
    )
    nextNoMatchedIndex = lastRegionNextIndex
  })

  children.push(text.substring(nextNoMatchedIndex).replace(' ', ' '))

  return <>{children}</>
}
