const fingerLookupIndices = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

export const drawResults = (hands, ctx) => {
    if (hands.length <= 0) { return; }

    hands.sort((hand1, hand2) => {
        if (hand1.handedness < hand2.handedness) return 1;
        if (hand1.handedness > hand2.handedness) return -1;
        return 0;
    });

    while (hands.length < 2) { hands.push({}); }

    for (let i = 0; i < hands.length; i++) {
        ctx.fillStyle = hands[i].handedness === 'Left' ? 'Red' : 'Blue';
        ctx.strokeStyle = 'White';
        ctx.lineWidth = 2;

        if (hands[i].keypoints == null) { continue; }
        
        for (let y = 0; y < hands[i].keypoints.length; y++) {
            console.log(hands[i].keypoints[y].x - 2);
            ctx.beginPath();
            ctx.arc(
                hands[i].keypoints[y].x - 2,
                hands[i].keypoints[y].y - 2,
                3,
                0,
                2 * Math.PI
            );
            ctx.fill();
        }

        // const fingers = Object.keys(fingerLookupIndices);
        // for (let i = 0; i < fingers.length; i++) {
        //     const finger = fingers[i];
        //     const points = fingerLookupIndices[finger].map(idx => keypoints[idx]);
        //     this.drawPath(points, false);
        // }
    }
}

// const drawPath = (points, closePath) => {
//     const region = new Path2D();
//     region.moveTo(points[0].x, points[0].y);
//     for (let i = 1; i < points.length; i++) {
//         const point = points[i];
//         region.lineTo(point.x, point.y);
//     }

//     if (closePath) {
//         region.closePath();
//     }
//     this.ctx.stroke(region);
// }