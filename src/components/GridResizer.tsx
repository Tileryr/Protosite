import { useRef } from "react"

export default function GridResizer({ direction, windowRef }: { 
    direction: 'horizontal' | 'vertical' 
    windowRef?: React.RefObject<HTMLIFrameElement>
}) {
    const documentRef = useRef(window.document)
    const selfRef = useRef<HTMLDivElement>(null)

    const style = direction === 'horizontal' ? 'w-4 cursor-col-resize' : 'h-4 cursor-row-resize'
    const resizeWindow = () => {
        const previousElement = selfRef.current?.previousElementSibling
        const nextElement = selfRef.current?.nextElementSibling

        if(!previousElement || !nextElement) {
            throw new Error('No other element to resize')
        }
        
        if(!(previousElement instanceof HTMLDivElement && nextElement instanceof HTMLDivElement)) {
            throw new Error('Siblings must be containers')
        }

        const endResize = (event: Event) => {
            documentRef.current.removeEventListener('pointerup', endResize)
            documentRef.current.removeEventListener('pointermove', resizeAxis)
            if(windowRef?.current) {
                windowRef.current.style.pointerEvents = 'auto'
            }
        }

        const resizeAxis = (event: MouseEvent) => {
            const newX = event.clientX
            const newY = event.clientY
            
            switch (direction) {
                case 'horizontal':
                    previousElement.style.width = `${newX}px`
                    break
                case 'vertical':
                    previousElement.style.height = `${newY}px`
                    console.log(newY)
                    break
            }
        }

        documentRef.current.addEventListener('pointerup', endResize)
        documentRef.current.addEventListener('pointermove', resizeAxis)
        if(windowRef?.current) {
            windowRef.current.style.pointerEvents = 'none'
        }
    }
    return (
        <div ref={selfRef} className={style} onPointerDown={resizeWindow}></div>
    )
}