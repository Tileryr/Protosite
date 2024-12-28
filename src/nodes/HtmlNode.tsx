import { Input } from '../components/Ports'

import ElementBase from '../components/BaseElementNode'
import { HTMLElementNodeData } from '../components/types'

import type { Node, NodeProps } from '@xyflow/react'

// type HtmlNode = Node<{ children: Node[], element: string }, 'html'>
export type HTMLNode = Node<HTMLElementNodeData>

export default function HtmlNode({ id, data }: NodeProps<HTMLNode>) {
    return (
        <ElementBase name="HTML" output={false}>
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            />
        </ElementBase>
    )
}
