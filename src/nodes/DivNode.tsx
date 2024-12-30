import { Input, Output } from '../components/Ports'

import ElementBase, { ElementTag } from '../components/BaseElementNode';
import { Node, NodeProps } from '@xyflow/react';
import { ElementNodeData } from '../components/types';

type SectioningElementData = ElementNodeData & { children: Node[] }
type DivNode = Node<SectioningElementData, 'div'>

export default function DivNode({ id, data }: NodeProps<DivNode>) {
    const tags: ElementTag[] = [
        {name: 'Div', value: 'div'},
        {name: 'Section', value: 'section'}
    ]
    
    return (
    <ElementBase name="Div" output={true} type='element' tags={tags} id={id} data={data}>
        <Input
            id='element'
            label='Children'
            limit={false}
            property='children'
        />
    </ElementBase>
    )
}

