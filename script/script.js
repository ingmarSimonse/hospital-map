window.onload = function () {
    let mapImageHTML = document.getElementById('mapImage');
    let mapCanvasHTML = document.getElementById('mapCanvas');
    let dataMapCanvasHTML = document.getElementById('dataMapCanvas');

    let clickIndex = 0;
    let clickArray = [];

    let dataCtx = dataMapCanvasHTML.getContext('2d');
    let ctx = mapCanvasHTML.getContext('2d');

    let sizeMultiplier = mapImageHTML.offsetWidth / mapImageHTML.naturalWidth;

    mapCanvasHTML.height = mapImageHTML.offsetHeight.toString();
    mapCanvasHTML.width = mapImageHTML.offsetWidth.toString();
    dataMapCanvasHTML.height = mapImageHTML.offsetHeight.toString();
    dataMapCanvasHTML.width = mapImageHTML.offsetWidth.toString();
    dataMapCanvasHTML.style.opacity = '0.5';

    let originalSafeZoneArray = [
        {x: 166, y: 85, w: 478, h: 26},
        {x: 166, y: 109, w: 28, h: 392},
        {x: 452, y: 109, w: 28, h: 438},
        {x: 194, y: 390, w: 260, h: 18},
        {x: 480, y: 390, w: 29, h: 18},
        {x: 74, y: 424, w: 92, h: 15},
        {x: 194, y: 471, w: 260, h: 30},
        {x: 480, y: 531, w: 126, h: 15},
        {x: 604, y: 510, w: 73, h: 51},
        {x: 198, y: 501, w: 18, h: 140},
        {x: 452, y: 547, w: 25, h: 118},
        {x: 383, y: 594, w: 69, h: 70},
        {x: 216, y: 594, w: 53, h: 15},
        {x: 216, y: 625, w: 98, h: 15},
        {x: 252, y: 609, w: 17, h: 16},
        {x: 312, y: 625, w: 71, h: 39},
        {x: 373, y: 664, w: 37, h: 17},
        {x: 367, y: 681, w: 48, h: 67},
    ];

    // Calc SafeZoneArray
    let safeZoneArray = [];
    for (let i = 0; i < originalSafeZoneArray.length; i++) {
        safeZoneArray.push(
            {
                x: originalSafeZoneArray[i]["x"] * sizeMultiplier, y: originalSafeZoneArray[i]["y"] * sizeMultiplier, w: originalSafeZoneArray[i]["w"] * sizeMultiplier, h: originalSafeZoneArray[i]["h"] * sizeMultiplier,
            }
        )
    }

    // draw onclick canvas
    dataCtx.fillStyle = "#000000";
    dataCtx.fillRect(0,0,mapImageHTML.offsetWidth, mapImageHTML.offsetHeight);
    dataCtx.fillStyle = "#FFFFFF";
    for (let i = 0; i < safeZoneArray.length; i++) {
        dataCtx.fillRect(safeZoneArray[i]["x"], safeZoneArray[i]["y"], safeZoneArray[i]["w"], safeZoneArray[i]["h"],)
    }

    // checkpoints based on safe zone
    let checkpointArray = [];
    for (let i = 0; i < safeZoneArray.length; i++) {
        for (let x = safeZoneArray[i]["x"] + 5; x < safeZoneArray[i]["x"] + safeZoneArray[i]["w"] - 5; x += 18) {
            for (let y = safeZoneArray[i]["y"] + 5; y < safeZoneArray[i]["y"] + safeZoneArray[i]["h"] - 5; y += 18) {
                checkpointArray.push(
                    {
                        x: x,
                        y: y
                    }
                );
            }
        }
    }

    // draw checkpoints
    // for (let i = 0; i < checkpointArray.length; i++) {
    //     ctx.fillRect(checkpointArray[i]['x'], checkpointArray[i]['y'], 1, 1);
    // }

    // coordinates
    dataMapCanvasHTML.addEventListener('mousemove', function (event) {
        let x = event.clientX;
        let y = event.clientY;
        document.getElementById('xHTML').innerHTML = x.toString();
        document.getElementById('yHTML').innerHTML = y.toString();
    });

    //Map Onclick
    mapCanvasHTML.addEventListener('click', function(event) {
        let x = event.offsetX;
        let y = event.offsetY;
        let pixelData = dataCtx.getImageData(x, y, 1, 1).data;

        if (checkPixelData(pixelData)) {
            clickIndex++;
            if (clickIndex === 1) {
                ctx.fillRect(x - 5, y - 5, 10, 10);
                clickArray.push(
                    {
                        x: x,
                        y: y
                    }
                );
            } else if (clickIndex === 2) {
                ctx.fillRect(x - 5, y - 5, 10, 10);
                clickArray.push(
                    {
                        x: x,
                        y: y
                    }
                );
                clickArray.push(
                    {
                        x: clickArray[1]['x'] - clickArray[0]['x'],
                        y: clickArray[1]['y'] - clickArray[0]['y']
                    }
                );
                checkpointArray.push(
                    {
                        x: x,
                        y: y
                    }
                )

                let w;
                if (typeof Worker !== "undefined") {
                    if (typeof w == "undefined") {
                        w = new Worker("./script/calcRoute.js");
                        let postArray = [];
                        postArray.push(checkpointArray);
                        postArray.push(clickArray);
                        postArray.push(safeZoneArray);
                        w.postMessage(postArray);
                    }
                    w.onmessage = function (e) {
                        let route = e.data;
                        ctx.moveTo(clickArray[0]['x'], clickArray[0]['y']);
                        for (let i = 0; i < route.length; i++) {
                            ctx.lineTo(checkpointArray[route[i]]['x'], checkpointArray[route[i]]['y']);
                            ctx.stroke();
                        }
                    }
                }
            } else {
                window.location.reload();
            }
        }
    });
}

function checkPixelData(data) {
    return data[1] !== 0;
}