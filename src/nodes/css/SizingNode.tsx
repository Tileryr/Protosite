import { useReactFlow } from "@xyflow/react";
import UnitField from "../../components/Inputs/UnitField";
import OutputNode from "../../components/Nodes/BaseOutputNode";
import { ClassNodeProps } from "../../nodeutils";
import Checkbox from "../../components/Inputs/Checkbox";

export default function SizingNode({id, data}: ClassNodeProps<'sizing'>) {
    const { updateNodeData } = useReactFlow()
    //width //height //padding //margin //sizing-type
    return (
        <OutputNode name="Sizing" type="styling">
            <label>
                Box-Sizing
                <select title="Box Sizing" className="block bg-dry-purple-800 w-full rounded-full"
                    onChange={(event) => updateNodeData(id, {styling: {...data.styling, 'box-sizing': event.target.value}})}
                >
                    <option value="content-box">Content-Box</option>
                    <option value="border-box">Border-Box</option>
                </select>
            </label>
            <UnitField 
                label="Width:"
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'width': `${value}${unit}`}})}
                max={1000}
            />
            <UnitField 
                label="Height:"
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'height': `${value}${unit}`}})}
                max={1000}
            />
            <UnitField 
                label="Padding:"
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'padding': `${value}${unit}`}})}
                max={1000}
            >
            </UnitField>

            <UnitField 
                label="Margin:"
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'margin': `${value}${unit}`}})}
                max={1000}
            />
        </OutputNode>
    )
}