import { Node, NodeProps } from "@xyflow/react"
import NodeShell from "../components/Nodes/NodeShell"
import { useEffect, useState } from "react"
import { create } from 'zustand'
import { Port, useInput } from "../components/Nodes/Ports"

type Classes = Record<string, ClassInterface>

export type StylingObject = Partial<Record<keyof CSSStyleDeclaration, any>>

export interface ClassInterface {
    name: string
    styling: StylingObject
}

type State = {
    classes: Classes
}

type Action = {
    updateClasses: (newClass: ClassInterface, id: string) => void
    updateClassName: (id: string, newName: string) => void
    updateClassStyling: (id: string, styling: Record<string, unknown>) => void
    removeClass: (id: string) => void
    getClass: (id: string) => ClassInterface
    getClasses: () => ClassInterface[]
}

export const useClasses = create<State & Action>()((set, get) => ({
    classes: {},
    updateClasses: (newClass, id) => set((state) => ({ classes: {...state.classes, [id]: newClass} })),
    updateClassName: (id, name) => set((state) => ({ classes: {...state.classes, [id]: {
        ...state.classes[id],
        name: name
    } } })),
    updateClassStyling: (id, styling) => set((state) => ({ classes: {...state.classes, [id]: {
        ...state.classes[id],
        styling: styling
    } } })),
    removeClass: (id) => {
        const {[id]: {}, ...rest} = get().classes
        set(() => ({classes: rest}))
    },
    getClass: (id) => {
        return get().classes[id]
    },
    getClasses: () => Object.values(get().classes)
}))

export type ClassNodeData = { className: string }
export type ClassNode = Node<ClassNodeData, 'class'>
export default function ClassNode({ id }: NodeProps<ClassNode>) {
    const [className, setClassName] = useState(`Class`)

    const updateClass = useClasses((state) => state.updateClasses)
    const updateName = useClasses((state) => state.updateClassName)
    const updateStyling = useClasses((state) => state.updateClassStyling)

    const currentStyling = useClasses((state) => state.classes[id]?.styling ?? {})

    const stylingInputProps = useInput({ portID: 'styling', limit: false, onConnection: (style) => {
        const styling: StylingObject[] = style as StylingObject[] ?? []
        const mergedStyling = styling.reduce((currentStyling, newStyling) => {
            return {...currentStyling, ...newStyling}
        }, {})
        updateStyling(id, mergedStyling)
    }})

    useEffect(() => {
        updateClass({
            name: className,
            styling: {}
        }, id)
    }, [id])
    
    const handleClassNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClassName(event.target.value)
        updateName(id, event.target.value)
        console.log(currentStyling)
    }

    return (
        <NodeShell header={
            <input 
                aria-label="Class Name" 
                value={className} 
                onChange={handleClassNameChange}
                onBlur={() => !className && setClassName('Class')}
                className="bg-transparent nodrag focus:border-none focus:outline-none w-full"
            ></input>
        }>
        <Port 
            {...stylingInputProps}
            label="Styling"
        />
        </NodeShell>
    )
}