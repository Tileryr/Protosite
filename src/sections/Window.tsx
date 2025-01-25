import { ClassInterface, useClasses } from "../nodes/ClassNode"

export default function Window({ srcDoc, setSrcDoc, iframeRef }: {
    srcDoc: string,
    setSrcDoc: React.Dispatch<React.SetStateAction<string>>
    iframeRef: React.RefObject<HTMLIFrameElement> | undefined
}) {
    const getClasses = useClasses((state) => state.getClasses)

    const handleLoad = () => {
        const iframeDoc = iframeRef?.current?.contentWindow?.document
        if(!iframeDoc) return
        const mediaElements = iframeDoc?.querySelectorAll<HTMLMediaElement>('[data-autoplay=true]')

        mediaElements?.forEach((mediaElement) => {
            mediaElement.autoplay = true
            delete mediaElement.dataset.autoplay         
        })

        
        const currentDocHTML = iframeDoc!.querySelector('html')!.outerHTML
        setSrcDoc(currentDocHTML)
        addStyling(getClasses(), iframeDoc)
    }

    const addStyling = (classes: ClassInterface[], document: Document) => {
        const styleElement = document.createElement('style')
        document.querySelector('head')?.appendChild(styleElement)
        const styleSheet = styleElement.sheet
        if(!styleSheet) return
        for (const currentClass of classes) {
            const classStyling = currentClass.styling
            let stylingString = ''
            for (const [property, value] of Object.entries(classStyling)) {
                stylingString += `${property}: ${value};\n`
            }
            console.log(`${currentClass.name} {\n ${stylingString}}`)
            styleSheet.insertRule(`${currentClass.name} {${stylingString}}`, styleSheet.cssRules.length)
        }
        console.log(document)
    }

    return (
        <iframe
            title='window'
            className='website-display select-none -webkit-select-none'
            srcDoc={srcDoc}
            onLoad={handleLoad}
            ref={iframeRef}
        />
    )
}
