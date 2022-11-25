import styles from "../../styles/Home.module.css";
import { useEffect, useRef, useState } from 'react';
import { createDetector, SupportedModels } from "@tensorflow-models/hand-pose-detection";
import '@tensorflow/tfjs-backend-webgl';
import { drawHands } from "../../lib/utils";
import Link from "next/link";
import { useAnimationFrame } from "../../lib/hooks/useAnimationFrame";
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';

tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm`);

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

async function setupDetector() {
    const model = SupportedModels.MediaPipeHands;
    const detector = await createDetector(
        model,
        {
            runtime: "mediapipe",
            maxHands: 2,
            solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
        }
    );

    return detector;
}

async function setupCanvas(video) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = video.width;
    canvas.height = video.height;

    return ctx;
}

export default function HandPoseDetection() {
    const detectorRef = useRef();
    const videoRef = useRef();
    const [ctx, setCtx] = useState();

    useEffect(() => {
        async function initialize() {
            videoRef.current = await setupVideo();
            const ctx = await setupCanvas(videoRef.current);
            detectorRef.current = await setupDetector();

            setCtx(ctx);
        }

        initialize();
    }, []);

    useAnimationFrame(async delta => {
        const hands = await detectorRef.current.estimateHands(
            video,
            {
                flipHorizontal: false
            }
        );

        ctx.clearRect(0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        ctx.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        drawHands(hands, ctx);
    }, !!(detectorRef.current && videoRef.current && ctx));

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h2
                    style={{
                        fontWeight: "normal"
                    }}>
                    <Link style={{ fontWeight: "bold" }} href={'/'}>Home</Link> / Hand Pose Detection 👋
                </h2>
                <code style={{ marginBottom: '1rem' }}>Work in progress...</code>
                <canvas
                    style={{
                        transform: "scaleX(-1)",
                        zIndex: 1,
                        borderRadius: "1rem",
                        boxShadow: "0 3px 10px rgb(0 0 0)",
                        maxWidth: "85vw"
                    }}
                    id="canvas">
                </canvas>
                <video
                    style={{
                        visibility: "hidden",
                        transform: "scaleX(-1)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 0,
                        height: 0
                    }}
                    id="video"
                    playsInline>
                </video>
            </main>
        </div>
    )
}