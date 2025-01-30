import { Port, useInput } from '../components/Nodes/Ports'

import ElementBase, { ElementNodeData, ElementTag } from '../components/Nodes/ElementBase';
import { Node, NodeProps } from '@xyflow/react';

type DivNode = Node<ElementNodeData, 'div'>

export default function DivNode({ id, data }: NodeProps<DivNode>) {
    const childrenInputProps = useInput({
        portID: "element",
        limit: false,
        onConnection: (newChild) => {
            data.updateElement('children', newChild)
        }
    })

    const tags: ElementTag[] = [
        {name: 'Div', value: 'div'},
        {name: 'Section', value: 'section'},
        {name: 'Footer', value: 'footer'},
        {name: 'Header', value: 'header'},
    ]
    
    return (
    <ElementBase output={true} tags={tags} data={data}>
        <Port
            {...childrenInputProps}
            label='Children'
        />
    </ElementBase>
    )
}

