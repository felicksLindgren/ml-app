import styles from '../../styles/Home.module.css'
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from '../../lib/hooks/useAnimationFrame';
import '@tensorflow/tfjs-backend-webgl';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import { drawFaces } from '../../lib/utils';

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`);

async function setupDetector() {
    const faceLandmarksDetection = await import('@tensorflow-models/face-landmarks-detection');

    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detector = faceLandmarksDetection.createDetector(model, {
        runtime: 'tfjs',
        // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/',
        maxFaces: 1
    });

    return detector;
}

async function setupVideo() {
    const video = document.getElementById('video');
    const stream = await window.navigator.mediaDevices.getUserMedia({ video: true });

    video.srcObject = stream;
    await new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve();
        }
    });
    video.play();

    video.width = video.videoWidth;
    video.height = video.videoHeight;

    return video;
}

async function setupCanvas(video) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.width;
    canvas.height = video.height;

    return ctx;
}

export default function FaceLandmarkDetection() {
    const detectorRef = useRef();
    const videoRef = useRef();
    const [ctx, setCtx] = useState();

    useEffect(() => {
        async function initialize() {
            detectorRef.current = await setupDetector();
            videoRef.current = await setupVideo();
            const ctx = await setupCanvas(videoRef.current);

            setCtx(ctx);
        }

        initialize();
    }, []);

    useAnimationFrame(async delta => {
        const faces = await detectorRef.current.estimateFaces(video);
        
        ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
        ctx.drawImage(videoRef.current, 0, 0);
        drawFaces(faces, ctx);
    }, !!(detectorRef.current && videoRef.current && ctx))

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h2
                    style={{
                        fontWeight: "normal"
                    }}>
                    <Link style={{ fontWeight: "bold" }} href={'/'}>Home</Link> / Face Landmark Detection 🤓
                </h2>
                <code>Work in progress...</code>
                {/* <FaceMeshComponent></FaceMeshComponent> */}
                <canvas
                    style={{
                        transform: "scaleX(-1)",
                        zIndex: 1,
                        borderRadius: "1rem",
                        boxShadow: "0 3px 10px rgb(0 0 0)"
                    }}
                    id="canvas">
                </canvas>
                <video
                    style={{
                        visibility: "hidden",
                        transform: "scaleX(-1)",
                        width: "auto",
                        height: "auto",
                        position: "absolute",
                        top: 0,
                        left: 0
                    }}
                    id="video"
                    playsInline>
                </video>
            </main>
        </div>
    )
}