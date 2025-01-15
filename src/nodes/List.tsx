import { Node, NodeProps, useHandleConnections, useInternalNode, useNodesData, useReactFlow } from "@xyflow/react";
import { ElementNodeData } from "../components/types";
import ElementBase, { ElementTag } from "../components/Nodes/ElementBase";
import { Input } from "../components/Nodes/Ports";
import { randomID } from "../utilities";
import { memo, useEffect } from "react";

type ListElementData = ElementNodeData & { list_elements: Node[] }
type ListNode = Node<ListElementData, 'list'>

export default function ListNode({ id, data, }: NodeProps<ListNode>) {
    const { addNodes, addEdges, updateNode, getInternalNode } = useReactFlow()
    const listSpread = 150
    const itemConnections = useHandleConnections({type: 'target', id: 'element', nodeId: id }).map(connection => connection.source)
    const heightOffset: number = getInternalNode(id)!.measured!.height ? getInternalNode(id)!.measured.height! : 0
    
    useEffect(() => {
        itemConnections.forEach((itemID, index, array) => {
            updateNode(itemID, { position: {
                x: 275,
                y: (index * listSpread - ((array.length * listSpread) / 2)) + heightOffset / 2
            }})
        })
    })
    
    const tags: ElementTag[] = [
        {name: 'Unordered List', value: 'ul'},
        {name: 'Ordered List', value: 'ol'}
    ]
    
    const addItem = () => {
        let itemID = randomID()
        const newItem: Node = {
            id: itemID,
            type: 'list-item',
            position: {x: 300, y: 0},
            parentId: id,
            data: {element: {children: [], tag: 'li'}, possibleParents: 'list'}
        }
        addNodes(newItem)
        addEdges({id: randomID(), source: itemID, target: id, sourceHandle: 'element', targetHandle: 'element' })
    }

    return (
        <ElementBase name="List" output={true} type='element' tags={tags} id={id} data={data}>
            <Input
                id='element'
                label='Items'
                limit={false}
                property='children'
            />
            <button onClick={addItem}>Add item</button>
        </ElementBase>
    )
}

type ListItemData = ElementNodeData
type ListItemNode = Node<ListElementData, 'list'>

export const ListItemNode = memo(function ListItemNode({ id, data }: NodeProps<ListItemNode>) {
    const { deleteElements } = useReactFlow()

    const parents = useHandleConnections({type: 'source', id: 'element', nodeId: id })

    if(parents.length !== 1) {
        deleteElements({ nodes: [{ id: id }] })
    }

    const tags: ElementTag[] = [
        {name: 'List Element', value: 'li'}
    ]


    return (
        <ElementBase name="List Element" output={true} type='element' tags={tags} id={id} data={data}>
            <Input
                id='string'
                label='Text'
                limit={true}
                property='text'
            />
        </ElementBase>
    )
})
  

