import { Input } from '../components/Nodes/Ports'
import ElementBase, { ElementNodeData, ElementTag } from '../components/Nodes/ElementBase'
import type { Node, NodeProps } from '@xyflow/react'

type HTMLNode = Node<ElementNodeData, 'html'>

export default function HtmlNode({ id, data }: NodeProps<HTMLNode>) {
    const tags: ElementTag[] = [
        { name: "HTML", value: "body" }
    ]
    
    return (
        <ElementBase tags={tags} id={id} data={data} output={false}>
            <Input
                id='element'
                label='Children'
                limit={false}
                property='children'
            />
        </ElementBase>
    )
}
