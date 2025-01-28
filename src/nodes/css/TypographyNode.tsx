import OutputNode from "../../components/Nodes/BaseOutputNode";
import UnitField from "../../components/Inputs/UnitField";
import { ClassNodeProps } from "../../nodeutils";
import { useReactFlow } from "@xyflow/react";

export default function TypographyNode({ id, data }: ClassNodeProps<'typography'>) {
    const { updateNodeData } = useReactFlow()
    const fonts = fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${import.meta.env.VITE_GOOGLE_API_KEY}`)
    
    console.log(JSON.stringify(fonts))
    return (
        <OutputNode name="Typography" type="styling">
            <UnitField 
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'font-size': `${value}${unit}`}})}
                label="Font-Size:"
            />
            <UnitField 
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'line-height': `${value}${unit}`}})}
                label="Line-Height:"
            />
        </OutputNode>
        
    )    
}