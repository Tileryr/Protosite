import CircleButton from "./Inputs/CircleButton"

export default function Warning({ on }: { 
    on: boolean
}) {
    return (
        <div 
            style={{opacity: on ? 100 : 0}} 
            className="rounded-full inline-flex h-4 aspect-square justify-center items-center ml-1
            bg-red-500 transition-opacity duration-[0.1s] ease-in"
        >
            <span>!</span>
        </div >
    )
}