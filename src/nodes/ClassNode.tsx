import { Node, NodeProps } from "@xyflow/react"
import NodeShell from "../components/Nodes/NodeShell"
import { useEffect, useState } from "react"
import { create } from 'zustand'

type Classes = Record<string, ClassInterface>

interface ClassInterface {
    name: string
    styling: Record<string, unknown>
}

type State = {
    classes: Classes
}

type Action = {
    updateClasses: (newClass: ClassInterface, id: string) => void
    updateClassName: (id: string, newName: string) => void
    updateClassStyling: (id: string, styling: Record<string, unknown>) => void
    removeClass: (id: string) => void
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
    }
}))

export type ClassNodeData = { className: string }
export type ClassNode = Node<ClassNodeData, 'class'>
export default function ClassNode({ id }: NodeProps<ClassNode>) {
    const [className, setClassName] = useState(`Class`)

    const classes = useClasses((state) => state.classes)

    const updateClass = useClasses((state) => state.updateClasses)
    const updateName = useClasses((state) => state.updateClassName)

    useEffect(() => {
        updateClass({
            name: className,
            styling: {}
        }, id)
    }, [])
    
    const handleClassNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClassName(event.target.value)
        updateName(id, event.target.value)
        console.log(classes)
    }

    return (
        <NodeShell header={
            <input 
                aria-label="Class Name" 
                value={className} 
                onChange={handleClassNameChange}
                className="bg-transparent nodrag"
            ></input>}>

        </NodeShell>
    )
}