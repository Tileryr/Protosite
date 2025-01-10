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

    const [selectedIndex, setSelectedIndex] = useState<number>(0)

    const [boldActived, setBoldActivated] = useState(false)
    const [boldedText, setBoldedText] = useState<TextSection[]>([])

    const onChange = (event: FormEvent<HTMLDivElement>) => {
        const newText = event.currentTarget.textContent ?? ''

        let selection = window.getSelection()!
        let selectionStart = calculateSelection(selection.anchorNode!, selection.anchorOffset)
        let selectionEnd = calculateSelection(selection.focusNode!, selection.focusOffset)
        selectionStart = selectionStart < selectionEnd ? selectionStart : selectionEnd
        setSelectedIndex(selectionStart)
        console.log(selectionStart)
        let change = newText.length - text.length

        setText(newText)
        setBoldedText((prevBoldedText) => recalculatePairs(prevBoldedText, selectionStart, change))
        updateNodeData(id, { string: newText })
    }

    const boldText = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        let selection = window.getSelection()
        if (selection && 
            //if textfield is not the selection and the selection is text inside the field
            textFieldRef.current!.contains(selection?.anchorNode) && 
            textFieldRef.current!.contains(selection?.focusNode) &&
            textFieldRef.current !== selection?.focusNode &&
            textFieldRef.current !== selection?.anchorNode
        ) {
            let currentStart = calculateSelection(selection.anchorNode!, selection.anchorOffset)
            let currentEnd = calculateSelection(selection.focusNode!, selection.focusOffset)

            //Swap so current start is always lesser
            currentStart > currentEnd && ([currentStart, currentEnd] = [currentEnd, currentStart])

            let innerHTML = textFieldRef.current!.innerHTML

            setHtmlText(innerHTML)
            setBoldedText(prevBoldedText => {
                let intersected = false

                //Check intersections and change pairs based on that
                console.log("BOLDY")
                let newBoldedPairs = prevBoldedText.map(({start, end}, index, array) => {
                    let intersections = checkIntersections(currentStart, currentEnd, start, end)

                    console.log(intersections)

                    if(!intersections) {
                        return {start, end}
                    }

                    intersected = true
                    
                    if(boldActived) {
                        console.log("INNERT")
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

        if(textFieldRef.current!.innerHTML !== encodeURIComponent(newHtml)) {
            textFieldRef.current!.innerHTML = newHtml

            let childNodes = textFieldRef.current!.childNodes
            let lengthLeft = selectedIndex
            for (let index = 0; index < childNodes.length; index++) {
                let node = childNodes[index]
                let nodeText = node.textContent!
                if (lengthLeft - nodeText.length <= 0) {
                    window.getSelection()!.setPosition(node.firstChild, lengthLeft)
                    break
                } 
                lengthLeft -= nodeText.length
            }
        }
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
        let newPairs = pairs.map(({start, end}) => {
            let newEnd = end
            let newStart = start
            if(end >= changeIndex - changeAmount) {
                newEnd += changeAmount
                if(start >= changeIndex - changeAmount) {
                    newStart += changeAmount
                }
            }
            return {start: newStart, end: newEnd}
        })
        newPairs = newPairs.filter((element) => element.start !== element.end )
        return newPairs
    }

    return (
        <OutputNode name="Text" height={200} type='string'>
            <button style={{background: boldActived ? 'blue' : 'rgb(255, 255, 255)'}} onClick={boldText}>B</button>
            <button className='hover:bg-gray-300' onClick={() => console.log(boldedText)}>I</button>

            <div contentEditable className='w-full h-full nodrag' ref={textFieldRef} onInput={onChange}></div>
        </OutputNode>
    )
}

function checkIntersections(mainStart: number, mainEnd: number, comparedStart: number, comparedEnd: number): IntersectionTypes | '' {
    let intersectionStart: StartAlignment = 'outstart'
    let intersectionEnd: EndAlignment = 'outend'
    let intersected = true

    // if(mainStart <= comparedStart && mainEnd >= comparedStart) {
    //     intersectionStart = "outstart"
    // } else {
    //     intersectionStart = "instart"
    //     intersected = true
    // }

    // if(mainEnd >= comparedEnd && mainStart <= comparedEnd) {
    //     intersectionEnd = "outend"
    // } else {
    //     intersectionEnd = "inend"
    //     intersected = true
    // }
    // if both are outside a boundary
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