import OutputNode from "../../components/Nodes/BaseOutputNode";
import UnitField from "../../components/Inputs/UnitField";
import { ClassNodeProps } from "../../nodeutils";
import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";

interface Font {
    category: string
    family: string
    files: Record<string, string>
    kind: string
    lastModified: string
    menu: string
    subsets: string[]
    variants: string[]
    version: string
}
export default function TypographyNode({ id, data }: ClassNodeProps<'typography'>) {
    const { updateNodeData } = useReactFlow()
    const [fonts, setFonts] = useState<Font[]>([])
    useEffect(() => {
        const getFonts = async () => {
            const fonts = await (await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${import.meta.env.VITE_GOOGLE_API_KEY}&sort=popularity`)).json()
            console.log(fonts)
            setFonts(fonts.items)
            
        }
        getFonts()
        
    }, [])
    return (
        <OutputNode name="Typography" type="styling">
            <label>
                Font-Family
                <select title="Font Selector" className="block bg-dry-purple-800 w-full rounded-full" 
                onChange={(event) => {
                    const [fontURL, fontFamily] = event.target.value.split('|', 2)
                    updateNodeData(id, {styling: {...data.styling, 'font-family': fontFamily}})
                    updateNodeData(id, {imports: [fontURL]})
                }}>
                    {fonts.slice(0, 100).map((font) => {
                        var apiUrl = [];
                        apiUrl.push('https://fonts.googleapis.com/css?family=');
                        apiUrl.push(font.family.replace(/ /g, '+'));
                        if (font.variants.includes('italic')) {
                            apiUrl.push(':');
                            apiUrl.push('italic');
                        }
                        if (font.variants.includes('greek')) {
                            apiUrl.push('&subset=');
                            apiUrl.push('greek');
                        }
                        var url = apiUrl.join('');

                        return (
                            <option value={`${url}|${font.family}`} key={font.family}>{font.family}</option>
                        )
                    })}
                </select>
            </label>
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