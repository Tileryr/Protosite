import { FormEvent, useEffect, useRef, useState } from 'react'
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

type ModifierSet = Record<Modifiers, ModifierInfo>
type Modifiers = 'bold' | 'italicize'
interface ModifierInfo {
    sections: TextSection[]
    tag: string
}

export default function TextNode({ id }: NodeProps<TextNode>) {
    const { updateNodeData } = useReactFlow();

    const textFieldRef = useRef<HTMLDivElement>(null)

    const [text, setText] = useState('');
    const [htmlText, setHtmlText] = useState('')

    const [boldActived, setBoldActivated] = useState(false)
    const [boldedCache, setBoldedCache] = useState<TextSection[]>([])
    const [boldedText, setBoldedText] = useState<TextSection[]>([])

    const [italicizedActived, setItalicizedActivated] = useState(false)
    const [italicizedCache, setItalicizedCache] = useState<TextSection[]>([])
    const [italicizedText, setItalicizedText] = useState<TextSection[]>([])

    const modifierSet: ModifierSet = {
        'bold': {sections: boldedText, tag: 'strong'},
        'italicize': {sections: italicizedText, tag: 'em'}
    }


    const onChange = (event: FormEvent<HTMLDivElement>) => {
        const newText = event.currentTarget.textContent ?? ''

        let selection = window.getSelection()!
        let selectionStart = calculateSelection(selection.anchorNode!, selection.anchorOffset)
        let selectionEnd = calculateSelection(selection.focusNode!, selection.focusOffset)
        selectionStart = selectionStart < selectionEnd ? selectionStart : selectionEnd

        let change = newText.length - text.length

        console.log(textFieldRef.current!.innerHTML)
        setText(newText)
        setBoldedCache((prevBoldedText) => recalculatePairs(prevBoldedText, selectionStart, change))
        setItalicizedText((prevItalicizedText) => recalculatePairs(prevItalicizedText, selectionStart, change))

        setHtmlText(textFieldRef.current!.innerHTML)
    }

    const modifyText = (modifier: Modifiers, setModifier: (value: React.SetStateAction<TextSection[]>) => void, activated: boolean, cache: TextSection[]) => {
        let selection = window.getSelection()
        // console.log(selection)
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

        setModifier((prevModifier) => {
            let intersected = !activated
            
            //Check intersections and change pairs based on that
            let newModifiedPairs = cache.map(({start, end}) => {
                let intersections = checkIntersections(currentStart, currentEnd, start, end)

                if(!intersections) {
                    return {start, end}
                }

                intersected = true
                
                if(!activated) {
                    switch (intersections) {
                        case 'instart-inend':
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
                        currentStart = start
                        return {start: start, end: currentEnd}
                    case 'outstart-inend':
                        currentEnd = end
                        return {start: currentStart, end: end}
                    case 'outstart-outend':
                        return {start: currentStart, end: currentEnd}
                }
            }).flat()

            //If intersected then dont add to list
            let returnedPairs = intersected ? newModifiedPairs : [...newModifiedPairs, {start: currentStart, end: currentEnd}]

            // Remove duplicate items
            let uniqueReturnedPairs = returnedPairs.filter((item, index, array) => {
                return index === array.findIndex((t) => (
                    t.start === item.start && t.end === item.end
                ))
            })

            // Sort
            let sortedUniquePairs = uniqueReturnedPairs.sort((a, b) => a.start - b.start)

            sortedUniquePairs = sortedUniquePairs.filter((element) => element.start !== element.end )

            modifierSet[modifier].sections
            modifyHTML(text, {...modifierSet, [modifier]: {...modifierSet[modifier], sections: sortedUniquePairs}})
            return sortedUniquePairs
        })
    }

    const modifyHTML = (text: string, allModifiers: ModifierSet) => {
        textFieldRef.current!.replaceChildren(document.createTextNode(text))

        // MAKE ROPE
        Object.values(allModifiers).forEach(({tag, sections}) => {
            function findIndexAndNode(index: number, root: Element) {
                let newIndex = index
                let currentIndex = newIndex
                let indexNode: ChildNode = textFieldRef.current!.firstChild!

                function addNodeIndex(node: Element,) {
                    let childNodes = node.childNodes
                    
                    for (let index = 0; index < childNodes.length; index++) {
                        let currentNode = childNodes[index]
                        if(currentNode.nodeType === 3) {
                            let text = currentNode.textContent!

                            if (currentIndex - text.length <= 0 && currentIndex > 0) {
                                newIndex = currentIndex
                                indexNode = currentNode
                            }

                            currentIndex -= text.length
                            continue
                        }

                        if(currentNode instanceof Element) {
                            addNodeIndex(currentNode)
                        }
                    }
                }

                
                addNodeIndex(root)
                return {index: newIndex, node: indexNode}
            }

            sections.forEach((pair) => {
                console.log(pair)
                let rangeStart = findIndexAndNode(pair.start, textFieldRef.current!)
                let rangeEnd = findIndexAndNode(pair.end, textFieldRef.current!)

                let range = document.createRange()
                range.setStart(rangeStart.node, rangeStart.index)
                range.setEnd(rangeEnd.node, rangeEnd.index)

                let rangeContents = range.cloneContents()
                let newNode = document.createElement(tag)
                newNode.appendChild(rangeContents)

                range.deleteContents()
                range.insertNode(newNode)
            })
        })
        
        setHtmlText(textFieldRef.current!.innerHTML)
    }

    const calculateSelection = (node: globalThis.Node, index: number) => {
        const start = textFieldRef.current!.firstChild ?? textFieldRef.current! 
        const range = document.createRange()
        range.setStart(start, 0)
        range.setEnd(node, index)
        return range.toString().length
    }
    
    const recalculatePairs = (pairs: TextSection[], changeIndex: number, changeAmount: number) => {
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

            return {start: newStart, end: newEnd}
        })
        newPairs = newPairs.filter((element) => element.start !== element.end )
        return newPairs
    }

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const clipboardData = event.clipboardData.getData('text/plain')
        const selection = window.getSelection()!
        const range = selection.getRangeAt(0)
        range.insertNode(document.createTextNode(clipboardData))
        range.collapse()
        event.preventDefault()
    }

    useEffect(() => {modifyText('bold', setBoldedText, boldActived, boldedCache); console.log(boldActived)}, [boldActived])
    useEffect(() => {
        setBoldedCache(boldedText)
    }, [boldedText])

    useEffect(() => modifyText('italicize', setItalicizedText, italicizedActived, italicizedCache), [italicizedActived])
    useEffect(() => {
        setItalicizedCache(italicizedText)
    }, [italicizedText])

    useEffect(() => updateNodeData(id, { string: htmlText}), [htmlText])

    useEffect(() => {
        setTimeout(() => {
            textFieldRef.current?.focus();
        }, 10);
    }, [textFieldRef]);
    return (
        <OutputNode name="Text" type='string'>
            <div>
                <button 
                onClick={() => setBoldActivated(prev => !prev)} 
                className={`w-6 aspect-square leading-6 rounded ${boldActived ? 'bg-blue-700' : 'bg-dark-purple-800'} `
                }>B</button>
                <button
                className={`w-6 aspect-square leading-6 rounded mx-1 ${italicizedActived ? 'bg-blue-700' : 'bg-dark-purple-800'} `} 
                onClick={() => setItalicizedActivated(prev => !prev)}>I</button>
            </div>
            <div className='mt-2'></div>
            <div contentEditable onPaste={handlePaste} 
            className='w-full h-full nodrag focus:outline 
            rounded-full bg-dry-purple-950  leading-4
            outline-2 outline-white-100 p-1' ref={textFieldRef} onInput={onChange}

            ></div>
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