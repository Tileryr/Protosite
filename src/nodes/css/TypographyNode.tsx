import OutputNode from "../../components/Nodes/BaseOutputNode";
import UnitField from "../../components/Inputs/UnitField";
import { ClassNodeProps } from "../../nodeutils";
import { useReactFlow } from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";
import useNumberField from "../../components/Inputs/NumberField";

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
    const [textColor, setTextColor] = useState('')

    const fontOptions = useMemo(() => fonts.slice(0, 100).map((font) => {
        var apiUrl = [];
        apiUrl.push('https://fonts.googleapis.com/css?family=');
        apiUrl.push(font.family.replace(/ /g, '+'));

        if (font.variants.includes('italic')) {
            apiUrl.push(':');
            apiUrl.push('ital');
        }

        var url = apiUrl.join('');
        // const fileTypes =  Object.keys(font.files),
        // firstFile = fileTypes[0].replace(/\D/g,''),
        // lastFile = fileTypes[fileTypes.length - 1].replace(/\D/g,'')
        // apiUrl.push(`,wght@0,${firstFile}..${lastFile};1,${firstFile}..${lastFile}`)
        console.count()
        return <option value={`${url}|${font.family}`} key={font.family}>{font.family}</option>
    }), [fonts])

    const [fontWeightProps] = useNumberField({
        onBlur: (fontWeight) => Math.round(fontWeight/100)*100,
        onChange: (newFontWeight) => updateNodeData(id, {styling: {...data.styling, 'font-weight': newFontWeight}}),
        min: 100,
        max: 900
    })

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
                Font-Family:
                <select title="Font Selector" className="block bg-dry-purple-800 w-full rounded-full" 
                    onChange={(event) => {
                        const [fontURL, fontFamily] = event.target.value.split('|', 2)
                        updateNodeData(id, {styling: {...data.styling, 'font-family': fontFamily}})
                        updateNodeData(id, {imports: [fontURL]})
                    }}
                >
                    {fontOptions}
                </select>
            </label>
            <UnitField 
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'font-size': `${value}${unit}`}})}
                label="Font-Size:"
            />
            <label className="block">
                Font-Weight:
                <input {...fontWeightProps} className="block w-full rounded-full bg-dry-purple-950 pl-1 leading-4">
                </input>
            </label>
            <UnitField 
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'line-height': `${value}${unit}`}})}
                label="Line-Height:"
            />
            <UnitField 
                onChange={(value, unit) => updateNodeData(id, {styling: {...data.styling, 'letter-spacing': `${value}${unit}`}})}
                label="Letter-Spacing:"
            />
            <label className="block mt-2">
                Color:
                <input type="color" className="bg-transparent border-bright-purple-200 rounded-sm align-middle ml-2"
                onChange={(event) => setTextColor(event.target.value)}
                onBlur={() => updateNodeData(id, {styling: {...data.styling, 'color': textColor}})}>
                </input>
            </label>
        </OutputNode>
    )    
}