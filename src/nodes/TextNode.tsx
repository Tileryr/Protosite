import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Node, NodeProps, useReactFlow } from '@xyflow/react'

import OutputNode from '../components/Nodes/BaseOutputNode.js'

type TextNodeData = {
    string: string
}

type TextNode = Node<TextNodeData, 'text'>

interface TextSection {
    start: number
    end: number
}

export default function TextNode({ id, data }: NodeProps<TextNode>) {
    const { updateNodeData } = useReactFlow();

    const textFieldRef = useRef<HTMLDivElement>(null)

    const [text, setText] = useState('');
    const [htmlText, setHtmlText] = useState('')

    const [boldActived, setBoldActivated] = useState(false)
    const [boldedText, setBoldedText] = useState<TextSection[]>([])

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

            //Recalculate
            const startRange = document.createRange()
            startRange.setStart(textFieldRef.current!.firstChild!, 0)
            startRange.setEnd(selection.anchorNode!, currentStart)
            currentStart = startRange.toString().length

            const endRange = document.createRange()
            endRange.setStart(textFieldRef.current!.firstChild!, 0)
            endRange.setEnd(selection.focusNode!, currentEnd)
            currentEnd = endRange.toString().length

            //Swap so current start is always lesser
            currentStart > currentEnd && ([currentStart, currentEnd] = [currentEnd, currentStart])

            let innerHTML = textFieldRef.current!.innerHTML

            setHtmlText(innerHTML)
            setBoldedText(prevBoldedText => {
                let intersected = false

                //Check intersections and change pairs based on that
                let newBoldedPairs = prevBoldedText.map(({start, end}) => {
                    let intersections = checkIntersections(currentStart, currentEnd, start, end)
                    if(intersections) {
                        intersected = true
                        return intersections
                    } else {
                        return {start, end}
                    }
                })
                
                //If intersected then dont add to list
                let returnedPairs = intersected ? newBoldedPairs : [...newBoldedPairs, {start: currentStart, end: currentEnd}]

                // Remove duplicate items
                let uniqueReturnedPairs = returnedPairs.filter((item, index, array) => {
                    return index === array.findIndex((t) => (
                        t.start === item.start && t.end === item.end
                    ))
                })

                // Sort
                let sortedUniquePairs = uniqueReturnedPairs.sort((a, b) => a.start - b.start)
                console.log(sortedUniquePairs)
                return sortedUniquePairs
            })
        }
        
        setBoldActivated(prev => !prev)
    }

    const boldenHTML = (text: string, boldedPairs: TextSection[]) => {
        let textRope: string[] = []
        let lastEnd = 0

        //MAKE ROPE
        boldedPairs.forEach(pair => {
            textRope.push(text.substring(lastEnd, pair.start))
            textRope.push(text.substring(pair.start, pair.end))
            lastEnd = pair.end
        })

        textRope.push(text.substring(lastEnd))

        //ADD TAGS
        textRope = textRope.map((section, index) => {
            //Return if even
            if(index % 2 === 0) {return section}
            return `<strong>${section}</strong>`
        })
        let newHtml = textRope.join('')
        if(textFieldRef.current!.innerHTML !== newHtml) {
            textFieldRef.current!.innerHTML = newHtml
            // console.log(textFieldRef.current!.innerHTML)
        }
    }

    useEffect(() => boldenHTML(text, boldedText), [boldedText])

    return (
        <OutputNode name="Text" height={200} type='string'>
            <button className={`hover:bg-${boldActived ? 'gray' : 'sky'}-300`} onClick={boldText}>B</button>
            <button className='hover:bg-gray-300' onClick={() => console.log(boldedText)}>I</button>

            <div contentEditable className='w-full h-full nodrag' ref={textFieldRef} onInput={onChange}></div>
        </OutputNode>
    )
}

function checkIntersections(mainStart: number, mainEnd: number, comparedStart: number, comparedEnd: number) {
    let newStart = comparedStart
    let newEnd = comparedEnd
    let intersected = false

    // console.log([mainStart, mainEnd, comparedStart, comparedEnd])

    if(mainStart < comparedStart && mainEnd > comparedStart) {
        newStart = mainStart
        intersected = true
    }

    if(mainEnd > comparedEnd && mainStart < comparedEnd) {
        newEnd = mainEnd
        intersected = true
    }

    // console.log([mainStart, mainEnd, comparedStart, comparedEnd])
    return intersected ? {start: newStart, end: newEnd} : false
}