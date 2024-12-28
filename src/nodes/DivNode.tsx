import { Input, Output } from '../components/Ports'

import ElementBase from '../components/BaseElementNode';
import { Node, NodeProps } from '@xyflow/react';

type DivNode = Node<{ children: Node[], element: string }, 'div'>

export default function DivNode({ id, data }: NodeProps<DivNode>) {
    return (
    <ElementBase name="Div">
        <Output
            id='element'
            label='Element'
        />

        <Input
            id='element'
            label='Children'
            limit={false}
            property='children'
        />
    </ElementBase>
    )
}

