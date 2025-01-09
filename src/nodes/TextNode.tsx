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
        if (selection) {
            let currentStart = calculateSelection(selection.anchorNode!, selection.anchorOffset)
            let currentEnd = calculateSelection(selection.focusNode!, selection.focusOffset)

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
                boldenHTML(text, sortedUniquePairs, selection.getRangeAt(0))
                return sortedUniquePairs
            })
        }
        
        setBoldActivated(prev => !prev)
    }

    const boldenHTML = (text: string, boldedPairs: TextSection[], range: Range) => {
        let textRope: string[] = []
        let lastEnd = 0

        //MAKE ROPE
        boldedPairs.forEach(pair => {
            textRope.push(text.substring(lastEnd, pair.start))
            textRope.push(text.substring(pair.start, pair.end))
            lastEnd = pair.end
        })

        textRope.push(text.substring(lastEnd))

        let oldRope = textRope
        //ADD TAGS
        textRope = textRope.map((section, index) => {
            //Return if even
            if(index % 2 === 0) {return section}
            return `<strong>${section}</strong>`
        })

        let newHtml = textRope.join('')

        // oldRope.map((string, index) => {
        //     if(oldRope[index] === textRope[index]) {
        //         range.deleteContents()
        //         range.insertNode(document.createTextNode(oldRope[index]))
        //     }
        // })

        if(textFieldRef.current!.innerHTML !== encodeURIComponent(newHtml)) {
            textFieldRef.current!.innerHTML = newHtml

            let childNodes = textFieldRef.current!.childNodes
            let lengthLeft = selectedIndex
            for (let index = 0; index < childNodes.length; index++) {
                let node = childNodes[index]
                let textNode = node.textContent!
                if (lengthLeft - textNode.length <= 0) {
                    console.log(textNode)
                    console.log(lengthLeft - textNode.length)
                    
                    window.getSelection()!.setPosition(node, lengthLeft)
                    break
                } 
                lengthLeft -= textNode.length
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
            if(end > changeIndex) {
                newEnd += changeAmount
                if(start > changeIndex) {
                    newStart += changeAmount
                }
            }
            return {start: newStart, end: newEnd}
        })
        return newPairs
    }

    // useEffect(() => boldenHTML(text, boldedText), [boldedText])
    // useEffect(() => console.log(selectedIndex), [selectedIndex])
    // window.getSelection()?.setPosition(textFieldRef.current, selectedIndex)
    return (
        <OutputNode name="Text" height={200} type='string'>
            <button className={`hover:bg-${boldActived ? 'gray' : 'sky'}-300`} onClick={boldText}>B</button>
            <button className='hover:bg-gray-300' onClick={() => console.log(window.getSelection()!.anchorNode)}>I</button>

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