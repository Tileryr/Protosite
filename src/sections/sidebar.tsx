import { useState } from "react"
import GridResizer from "../components/GridResizer"
import { convertHtml } from "../NodesToHtml"
import { Node, useNodesData } from "@xyflow/react"

import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import { prettify } from 'htmlfy'
import { ElementNodeData } from "../components/Nodes/ElementBase";
import { ClassInterface, useClasses } from "../nodes/ClassNode";

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

export default function Sidebar({ iframeRef }: {
    iframeRef: React.RefObject<HTMLIFrameElement>
}) {
    const getClasses = useClasses((state) => state.getClasses)
    const rootNode = useNodesData<Node<ElementNodeData>>('1')!

    const [windowBody, setWindowBody] = useState(document.createElement('body'))
    const [styling, setStyling] = useState('')

    const highlightedBody = hljs.highlight(prettify(windowBody.outerHTML), { language: "xml" }).value
    const highlightedCSS = hljs.highlight(styling, {language: "css"}).value

    const panels = [
        highlightedBody,
        highlightedCSS
    ]

    const [openPanel, setOpenPanel] = useState(0)

    const handleRun = () => {
        let newHTML = convertHtml(rootNode.data.element, getClasses())
        const iframeDoc = iframeRef?.current?.contentWindow?.document
        if(!iframeDoc) return
        setWindowBody(newHTML)

        iframeRef.current?.contentWindow?.location.reload()
    }

    const handleLoad = () => {
        const iframeDoc = iframeRef?.current?.contentWindow?.document
        if(!iframeDoc) return
        const mediaElements = iframeDoc?.querySelectorAll<HTMLMediaElement>('[data-autoplay=true]')

        mediaElements?.forEach((mediaElement) => {
            mediaElement.autoplay = true
            delete mediaElement.dataset.autoplay         
        })

        setStyling(addStyling(getClasses(), iframeDoc))
    }

    const addStyling = (classes: ClassInterface[], document: Document) => {
        const styleElement = document.createElement('style')
        document.querySelector('head')?.appendChild(styleElement)
        const styleSheet = styleElement.sheet

        let styleSheetString = ''
        if(!styleSheet) return styleSheetString
        
        for (const currentClass of classes) {
            const classStyling = currentClass.styling
            let stylingString = ''

            for (const [property, value] of Object.entries(classStyling)) {
                stylingString += `${property}: ${value};\n`
            }

            const newRule = `${currentClass.selector} {\n ${stylingString}}`
            styleSheetString += newRule
            styleSheetString += '\n'
            styleSheet.insertRule(`${currentClass.selector} {${stylingString}}`, styleSheet.cssRules.length)
        }
        return styleSheetString
    }

    return (
         <div className='side-bar h-screen w-[30%] '>
            <button onClick={handleRun} className="w-8 aspect-square bg-bright-purple-600">Run</button>
            <div className='website-container select-none -webkit-select-none border-highlight border-2 rounded-xl'>
                <iframe
                    title='window'
                    className='website-display select-none -webkit-select-none'
                    onLoad={handleLoad}
                    srcDoc={`
                        <html>
                            <body>
                            ${windowBody.outerHTML}
                            </body>
                        </html>
                    `}
                    ref={iframeRef}
                />

            </div>
            <GridResizer direction='vertical' windowRef={iframeRef}/>
            <div className='side-window border-highlight border-2 rounded-xl'>
                <div>
                    <button onClick={() => setOpenPanel(0)}>HTML</button>
                    <button onClick={() => setOpenPanel(1)}>CSS</button>
                </div>
                <pre>
                    <code dangerouslySetInnerHTML={{__html: panels[openPanel]}}>
                    </code>
                </pre>
            </div>
        </div>
    )
}