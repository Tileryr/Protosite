import { Port, useInput } from '../components/Nodes/Ports'
import ElementBase, { ElementNodeData, ElementTag } from '../components/Nodes/ElementBase'
import type { Node, NodeProps } from '@xyflow/react'

type HTMLNode = Node<ElementNodeData, 'html'>

export default function HtmlNode({ id, data }: NodeProps<HTMLNode>) {
    const childrenInputProps = useInput({
        portID: "element",
        limit: false,
        onConnection: (newChild) => {
            data.updateElement('children', newChild)
        }
    })

    const tags: ElementTag[] = [
        { name: "HTML", value: "body" }
    ]
    
    return (
        <ElementBase tags={tags} data={data} output={false}>
            <Port
                {...childrenInputProps}
                label='Children'
            />
        </ElementBase>
    )
}
