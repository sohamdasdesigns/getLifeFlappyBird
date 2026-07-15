// getLife Code

let capture;
let posenet;
let trainerCanvas;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;
let stn;
let stroke_new;
   

// Flappy Bird Code

function setup() {
  // Keep the canvas backing store identical to the 288 x 512 game coordinate system.
  // This is required because the game draws directly with drawingContext.
  pixelDensity(1);
  // create a canvas that will be reparented to the trainer wrapper when started
  trainerCanvas = createCanvas(288, 512);
  try{ trainerCanvas.elt.style.display = 'none'; }catch(e){}
  // Do not start camera/plugins here; start on demand via startTrainer()
  window.startTrainer = startTrainer;
  window.stopTrainer = stopTrainer;
}

//getLife Code
function recievedPoses(poses) {
        //console.log(poses);
    
        if(poses.length > 0) {
            singlePose = poses[0].pose;
            //singlePose = singlePose.slice(5)
            skeleton = poses[0].skeleton;
            //console.log(skeleton);
        }
}

function modelLOADED() {
        console.log("model has loaded");
}

//var cvs = document.getElementById("canvas");
//var drawingContext = cvs.getContext("2d");

// load images | Flappy Bird Code

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";


// some variables | Flappy Bird Code

var gap = 85;
var constant;

var bX = 10;
var bY = 0;

//var gravity = 1.5;

var score = 0;
let resetLockFrames = 0;

// audio files | Flappy Bird Code

// var fly = new Audio();
// var scor = new Audio();

// fly.src = "sounds/fly.mp3";
// scor.src = "sounds/score.mp3";

// on key down | Flappy Bird Code

// document.addEventListener("keydown",moveUp);

// function moveUp(){
//     bY -= 25;
    
// }

// pipe coordinates | Flappy Bird Code

var pipe = [];

pipe[0] = {
    x : 288,
    y : 0
};

// draw images | Flappy Bird Code

function resetGame() {
  bX = 10;
  bY = 197;
  score = 0;
  pipe = [{ x: 288, y: 0 }];
  resetLockFrames = 30;
}



function draw(){
  if (resetLockFrames > 0) resetLockFrames--;
  //getLife Code

  if(singlePose) {
    //ANGLE MEASUREMENT
    let v0 = createVector(singlePose.rightShoulder.x, singlePose.rightShoulder.y);
    let v1 = createVector(singlePose.leftShoulder.x, singlePose.leftShoulder.y);
    let v2 = createVector(singlePose.rightElbow.x - singlePose.rightShoulder.x, singlePose.rightElbow.y - singlePose.rightShoulder.y);
    let angleBetween = v1.angleBetween(v2);
    noStroke();
    stn = Number(degrees(angleBetween).toFixed(0));
  }
  
  // Flappy Bird Location
  // scale & center the game into the current canvas size
  const gameW = 288, gameH = 512;
  const s = Math.min(width / gameW, height / gameH);
  const ox = (width - gameW * s) / 2;
  const oy = (height - gameH * s) / 2;

  // compute bird vertical position using stn (guard fallback)
  const stnSafe = (typeof stn === 'number' && !isNaN(stn)) ? Math.max(60, Math.min(130, stn)) : 95;
  bY = 394 - 394 * ((stnSafe - 60) / (130 - 60));

  // draw game using transformed coordinates so original logic remains
  drawingContext.save();
  drawingContext.setTransform(s, 0, 0, s, ox, oy);

  drawingContext.drawImage(bg, 0, 0);
  for (var i = 0; i < pipe.length; i++) {
    constant = pipeNorth.height + gap;
    drawingContext.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    drawingContext.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
    pipe[i].x--;
    if (pipe[i].x == 80) {
      pipe.push({ x: 512, y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height });
    }
    if (resetLockFrames <= 0 && ((bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)) || bY + bird.height >= 512 - fg.height)) {
      resetGame();
    }
    if (pipe[i].x == 5) { score++; }
  }

  drawingContext.drawImage(fg, 0, 512 - fg.height);
  drawingContext.drawImage(bird, bX, bY);

  drawingContext.fillStyle = "#000";
  drawingContext.font = "20px Verdana";
  drawingContext.fillText("Score : " + score, 10, 512 - 80);

  drawingContext.restore();
    // drawingContext.font = "12px Verdana";
    // drawingContext.fillText("Flappy had a lot of vodka.. Flappy cant fly properly.. ",10, 512 -60);
    // drawingContext.fillText("Flappy knows 'Drink and Fly' is bad..",10, 512 -45);
    // drawingContext.font = "15px Verdana";
    // drawingContext.fillText("Move your RIGHT HAND UP, DOWN,  ",10, 512 -30);
    // drawingContext.font = "12px Verdana";
    // drawingContext.fillText("and STILL, LIKE A BIRD, to guide drunk flappy..",10, 512 -15);
  
    
}

// --- start/stop trainer camera helpers ---
function startTrainer(){
  if (capture) return;
  // show and reparent canvas into trainer wrapper
  const root = document.getElementById('trainer-card-wrapper');
  if (root && trainerCanvas) {
    resizeCanvas(288, 512);
    trainerCanvas.parent('trainer-card-wrapper');
    
    
    trainerCanvas.elt.style.display = 'block';
    root.hidden = false;
  } else if (trainerCanvas) {
    try{ trainerCanvas.elt.style.display = 'block'; }catch(e){}
  }

  // start camera and pose
  capture = createCapture(VIDEO, ()=>{});
  capture.size(width, height);
  capture.hide();
  posenet = ml5.poseNet(capture, modelLOADED);
  posenet.on('pose', recievedPoses);
}

function stopTrainer(){
  if (capture){
    try{ const s = capture.elt && capture.elt.srcObject; if (s && s.getTracks) s.getTracks().forEach(t=>t.stop()); }catch(e){}
    try{ capture.remove(); }catch(e){}
    capture = null;
  }
  try{ if (posenet && posenet.net && posenet.net.dispose) posenet.net.dispose(); }catch(e){}
  posenet = null; singlePose=null; skeleton=null;
  // hide canvas
  try{ if (trainerCanvas) trainerCanvas.elt.style.display = 'none'; }catch(e){}
  try{ const root = document.getElementById('trainer-card-wrapper'); if (root) root.hidden = true; }catch(e){}
}

