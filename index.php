<!DOCTYPE html>
<html lang="nl">
<head>
    <meta http-equiv="Content-Type" content="text/html" charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles/styles.css">
    <script src="./script/script.js"></script>
    <script src="./script/calcRoute.js"></script>
    <title>Hospital Map</title>
</head>
<body>
    <div id="mapMain">
        <img src="./images/hospital_image.jpg" alt="x" id="mapImage">
        <div class="center">
            <canvas id="mapCanvas"></canvas>
        </div>
        <div class="center">
            <canvas id="dataMapCanvas"></canvas>

        </div>
    </div>
    <p id="xHTML"></p>
    <p id="yHTML"></p>
</body>
</html>