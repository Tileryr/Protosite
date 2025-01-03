import { ChangeEvent, useCallback, useState } from 'react'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'

import { ElementNodeData } from '../components/types.js'
import OutputNode from '../components/BaseOutputNode.js'

type TextNodeData = {
    string: string
}

type TextNode = Node<TextNodeData, 'text'>

// DO RIGHT NOW SEPERATE TEXT FROM BASEELEMENT

export default function TextNode({ id, data }: NodeProps<TextNode>) {
    const { updateNodeData } = useReactFlow();

    const onChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(id, { string: event.target.value })
        console.log(event.target.value)
        console.log(data)
    }, [])
        
    return (
        <OutputNode name="Text" height={300} type='string'>
            <textarea className='w-full h-full nodrag' onChange={onChange} aria-label='text'>

            </textarea>
        </OutputNode>
    )
}

