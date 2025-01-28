import OutputNode from "../../components/Nodes/BaseOutputNode";
import UnitField from "../../components/Inputs/UnitField";
import { ClassNodeProps } from "../../nodeutils";
import { useReactFlow } from "@xyflow/react";

export default function TypographyNode({ id, data }: ClassNodeProps<'typography'>) {
    const { updateNodeData } = useReactFlow()

    const getFonts = async () => {
        const fonts = await (await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${import.meta.env.VITE_GOOGLE_API_KEY}&sort=popularity`)).json()
        const topFonts = fonts.items.slice(0, 100)
        const firstFont = topFonts[0]
        var apiUrl = [];
        apiUrl.push('https://fonts.googleapis.com/css?family=');
        apiUrl.push(firstFont.family.replace(/ /g, '+'));
        if (firstFont.variants.includes('italic')) {
            apiUrl.push(':');
            apiUrl.push('italic');
        }
        if (firstFont.variants.includes('greek')) {
            apiUrl.push('&subset=');
            apiUrl.push('greek');
        }

        var url = apiUrl.join('');
    }
    getFonts()
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