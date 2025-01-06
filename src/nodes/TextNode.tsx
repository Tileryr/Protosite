import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'

import OutputNode from '../components/Nodes/BaseOutputNode.js'

type TextNodeData = {
    string: string
}

type TextNode = Node<TextNodeData, 'text'>

export default function TextNode({ id, data }: NodeProps<TextNode>) {
    const { updateNodeData } = useReactFlow();

    const textFieldRef = useRef<HTMLDivElement>(null)

    const [text, setText] = useState('');
    const [htmlText, setHtmlText] = useState('')

    const [boldActived, setBoldActivated] = useState(false)
    const [boldedText, setBoldedText] = useState<{start: number; end: number}[]>([])

    const onChange = (event: FormEvent<HTMLDivElement>) => {
        const newText = event.currentTarget.textContent ?? ''
        console.log(newText)
        setText(newText)
        setHtmlText(newText)
        updateNodeData(id, { string: newText })
    }

    const boldText = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        let selection = window.getSelection()
        if (selection) {
            let currentStart = selection.anchorOffset
            let currentEnd = selection.focusOffset

            //Swap so current start is always lesser
            currentStart > currentEnd && ([currentStart, currentEnd] = [currentEnd, currentStart])

            let innerHTML = textFieldRef.current!.innerHTML
    
            // let newHTML = wrap(innerHTML, 'strong', start, end)
            setBoldedText(prevBoldedText => {
                let mappedText = prevBoldedText.map(({start, end}) => {
                    let intersections = checkIntersections(currentStart, currentEnd, start, end)
                    return intersections ? intersections : {start, end}
                })

                //If intersected then dont add to list
                if(prevBoldedText.some(({start, end}) => checkIntersections(currentStart, currentEnd, start, end))) {
                    console.log(prevBoldedText)
                    console.log(mappedText)
                    return mappedText
                }

                return [...mappedText, {start: currentStart, end: currentEnd}]
            })

            // let newHTML = insert(innerHTML, currentStart, '<strong>')
            // textFieldRef.current!.innerHTML = newHTML
        }
       
        setBoldActivated(prev => !prev)
    }

    return (
        <OutputNode name="Text" height={200} type='string'>
            <button className={`hover:bg-${boldActived ? 'gray' : 'sky'}-300`} onClick={boldText}>B</button>
            <button className='hover:bg-gray-300' onClick={() => console.log(boldedText)}>I</button>
            <div contentEditable className='w-full h-full nodrag' ref={textFieldRef} onInput={onChange} aria-label='text'></div>
        </OutputNode>
    )
}

function insert(string: string, index: number, insertingString: string) {
    return string.substring(0, index) + insertingString + string.substring(index);
}

function wrap(string: string, wrapper: string, start: number, end: number) {
    let wrappedString
    wrappedString = insert(string, start, `<${wrapper}>`)
    wrappedString = insert(wrappedString, end + wrapper.length + 2, `</${wrapper}>`)
    return wrappedString
}

function checkIntersections(mainStart: number, mainEnd: number, comparedStart: number, comparedEnd: number) {
    // |  \ |  \ => |      |
    if(mainStart < comparedEnd && mainStart > comparedStart && mainEnd > comparedEnd) {
        console.log("IDK")
        return {start: comparedStart, end: mainEnd}
    }
    // \ |  \ | => |      |
    if(mainEnd < comparedEnd && mainEnd > comparedStart && mainStart < comparedStart ) {
        console.log("IKR")
        return {start: mainStart, end: comparedEnd}
    }
    // \ |   | \ => |       |
    if(mainStart < comparedStart && mainEnd > comparedEnd) {
        console.log("HEY")
        return {start: mainStart, end: mainEnd}
    }
    // | \   \ | => |       |
    if(mainStart > comparedStart && mainEnd < comparedEnd) {
        console.log("WOW")
        return {start: comparedStart, end: comparedEnd}
    }

    return false
}