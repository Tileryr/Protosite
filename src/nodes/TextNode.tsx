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

        let selection = window.getSelection()!
        let selectionStart = calculateSelection(selection.anchorNode!, selection.anchorOffset)
        let selectionEnd = calculateSelection(selection.focusNode!, selection.focusOffset)
        selectionStart = selectionStart < selectionEnd ? selectionStart : selectionEnd

        let change = newText.length - text.length

        setText(newText)
        setBoldedText((prevBoldedText) => recalculatePairs(prevBoldedText, selectionStart, change))
        updateNodeData(id, { string: newText })
    }

    const boldText = () => {
        console.log(boldActived)
        let selection = window.getSelection()
        //if textfield is not the selection and the selection is text inside the field
        if (!(
            selection && 
            textFieldRef.current!.contains(selection?.anchorNode) && 
            textFieldRef.current!.contains(selection?.focusNode) &&
            textFieldRef.current !== selection?.focusNode &&
            textFieldRef.current !== selection?.anchorNode
        )) {
            return
        }

        let currentStart = calculateSelection(selection.anchorNode!, selection.anchorOffset)
        let currentEnd = calculateSelection(selection.focusNode!, selection.focusOffset)

        //Swap so current start is always lesser
        currentStart > currentEnd && ([currentStart, currentEnd] = [currentEnd, currentStart])

        let innerHTML = textFieldRef.current!.innerHTML

        setHtmlText(innerHTML)

        setBoldedText(prevBoldedText => {
            let intersected = !boldActived

            
            //Check intersections and change pairs based on that
            let newBoldedPairs = prevBoldedText.map(({start, end}) => {
                let intersections = checkIntersections(currentStart, currentEnd, start, end)

                if(!intersections) {
                    return {start, end}
                }

                intersected = true
                
                
                if(!boldActived) {
                    switch (intersections) {
                        case 'instart-inend':
                            console.log("IN")
                            return [{start: start, end: currentStart}, {start: currentEnd, end: end}]
                        case 'instart-outend':
                            return {start: start, end: currentStart}
                        case 'outstart-inend':
                            return {start: currentEnd, end: end}
                        case 'outstart-outend':
                            return {start: 0, end: 0}
                    }
                }
                

                switch (intersections) {
                    case 'instart-inend':
                        return {start: start, end: end}
                    case 'instart-outend':
                        return {start: start, end: currentEnd}
                    case 'outstart-inend':
                        return {start: currentStart, end: end}
                    case 'outstart-outend':
                        return {start: currentStart, end: currentEnd}
                }
            }).flat()
            
            console.log(intersected)
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

            sortedUniquePairs = sortedUniquePairs.filter((element) => element.start !== element.end )
            
            boldenHTML(text, sortedUniquePairs)
            return sortedUniquePairs
        })
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
        console.log(textRope)
        console.count()

        textFieldRef.current?.replaceChildren()

        textRope.forEach((section, index) => {
            //Return if even
            if(index % 2 === 0) {
                textFieldRef.current!.appendChild(document.createTextNode(section))
                return 
            }
            
            let element = document.createElement('strong')
            element.textContent = section
            textFieldRef.current!.appendChild(element)
        })
    }

    const calculateSelection = (node: globalThis.Node, index: number) => {
        console.log(node)
        const start = textFieldRef.current!.firstChild!
        const range = document.createRange()
        range.setStart(start, 0)
        range.setEnd(node, index)
        return range.toString().length
    }
    
    const recalculatePairs = (pairs: TextSection[], changeIndex: number, changeAmount: number) => {
        console.log(pairs)
        let newPairs = pairs.map(({start, end}) => {
            let newEnd = end
            let newStart = start
            let originalIndex = changeIndex - changeAmount 

            if(end >= originalIndex) {
                newEnd += changeAmount
            } else if (end > changeIndex) {
                newEnd = changeIndex
            }

            if(start >= originalIndex) {
                newStart += changeAmount
            } else if (start > changeIndex) {
                newStart = changeIndex
            }

            console.log(`changeIndex: ${changeIndex}`)
            console.log(`originalIndex: ${originalIndex}`)
            console.log(`changeAmount: ${changeAmount}`)
            console.log(`newStartChange: ${changeAmount + changeIndex + 1}`)

            console.log([newStart, newEnd])
            return {start: newStart, end: newEnd}
        })
        newPairs = newPairs.filter((element) => element.start !== element.end )
        return newPairs
    }

    useEffect(boldText, [boldActived])

    return (
        <OutputNode name="Text" height={200} type='string'>
            <button style={{background: boldActived ? 'blue' : 'rgb(255, 255, 255)'}} onClick={() => setBoldActivated(prev => !prev)}>B</button>
            <button className='hover:bg-gray-300' onClick={() => console.log(boldedText)}>I</button>

            <div contentEditable className='w-full h-full nodrag' ref={textFieldRef} onInput={onChange}></div>
        </OutputNode>
    )
}

function checkIntersections(mainStart: number, mainEnd: number, comparedStart: number, comparedEnd: number): IntersectionTypes | '' {
    let intersectionStart: StartAlignment = 'outstart'
    let intersectionEnd: EndAlignment = 'outend'
    let intersected = true

    if (mainStart > comparedEnd && mainEnd > comparedEnd ||
        mainStart < comparedStart && mainEnd < comparedStart
    ) {
        intersected = false
    }
    
    if (mainStart >= comparedStart && mainStart <= comparedEnd) {
        intersectionStart = 'instart'
    }

    if (mainEnd >= comparedStart && mainEnd <= comparedEnd) {
        intersectionEnd = 'inend'
    }

    return intersected ? `${intersectionStart}-${intersectionEnd}` : ''
}

type StartAlignment = 'instart' | 'outstart'
type EndAlignment = 'inend' | 'outend'
type IntersectionTypes = `${StartAlignment}-${EndAlignment}`