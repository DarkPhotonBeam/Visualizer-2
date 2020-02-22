//import * as THREE from "./lib/threejs/three";

const pi = Math.PI;

let sound, amplitude, fft, spectrum;
let mbShader;

let level = 0;

// p5 sound preload
function preload() {
    // PRELOAD BACKGROUND SHADERS
    mbShader = loadShader('https://dev.darkphotonbeam.com/projects/visualizer2/shaders/mandelbrot.vert', "https://dev.darkphotonbeam.com/projects/visualizer2/shaders/mandelbrot.frag");

    let val = document.getElementById("songData").innerText;
    let url = 'https://dev.darkphotonbeam.com/'+val;
    sound = loadSound(url);
}

// p5 setup
function setup() {
    //cnv = createCanvas(0,0);
    masterVolume(1);
    sound.play();
    amplitude = new p5.Amplitude();
    fft = new p5.FFT();
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    console.log("p5 SETUP");

    noStroke();

    // START THREE.JS ANIMATION
    animate();
}
let zoom = 100;
let dtc = 0;

let off = [0, 0];
let initX = Math.random() * 2 * pi;

function draw() {
    dtc += deltaTime;


    zoom = 100 + 75*sin(dtc*0.0001);

    let zval = Math.pow(0.0025, 1/(zoom*zoom));
    let zval2 = Math.pow(0.01, 1/(zoom));
    // zval = (0.001*deltaTime) / Math.pow(zoom, zoom*0.01);
    // if (keyIsDown(LEFT_ARROW)) {
    //     off[0] -= zval;
    // } else if (keyIsDown(RIGHT_ARROW)) {
    //     off[0] += zval;
    // }
    // if (keyIsDown(UP_ARROW)) {
    //     off[1] -= zval;
    // } else if (keyIsDown(DOWN_ARROW)) {
    //     off[1] += zval;
    // }

    //zoom = 100*-cos(dtc*0.003) + 101;
    //zoom = 200-(40*sin(dtc*0.0001)+40);
    //console.log(zoom);
    //off[0] += Math.sign(sin(dtc * 0.1))*0.1;
    //off[1] += Math.sign(cos(dtc * 0.1))*0.1;

    // shader() sets the active shader with our shader
    let circCentre = [-1, 0];
    let circRadius = 0.25 + (0.0001 + 0.0001*cos(dtc*0.000079)) + 0.00001;
    let angle = 4.5*pi/4 + dtc * (1/zoom) * 0.0001;
    // off = [
    //     circCentre[0] + circRadius * sin(angle),
    //     circCentre[1] + circRadius * cos(angle)
    // ];
    off = [
        -1.7 + 0.125 + 0.2*sin(dtc * (1/zoom) * 0.001 + initX),
        0.00001*sin(dtc * 0.0001)
    ];

    mbShader.setUniform("u_resolution", [width, height]);
    mbShader.setUniform("u_offset", off);
    mbShader.setUniform("u_mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
    mbShader.setUniform("u_zoom", zoom);
    mbShader.setUniform("u_iter", 100);
    mbShader.setUniform("u_level", level);

    shader(mbShader);

    // rect gives us some geometry on the screen

    rect(0,0,width,height);



    // print out the framerate

    //  print(frameRate());

}

function windowResized(){

    resizeCanvas(windowWidth, windowHeight);

}

function mouseClicked() {
    console.log("COORD: " + off);
    console.log("ZOOM: " + zoom);
}

// function mouseWheel(event) {
//     //print(event.delta);
//     //move the square according to the vertical scroll amount
//
//     zoom -= event.delta;
//     if (zoom < 1) zoom = 1;
//     // //uncomment to block page scrolling
//     // //return false;
//     // console.log(zoom);
// }

function rgb(r, g, b) {
    return "rgb(" + (r%256) + ", " + (g%256) + ", " + (b%256) + ")";
}

function sweep(time) {
    return 0.5*Math.sin(time) + 0.5;
}

function asEnvelopeFS(signal, attack, sustain, steep) {
    if (signal > attack) {
        return sustain;
    } else {
        return Math.pow(signal/attack, steep)
    }
}

/// THREE.JS SCENE SETUP

const FOV = 50; // DEF: 75

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( FOV, window.innerWidth/window.innerHeight, 0.1, 1000 );

let renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.domElement.id = 'threejsCanvas';

// Resize canvas on window resize
window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});


document.body.appendChild( renderer.domElement );

const CUBE_SIDE = 0.1;

// let geometry = new THREE.BoxGeometry();
let geometry = new THREE.BoxGeometry(CUBE_SIDE, CUBE_SIDE, CUBE_SIDE); // 32
let material = new THREE.MeshBasicMaterial( {
    color: 0xaa0033,
    flatShading: true,
    transparent: true,
    opacity: 1
} );


let objArr = []; // All cubes/meshes are stored in here for later processing
let origin = { // Center of the circle
    x: 0,
    y: 0,
    z: -30
};


function addObjects(geo, mat, num, amp, offAng) {

    for (let i = 0; i < num; i++) {
        let angle = i / num * 2 * pi + offAng;
        //if (i === 0) angle = 0;
        let mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = origin.z;

        // cube.position.x = cubeAmp * sin(angle);
        // cube.position.y = cubeAmp * cos(angle);
        //console.log(amp);


        objArr.push({
            "mesh" : mesh,
            "angle" : angle,
            "amp" : amp,
            "color" : [1.0, 0.0, 0.0],
            "opacity": 1.0,
            "offAngle" : offAng
        });
        scene.add(mesh);
    }

}

// Ring settings
const OBJ_NUM = 16;
const OBJ_AMP = 2;
const OBJ_OFF = 0;

addObjects(geometry, material, OBJ_NUM, OBJ_AMP, OBJ_OFF); // First summon


// Camera position init
camera.position.z = 5;

let angleAdd = 0.0;
ampAdd = 0;

/// COUNTERS FOR TIME RELATED ACTIONS
// How many summons
let tcount01 = 0;
const TCOUNT01 = 0.8;

// How many normalisation checks
let tcount02 = 0;
const TCOUNT02 = 0.5;

//let deltaTime;
let then = 0.0;

var clock = new THREE.Clock();

let levelSamples = [];
const SAMPLE_BUFFER = 1000; // Buffer size, the bigger the more accurate the normalisation is


let loudest = 0;
let quietest = 1;
let normalisationBoost = 0;

// Normalisation controls
const NORM_BIAS = 0.1;
const NORM_LEVEL = 0.3;
const MIN_SAMPLES = 100;

// How much the signal should be compressed if over the threshold
const COMP_RATIO = 0.8;

// Controls how much the "zoom" is influenced by the level
const SPEED_RAMP_EXP = 1.4;
const SPEED_RAMP_OFF = 0.1;
const SPEED_RAMP_BIAS = 90;
const SPEED_RAMP_BIAS2 = 0.05;
let speedRampBias = 1;

// How fast the cubes rotate around the center
const ANGLE_ROTATION = 0.3;

// Controls how much the level influences the cube size
const SIDE_AMP_EXP = 1.5;
const SIDE_AMP_OFF = 0.1;
const SIDE_AMP_BIAS = 20;

// Controls how much the level controls the circle radius, usually creates a rumble effect
const AMP_EXP = 1.5;
const AMP_OFF = 0.1;
const AMP_BIAS = 5;

// Controls the smoothness of level influence
const FADE_IN = 0.8;
const FADE_OUT = 0.2;

// Controls spectrum range
const SPEC_MIN = 120;
const SPEC_MAX_FACT = 0.2;

// Controls the spectrum amp
const SPEC_SIDE_FACT = 10;
const SPEC_AMP_FACT = 1;

let specFac;

let animate = function (now) {
    // PRE
    const delta = clock.getDelta();

    spectrum = fft.analyze();

    // Keep buffer from overflowing
    let newLevel = amplitude.getLevel();

    let levelDif = newLevel - level;
    if (levelDif >= 0) {
        level += levelDif * FADE_IN;
    } else {
        level += levelDif * FADE_OUT;
    }

    if (levelSamples.length === SAMPLE_BUFFER) {
        levelSamples.splice(0, 1);
    }
    levelSamples.push(level);

    angleAdd += ANGLE_ROTATION * delta; // For rotation-speed around centre

    // Summon mesh ring all TCOUNT01 seconds*level
    if (tcount01 > TCOUNT01) {
        addObjects(geometry, material, OBJ_NUM, OBJ_AMP, OBJ_OFF);
        tcount01 = 0;
    }

    function normalize() {
        let ratio = NORM_LEVEL / loudest;
        if (ratio < 1) {
            normalisationBoost = ratio * COMP_RATIO;
        } else {
            normalisationBoost = ratio;
        }

        tcount02 = 0;
    }

    if (level > loudest) {
        loudest = level;
        normalize();
    }

    if (level < quietest) {
        quietest = level;
    }

    // Check dynamics and normalize
    if (tcount02 > TCOUNT02) {
        // GET LOUDES VOLUME AND SET NORMALIZATION
        for (let s = 0; s < levelSamples.length; s++) {
            if (levelSamples[s] > loudest) loudest = levelSamples[s];
            if (levelSamples[s] < quietest) quietest = levelSamples[s];
        }
        normalize();
    }

    if (levelSamples.length > MIN_SAMPLES) {
        level *= normalisationBoost;
        let dynamicRange = loudest - quietest;
        let dynamicRatio = 1 / dynamicRange;
        speedRampBias = dynamicRatio * SPEED_RAMP_BIAS2;
        speedRampBias = 1;
    }

    requestAnimationFrame( animate );

    const rotAdd = 0.01;

    // Actions for each mesh
    for (let i = 0; i < objArr.length; i++) {
        let c = objArr[i];
        let phi = c.angle + angleAdd;


        let phiMod = phi % (2 * pi);
        let freq = 0;
        let specMax = spectrum.length * SPEC_MAX_FACT;

        if (phiMod <= pi) {
            freq = map(phiMod, 0, pi, SPEC_MIN, specMax);
        } else {
            freq = map(phiMod, pi, 2*pi, specMax, SPEC_MIN);
        }

        freq = Math.floor(freq);
        specFac = spectrum[freq] / 255.0;

        let a = c.amp + ampAdd + AMP_BIAS * Math.pow(level + AMP_OFF, AMP_EXP) + SPEC_AMP_FACT * specFac;


        c.mesh.rotation.z = -phi;
        c.mesh.rotation.x += rotAdd;
        c.mesh.rotation.y += rotAdd;
        c.mesh.position.x = a * Math.sin(phi);
        c.mesh.position.y = a * Math.cos(phi);
        c.mesh.position.z += delta * SPEED_RAMP_BIAS * Math.pow(level * speedRampBias+SPEED_RAMP_OFF, SPEED_RAMP_EXP);

        let distRat = 1-((camera.position.z - c.mesh.position.z) / (camera.position.z - origin.z));
        c.opacity = asEnvelopeFS(distRat, 0.7, 1, 2);

        c.color[2] = 1-level;
        c.color[0] = level;





        c.color[1] = specFac;
        c.color[0] = 1 - specFac;




        let sideAmp = 1 + Math.pow(level + SIDE_AMP_OFF, SIDE_AMP_EXP) * SIDE_AMP_BIAS + (spectrum[freq] / 255) * SPEC_SIDE_FACT;

        c.mesh.scale.x = sideAmp;
        c.mesh.scale.y = sideAmp;
        c.mesh.scale.z = sideAmp;


        c.mesh.material = new THREE.MeshBasicMaterial( {
            color: new THREE.Color(c.color[0], c.color[1], c.color[2]),
            flatShading: true,
            transparent: true,
            opacity: c.opacity
        } );

        // Delete if far behind camera
        const MAX_DISTANCE_BEHIND_CAMERA = 4;
        if ((c.mesh.position.z - camera.position.z) > MAX_DISTANCE_BEHIND_CAMERA) {
            c.mesh.visible = false;
            objArr.splice(i, 1);
        }
    }

    renderer.render( scene, camera );

    tcount01 += delta * 10 * (level);
    tcount02 += delta;
};
