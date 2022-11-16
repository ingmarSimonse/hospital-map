self.onmessage = function (e) {
    let checkpointArray = e.data[0];
    let clickArray = e.data[1];
    let safeZoneArray = e.data[2];
    let route = [];
    let completeDistance = 999999;
    let count = 0;
    for (let o = 0; o < 1000 && count < 100; o++) {

        let saveClickArray = [];
        saveClickArray.push(
            {
                x: clickArray[0]['x'],
                y: clickArray[0]['y']
            },
            {
                x: clickArray[1]['x'],
                y: clickArray[1]['y']
            }
        );
        let saveCheckPointIDs = [];
        let saveDistance = [];
        let notAtDestination = true;
        let notStuck = true;
        while (notAtDestination && notStuck) {
            let saveCheckpointPosition = [];

            // goes trough all checkpoints
            for (let i = 0; i < checkpointArray.length; i++) {
                let doesntGoThroughWall = true;
                let u = 0;

                // Check if checkpoint route goes trough wall
                while (u < 20 && doesntGoThroughWall) {
                    let checkX = Math.round(saveClickArray[0]['x'] + (checkpointArray[i]['x'] - saveClickArray[0]['x']) / 20 * u);
                    let checkY = Math.round(saveClickArray[0]['y'] + (checkpointArray[i]['y'] - saveClickArray[0]['y']) / 20 * u);

                    let index = 0;
                    for (let x = 0; x < safeZoneArray.length; x++) {
                        let checkTrueOrFalse1 = checkX < safeZoneArray[x]['x'] || checkY < safeZoneArray[x]['y'];
                        let checkTrueOrFalse2 = checkX > safeZoneArray[x]['x'] + safeZoneArray[x]['w'] || checkY > safeZoneArray[x]['y'] + safeZoneArray[x]['h'];
                        if (checkTrueOrFalse1 || checkTrueOrFalse2) {
                            //
                        } else {
                            index++;
                        }
                    }
                    if (index === 0) {
                        doesntGoThroughWall = false;
                    }
                    u++;
                }

                // Distance from destination
                let distanceX =  checkpointArray[i]['x'] - saveClickArray[1]['x'];
                let distanceY =  checkpointArray[i]['y'] - saveClickArray[1]['y'];
                let distanceXY = Math.abs(distanceX) + Math.abs(distanceY);
                let isInArray = saveCheckPointIDs.includes(i);
                if (doesntGoThroughWall && isInArray === false) {
                    // Save checkpoints
                    saveCheckpointPosition.push(
                        {
                            id: i,
                            distance: distanceXY
                        }
                    );
                }
            }

            if (saveCheckpointPosition.length === 0) {
                notStuck = false;
            } else {
                // Random checkpoint
                let randomCheckPoint;
                saveCheckpointPosition.sort(function (a, b) {
                    return a['distance'] - b['distance'];
                });
                let random100 = Math.floor(Math.random() * 100);
                if (random100 >= 55) {
                    randomCheckPoint = saveCheckpointPosition[0]['id'];
                } else if (random100 >= 45) {
                    if (saveCheckpointPosition.length === 1) {
                        randomCheckPoint = saveCheckpointPosition[0]['id'];
                    } else {
                        randomCheckPoint = saveCheckpointPosition[1]['id'];
                    }
                } else {
                    let randomNumber = Math.floor(Math.random() * saveCheckpointPosition.length);
                    randomCheckPoint = saveCheckpointPosition[randomNumber]['id'];
                }

                saveDistance.push(Math.abs(checkpointArray[randomCheckPoint]['x'] - saveClickArray[0]['x']) + Math.abs(checkpointArray[randomCheckPoint]['y'] - saveClickArray[0]['y']));
                saveCheckPointIDs.push(randomCheckPoint);

                if (saveClickArray[1]['x'] === checkpointArray[randomCheckPoint]['x'] &&
                    saveClickArray[1]['y'] === checkpointArray[randomCheckPoint]['y']) {
                    notAtDestination = false;
                } else {
                    saveClickArray[0]['x'] = checkpointArray[randomCheckPoint]['x'];
                    saveClickArray[0]['y'] = checkpointArray[randomCheckPoint]['y'];
                }
            }
        }
        let check = saveDistance.reduce(function (a, b) {return a + b;}, 0);
        if (completeDistance > check && notStuck && saveCheckPointIDs.length > 0) {
            completeDistance = check;
            route = [...saveCheckPointIDs];
            count = 0;
        } else {
            count++;
        }
    }
    self.postMessage(route);
}
