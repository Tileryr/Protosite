import { Input } from '../components/Nodes/Ports'

import ElementBase, { ElementTag } from '../components/Nodes/ElementBase';
import { Node, NodeProps } from '@xyflow/react';
import { ElementNodeData } from '../components/types';

type SectioningElementData = ElementNodeData
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

