import { useEffect, useState } from "react"
import { randomID } from "../utilities"

export default function ContextMenu({ positionX, positionY, open, options, root}: {
    positionX: number
    positionY: number
    root: boolean
    open: boolean
    options: ContextMenuOption[]
}) {
    const [currentlyOpenMenu, setCurrentlyOpenMenu] = useState<number | null>(null)
    const horizontalOpenDirection: 'left' | 'right' = positionX > window.screen.width/2 ? 'right' : 'left'
    
    let currentTimeout: NodeJS.Timeout

    const onMenuItemHover = (menuItemIndex: number) => {
        console.log(menuItemIndex)
        currentTimeout = setTimeout(() => {
            setCurrentlyOpenMenu(menuItemIndex)
        }, 200)
    }

    const onMenuItemLeave = () => {
        clearTimeout(currentTimeout)
    }

    useEffect(() => {setCurrentlyOpenMenu(null)}, [open])
    return (
        <menu style={{ top: positionY, left: positionX, display: open ? "block" : "none", 
            transform: `translateX(${horizontalOpenDirection === 'right' && root ? '-100%' : '0%'})`
        }} 
        className="absolute w-48 border-solid border-1 border-dry-purple-800 rounded-md bg-dry-purple-950 shadow-l z-10 py-2"
        >   
            {options.map((option, index) => {
                const innerMenu = option.innerMenuOptions ? true : false

                // try to figure out this situation
                return (
                    <div key={randomID()}>
                        <li 
                            onPointerOver={() => onMenuItemHover(index)} 
                            onPointerLeave={onMenuItemLeave}
                            onPointerDown={(event) => {
                                event.stopPropagation()
                                option.onClick?.()
                            }}

                            className="relative"
                        >   
                            <p className="mx-3 pl-2 py-0.5 text-xl hover:bg-bright-purple-700 rounded-lg">{option.label}</p>
                            
                            {innerMenu && 
                            <ContextMenu 
                                positionX={horizontalOpenDirection === 'left' ? 196 : -196}
                                positionY={-8}
                                open={currentlyOpenMenu === index}
                                options={option.innerMenuOptions ?? []}
                                root={false}
                            />}
                        </li>
                    </div>
                )
            })}
        </menu>
    )
}

export interface ContextMenuOption {
    label: string
    onClick?(): void
    innerMenuOptions?: ContextMenuOption[]
}
