import { ChangeEvent, useCallback, useState } from 'react'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'

import ElementBase, { ElementTag } from '../components/BaseElementNode.js'
import { Output } from '../components/Ports'
import { ElementNodeData } from '../components/types.js'

type TextNodeData = ElementNodeData & {
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

    const tags: ElementTag[] = [
        { name: "HTML", value: "body" }
    ]
        
    return (
        <ElementBase name="Text" height={300} output={true} type='string' tags={tags} id={id} data={data}>
            <textarea className='w-full h-full nodrag' onChange={onChange} aria-label='text'>

            </textarea>
        </ElementBase>
    )
}

