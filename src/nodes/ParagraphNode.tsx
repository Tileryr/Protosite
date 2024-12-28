import { Input, Output } from '../components/Ports'

import ElementBase from '../components/BaseElementNode'
import { Node, NodeProps } from '@xyflow/react'

type ParagraphNode = Node<{ text: string, element: string }, 'paragraph'>

export default function ParagraphNode({ id, }: NodeProps<ParagraphNode>) {
    return (
    <ElementBase name="Paragraph">
        <Output
            id='element'
            label='Element'
        />
        <Input
            id='string'
            label='String'
            limit={true}
            property='text'
        />
    </ElementBase>
    )
}