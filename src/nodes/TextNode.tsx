import { ChangeEvent, useCallback, useState } from 'react'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'

import ElementBase from '../components/BaseElementNode.js'
import { Output } from '../components/Ports'

type TextNodeData = {
    string: string
}

type TextNode = Node<TextNodeData, 'text'>

export default function TextNode({ id, data }: NodeProps<TextNode>) {
    const { updateNodeData } = useReactFlow();

    const onChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(id, { string: event.target.value })
        console.log(event.target.value)
        console.log(data)
    }, [])

    return (
        <ElementBase name="Text" height={300}>
            <Output 
                id='string'
                label='Text'
            />
            <textarea className='w-full h-full nodrag' onChange={onChange} >

            </textarea>
        </ElementBase>
    )
}

