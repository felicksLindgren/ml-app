import { useState } from "react"
import { useAnimationFrame } from "../lib/hooks/useAnimationFrame";

export default function FpsCounter() {
    const [fps, setFps] = useState(0);
    const [count, setCount] = useState(0);
    const [animate, setAnimate] = useState(false);

    useAnimationFrame(delta => {
        setFps(() => Math.floor(1000 / delta));
        setCount(prev => prev + 1);
    }, animate);
    
    return (
        <>
            <span>{fps} FPS, {count}</span>
            <button onClick={() => setAnimate(!animate)}>Toggle</button>
        </>
    )
}