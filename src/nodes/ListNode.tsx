import { Node, NodeProps, useNodeConnections, useReactFlow } from "@xyflow/react";
import { ElementNodeData } from "../components/Nodes/ElementBase";
import ElementBase, { ElementData, ElementTag } from "../components/Nodes/ElementBase";
import { Port, useInput } from "../components/Nodes/Ports";
import { useEffect } from "react";
import AddNodeButton from "../components/Inputs/AddNodeButton";
import { handleID } from "../nodeutils";

type ListElementData = ElementNodeData & { list_elements: Node[] }
type ListNode = Node<ListElementData, 'list'>

export const ListElementData = new ElementData({ tag: 'ol', possibleChildren: 'list-item' })

export default function ListNode({ id, data, }: NodeProps<ListNode>) {
    const { updateNode, getInternalNode } = useReactFlow()
    const itemInputProps = useInput({
        portID: "element",
        limit: false,
        onConnection: (newChild) => {
            data.updateElement('children', newChild)
        }
    })

    const listSpread = 150

    const itemConnections = useNodeConnections({handleType: 'target', handleId: handleID({id: id, dataType: 'element', index: 0})})
    .map(connection => connection.source)

    const heightOffset: number = getInternalNode(id)!.measured!.height ? getInternalNode(id)!.measured.height! : 0
    
    useEffect(() => {
        let childrenItemIDs = itemConnections.filter((itemID) => getInternalNode(itemID)?.parentId === id)
        childrenItemIDs.forEach((itemID, index, array) => {
            updateNode(itemID, { position: {
                x: 275,
                y: (index * listSpread - ((array.length * listSpread) / 2)) + heightOffset / 2
            }})
        })
    }, [itemConnections.length])
    
    const tags: ElementTag[] = [
        {name: 'Unordered List', value: 'ul'},
        {name: 'Ordered List', value: 'ol'}
    ]
    
    return (
        <ElementBase output={true} tags={tags} data={data}>
            <Port
                {...itemInputProps}
                label="Items"
            >   
                <AddNodeButton 
                    limit={false} 
                    nodeData={new ElementData({ tag: 'li', possibleParents: 'list', })} 
                    nodeType='list-item' 
                    connectionType="element" 
                    position={{x: 300, y: 0}} 
                    parentId={id}
                />
            </Port>
        </ElementBase>
    )
}

type ListItemNode = Node<ElementNodeData, 'list'>

export function ListItemNode({ id, data, positionAbsoluteX, positionAbsoluteY }: NodeProps<ListItemNode>) {
    const { deleteElements, updateNode } = useReactFlow()
    
    const childrenProps = useInput({
        portID: "string",
        limit: false,
        onConnection: (newText) => {
            data.updateElement('text', newText)
        }
    })

    const parentList = useNodeConnections({handleType: 'source', handleId: handleID({id: id, dataType: 'element', index: 0})})
    
    if(!parentList.length) {
        deleteElements({ nodes: [{ id: id }] })
    }

    const tags: ElementTag[] = [
        {name: 'List Element', value: 'li'}
    ]

    const deparentNode = () => {
        updateNode(id, { 
            parentId: undefined, 
            position: {x: positionAbsoluteX, y: positionAbsoluteY}
        })
    }

    return (
        <div onPointerDown={deparentNode}>
            <ElementBase output={true} tags={tags} data={data}>
                <Port
                    {...childrenProps}
                    label="Text"
                >
                    <AddNodeButton limit={true} nodeData={{text: ''}} nodeType='text' connectionType="string"
                    position={{x: positionAbsoluteX + 300, y: positionAbsoluteY}}/>
                </Port>
            </ElementBase>
        </div>
    )
}
  

