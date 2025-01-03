import { useEffect, useState } from "react"
import { randomID } from "../utilities"

export default function ContextMenu({ positionX, positionY, open, options}: {
    positionX: number
    positionY: number
    open: boolean
    options: ContextMenuOption[]
}) {
    const [currentlyOpenMenu, setCurrentlyOpenMenu] = useState<number | null>(null)

    const onMenuItemHover = (menuItemIndex: number) => {
        window.setTimeout(() => {
            setCurrentlyOpenMenu(menuItemIndex)
        }, 200)
    }

    useEffect(() => {setCurrentlyOpenMenu(null)}, [open])
    return (
        <menu style={{ top: positionY, left: positionX, display: open ? "block" : "none"}} 
        className="absolute w-64 border-solid border-1 border-black rounded-md bg-white shadow-xl z-10"
        key={randomID()}
        >   
            {options.map((option, index) => {
                const innerMenu = option.innerMenuOptions ? true : false

                // try to figure out this situation
                return (
                    <div key={randomID()}>
                        <li 
                            onMouseOver={() => onMenuItemHover(index)} 
                            onMouseDown={option.onClick}
                        >
                            {option.label}
                        </li>
                        {innerMenu && 
                        <ContextMenu 
                            positionX={100}
                            positionY={0}
                            open={currentlyOpenMenu === index}
                            options={option.innerMenuOptions ?? []}
                        />}
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
