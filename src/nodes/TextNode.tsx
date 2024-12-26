import { Node, NodeProps } from '@xyflow/react'

import ElementBase from '../components/BaseElementNode.js'
import { Output } from '../components/Ports'

type TextNode = Node<{ text: string }, 'text'>

export default function TextNode({ id, data }: NodeProps<TextNode>) {
    return (
    <ElementBase name="Text" height={300}>
        <textarea className='w-full h-full'>

        </textarea>
    </ElementBase>
    )
}

