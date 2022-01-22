

let capture;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,skeleton;

let stroke_new;

function setup() {  // this function runs only once while running
    createCanvas(512, 288);
    
    //console.log("setup funct");
    capture = createCapture(VIDEO);
    capture.hide();

    //load the PoseNet model
    posenet = ml5.poseNet(capture, modelLOADED);
    //detect pose
    posenet.on('pose', recievedPoses);
}

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

/*
function getRandomArbitrary(min, max) { // generate random num
    return Math.random() * (max - min) + min;
}
*/

function draw() { // this function code runs in infinite loop
    
    // images and video(webcam)
    //image(capture, 0, 0);
    

    
    if(singlePose) {
        

        //ANGLE MEASUREMENT
                
        let v0 = createVector(singlePose.rightShoulder.x, singlePose.rightShoulder.y);
        let v1 = createVector(singlePose.leftShoulder.x, singlePose.leftShoulder.x);
        let v2 = createVector(singlePose.rightElbow.x - singlePose.rightShoulder.x, singlePose.rightElbow.y - singlePose.rightShoulder.y);
        

        let angleBetween = v1.angleBetween(v2);
        noStroke();
        
        //console.log(degrees(angleBetween).toFixed(0));
                
        let stn = Number(degrees(angleBetween).toFixed(0));
        stroke_new = stn / 10;
        
        // END ANGLE MEASUREMENT


        for(let i=0; i<singlePose.keypoints.length; i++) {
            //console.log(singlePose);
            fill(0, 255, 0);
            
            //if (singlePose.nose || singlePose.)
            ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 10);
        }

        
        strokeWeight(2);

        for(let j=0; j<skeleton.length; j++) {
            
            
            stroke(0, 255, 0);
            if (stn > 130) {
                stroke(0, 255, 0);
                strokeWeight(stroke_new);
            };
            line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);

            

            if (skeleton[j][1].part  == 'rightShoulder') {
                stroke(255, 255, 0);
                strokeWeight(stroke_new);

                if (stn > 130) {
                    stroke(0, 255, 0);
                };
                line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);   
            }


        }
        

                
        //line(singlePose.leftShoulder.x, singlePose.leftShoulder.y, singlePose.rightShoulder.x, singlePose.rightShoulder.y)

        //for Arrows & markerssinglePose.nose.x
        //image(specs, singlePose.nose.x-40, singlePose.nose.y-70, 125, 125);

        //for measurement

        //Angle side bar
        stroke(255, 215, 20);
        if (stn > 130) {
            stroke(0, 255, 0);
        };
        strokeWeight(30);
        line( 30, 480, 30, 480 - stn * 2);

        //Big Circle
        stroke(255, 255, 255);
        strokeWeight(30);
        ellipse(30, 205, 8, 8)
        stroke(0, 255, 20);
        strokeWeight(15);
        ellipse(30, 205, 4, 4);
        
        //Big Circle
        stroke(255, 255, 255);
        strokeWeight(30);
        ellipse(30, 480 - 15 - stn * 2, 8, 8)

        //Inner Circle Yellow
        stroke(255, 215, 20);
        strokeWeight(15);
        ellipse(30, 480 - 15 - stn * 2, 4, 4);

        if (stn > 130) {
            //Inner circle Green
            stroke(0, 255, 0);
            strokeWeight(15);
            ellipse(30, 480 - 15 - stn * 2, 4, 4);
        };


    }
    
}

