import { Input, Output } from '../components/Ports'

import ElementBase, { ElementTag } from '../components/BaseElementNode'
import { Node, NodeProps } from '@xyflow/react'
import { ElementNodeData } from '../components/types'

type TextElementData = ElementNodeData & { text: string }
type ParagraphNode = Node<TextElementData, 'paragraph'>

export default function ParagraphNode({ id, data }: NodeProps<ParagraphNode>) {
    const tags: ElementTag[] = [
        { name: "Paragraph", value: "p" },
        { name: "Span", value: "span" },
        { name: "Ordered List", value: "ol" }
    ]

    return (
    <ElementBase name="Paragraph" output={true} type='element' tags={tags} id={id} data={data}>
        <Input
            id='string'
            label='Text'
            limit={true}
            property='text'
        />
    </ElementBase>
    )
}