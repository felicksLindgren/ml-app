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

async function renderResults(detector, video, ctx) {
    const hands = await detector.estimateHands(
        video,
        { 
            flipHorizontal: false
        }
    );

    ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    drawHands(hands, ctx);
}

export default function HandPoseDetection() {
    const detectorRef = useRef();
    const videoRef = useRef();
    const [ctx, setCtx] = useState();

    useEffect(() => {
        async function setup() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const stream = await window.navigator.mediaDevices.getUserMedia({ video: true });

            video.srcObject = stream;
            await new Promise((resolve) => {
                video.onloadeddata = () => {
                    resolve();
                };
            });
            video.play();

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            // Must set below two lines, otherwise video element doesn't show.
            video.width = videoWidth;
            video.height = videoHeight;
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const model = SupportedModels.MediaPipeHands;
            const detector = await createDetector(
                model, 
                { 
                    runtime: "mediapipe",
                    maxHands: 2,
                    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands'
                }
            );

            videoRef.current = video;
            detectorRef.current = detector;
            setCtx(ctx);
        }

        setup();
    }, []);

    useAnimationFrame(async delta => {
        await renderResults(detectorRef.current, videoRef.current, ctx);
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