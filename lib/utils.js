const fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

const NUM_KEYPOINTS = 100;

export const drawFaces = (faces, ctx) => {
    for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        ctx.fillStyle = '#32EEDB';
        
        for (let y = 0; y < face.keypoints.length; y++) {
            const keypoint = face.keypoints[y];

            ctx.beginPath();
            ctx.arc(keypoint.x, keypoint.y, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

export const drawHands = (hands, ctx, showNames = false) => {
    if (hands.length <= 0) { return; }

    hands.sort((hand1, hand2) => {
        if (hand1.handedness < hand2.handedness) return 1;
        if (hand1.handedness > hand2.handedness) return -1;
        return 0;
    });

    // while (hands.length < 2) { hands.push(); }

    for (let i = 0; i < hands.length; i++) {
        ctx.fillStyle = hands[i].handedness === 'Left' ? 'black' : 'Blue';
        ctx.strokeStyle = 'White';
        ctx.lineWidth = 2;
        
        for (let y = 0; y < hands[i].keypoints.length; y++) {
            const keypoint = hands[i].keypoints[y];
            ctx.beginPath();
            ctx.arc(
                keypoint.x,
                keypoint.y,
                4,
                0,
                2 * Math.PI
            );
            ctx.fill();

            if (showNames) {
                drawInvertedText(keypoint, ctx);
            }
        }

        const fingers = Object.keys(fingerLookupIndices);
        for (let z = 0; z < fingers.length; z++) {
            const finger = fingers[z];
            const points = fingerLookupIndices[finger].map(idx => hands[i].keypoints[idx]);
            drawPath(points, ctx);
        }
    }
}

const drawInvertedText = (keypoint, ctx) => {
    ctx.save();
    ctx.translate(keypoint.x - 10, keypoint.y);
    ctx.rotate(-Math.PI / 1);
    ctx.scale(1, -1);
    ctx.fillText(keypoint.name, 0, 0);
    ctx.restore();
}

const drawPath = (points, ctx) => {
    const region = new Path2D();
    region.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point.x, point.y);
    }

    ctx.stroke(region);
}