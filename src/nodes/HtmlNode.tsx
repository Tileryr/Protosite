import { Input } from '../components/Ports'

import ElementBase, { ElementTag } from '../components/BaseElementNode'
import { ElementNodeData } from '../components/types'

import type { Node, NodeProps } from '@xyflow/react'

// type HtmlNode = Node<{ children: Node[], element: string }, 'html'>
type HTMLElementData = ElementNodeData & { children: Node[] }
export type HTMLNode = Node<HTMLElementData>

export default function HtmlNode({ id, data }: NodeProps<HTMLNode>) {
    const tags: ElementTag[] = [
        { name: "HTML", value: "body" }
    ]
    
    return (
        <ElementBase name="HTML" output={false} tags={tags} id={id} data={data}>
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            />
        </ElementBase>
    )
}
