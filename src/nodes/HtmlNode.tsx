import { Input } from '../components/Nodes/Ports'

import ElementBase, { ElementTag } from '../components/Nodes/BaseElementNode'
import { ElementNodeData } from '../components/types'

import type { Node, NodeProps } from '@xyflow/react'

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
