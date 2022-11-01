import styles from "../../styles/Home.module.css";
import { useEffect } from 'react';
import { createDetector, SupportedModels } from "@tensorflow-models/hand-pose-detection";
import '@tensorflow/tfjs-backend-webgl';
import { drawResults } from "../../lib/utils";

async function renderResults(detector, video, ctx) {
    const hands = await detector.estimateHands(video, { flipHorizontal: true });
    ctx.clearRect(0, 0, video.videoWidth, video.videoHeight);
    drawResults(hands, ctx);

    requestAnimationFrame(() => { renderResults(detector, video, ctx) });
}

export default function HandPoseDetection() {
    useEffect(() => {
        async function setup() {
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const stream = await window.navigator.mediaDevices.getUserMedia({ video: true });

            video.srcObject = stream;
            video.onloadedmetadata = async (e) => {
                video.play();

                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                // Must set below two lines, otherwise video element doesn't show.
                video.width = videoWidth;
                video.height = videoHeight;
                canvas.width = videoWidth;
                canvas.height = videoHeight;

                const model = SupportedModels.MediaPipeHands;
                const detector = await createDetector(model, { runtime: 'tfjs' });

                requestAnimationFrame(() => { renderResults(detector, video, ctx) });
            }
        }

        setup();
    }, []);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Hand Pose Detection</h1>
                <canvas style={{ marginBlockStart: "calc(.67em * 4)", position: "absolute", zIndex: 1 }} id="canvas"></canvas>
                <video
                    style={{ visibility: "hidden", transform: "scaleX(-1)", width: "auto", height: "auto" }}
                    id="video"
                    playsInline>
                </video>
            </main>
        </div>
    )
}