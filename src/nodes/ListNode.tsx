import { Node, NodeProps, useNodeConnections, useReactFlow } from "@xyflow/react";
import { ElementNodeData } from "../components/Nodes/ElementBase";
import ElementBase, { ElementData, ElementTag } from "../components/Nodes/ElementBase";
import { Input } from "../components/Nodes/Ports";
import { memo, useEffect } from "react";
import AddNodeButton from "../components/Inputs/AddNodeButton";

type ListElementData = ElementNodeData & { list_elements: Node[] }
type ListNode = Node<ListElementData, 'list'>

export const ListElementData = new ElementData({ tag: 'ol', possibleChildren: 'list-item' })

export default function ListNode({ id, data, }: NodeProps<ListNode>) {
    const { updateNode, getInternalNode } = useReactFlow()
    const listSpread = 150
    const itemConnections = useNodeConnections({handleType: 'target', handleId: 'element'}).map(connection => connection.source)
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
    
    return (
        <ElementBase name="List" output={true} type='element' tags={tags} id={id} data={data}>
            <Input
                id='element'
                label='Items'
                limit={false}
                property='children'
            >   
                <AddNodeButton limit={false} nodeData={new ElementData({ tag: 'li', possibleParents: 'list', })} nodeType='list-item' connectionType="element" position={{x: 300, y: 0}} parentId={id}/>
            </Input>
        </ElementBase>
    )
}

type ListItemNode = Node<ElementNodeData, 'list'>

export const ListItemNode = memo(function ListItemNode({ id, data }: NodeProps<ListItemNode>) {
    const { deleteElements } = useReactFlow()

    const parents = useNodeConnections({handleType: 'source', handleId: 'element'})

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
            >
                <AddNodeButton limit={true} nodeData={{text: ''}} nodeType='text' connectionType="string" position={{x: 300, y: 0}}/>
            </Input>
        </ElementBase>
    )
})
  

