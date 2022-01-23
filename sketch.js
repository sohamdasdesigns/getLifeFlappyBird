// getLife Code

let capture;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;
let stn;
let stroke_new;
   

// Flappy Bird Code

function setup() {
  createCanvas(288, 512);
  
  //getLife Code
  capture = createCapture(VIDEO);
  capture.hide();
    
  //load the PoseNet model
  posenet = ml5.poseNet(capture, modelLOADED);
  //detect pose
  posenet.on('pose', recievedPoses);
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

function draw(){
  
  //getLife Code
  
  if(singlePose) {
         
    //ANGLE MEASUREMENT
                    
    let v0 = createVector(singlePose.rightShoulder.x, singlePose.rightShoulder.y);
    let v1 = createVector(singlePose.leftShoulder.x, singlePose.leftShoulder.x);
    let v2 = createVector(singlePose.rightElbow.x - singlePose.rightShoulder.x, singlePose.rightElbow.y - singlePose.rightShoulder.y);
            
    let angleBetween = v1.angleBetween(v2);
    noStroke();
                    
    stn = Number(degrees(angleBetween).toFixed(0));
    //stroke_new = (stn / (130 - 60)) *100 ;
    
  }
   
  //console.log(stn);  
  
  // Flappy Bird Location
  
//console.log(stn);
bY = 394 - 394 * ((stn -60) / (130 -60)) // (canvas - fg.height) = (512 - 118)
//console.log(bY)
    
  // Flappy Bird Code
  
   drawingContext.drawImage(bg,0,0);
    
     for(var i = 0; i < pipe.length; i++){
        
        constant = pipeNorth.height+gap;
        drawingContext.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
        drawingContext.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
             
        pipe[i].x--;
        
        if( pipe[i].x == 80 ){
            pipe.push({
                x : 512,
                y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
            }); 
        }

        // detect collision | Flappy Bird Code
      
        if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  512 - fg.height){
            location.reload(); // reload the page
        }
        if(pipe[i].x == 5){
            score++;
        }   
    }
  
    //console.log(fg.height);

    drawingContext.drawImage(fg,0, 512 - fg.height);
      
    drawingContext.drawImage(bird,bX,bY);
    
    //bY += gravity;
    
    drawingContext.fillStyle = "#000";
    drawingContext.font = "20px Verdana";
    drawingContext.fillText("Score : "+score,10, 512 -80);
    drawingContext.font = "12px Verdana";
    drawingContext.fillText("Flappy had a lot of vodka.. Flappy cant fly properly.. ",10, 512 -60);
    drawingContext.fillText("Flappy knows 'Drink and Fly' is bad..",10, 512 -45);
    drawingContext.font = "15px Verdana";
    drawingContext.fillText("Move your HAND UP, DOWN and STILL,  ",10, 512 -30);
    drawingContext.font = "12px Verdana";
    drawingContext.fillText("LIKE A BIRD, to guide drunk flappy..",10, 512 -15);
  
    
}

