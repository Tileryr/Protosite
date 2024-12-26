import { Input } from '../components/Ports'

import ElementBase from '../components/BaseElementNode'
import type { Node, NodeProps } from '@xyflow/react'

type HtmlNode = Node<{ children: Node[], element: string }, 'html'>

export default function HtmlNode({ id, data }: NodeProps<HtmlNode>) {
    return (
        <ElementBase name="HTML">
            <Input
                id='node'
                label='Children'
                limit={false}
            />
        </ElementBase>
    )
}
