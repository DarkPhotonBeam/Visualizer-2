<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Visualizer 2</title>
    <style>
        body { padding: 0;margin: 0; width: 100%; height: 100%;background-color: #000;overflow: hidden;}
        canvas { display: block; position: fixed; top:0; left: 0; }
        #threejscanvas {
            z-index: 1000;
        }
        .p5Canvas {
            z-index: -100;
        }
        #loadingScreen {
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            align-items: center;
            justify-content: center;
        }
        /*#tint {*/
        /*    z-index: 0;*/
        /*    position: fixed;*/
        /*    top: 0;*/
        /*    left: 0;*/
        /*    width: 100%;*/
        /*    height: 100%;*/
        /*    background-color: rgba(0, 0, 0, 0.5);*/
        /*}*/
    </style>
    <script src="js/lib/p5/p5.js"></script>
    <script src="js/lib/p5/addons/p5.sound.js"></script>
</head>
<body>
    <?php
        // Get Requested Song
        $songID = $_POST["song"];
        $albumID = $_POST["album"];


        // Read json --> Get URL
        $json = file_get_contents('https://dev.darkphotonbeam.com/audio/metadata.json');
        $json_data = json_decode($json,true);
        $url = 'audio/'.$json_data[intval($albumID)]["folderSrc"].'/'.$json_data[intval($albumID)]["songs"][intval($songID)]["src"];
        //echo "BRUH: ".$url;
        //setcookie('curSong', $url, time() + (86400*30), "/");

        echo '<span id="songData" style="display:none;">'.$url.'</span>';

    ?>
<!--    <div id="tint"></div>-->
    <div id="loadingScreen">
        <div>
            <img src="img/load.gif" />
        </div>
    </div>
    <script src="js/lib/threejs/three.js"></script>
    <script src="js/sketch.js"></script>
</body>
</html>