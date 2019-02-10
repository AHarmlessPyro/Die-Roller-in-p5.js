let model_d20;
let sphere;
let model_wall;
let image;
let velocity;

let scale_model;

let rotationX;
let rotationY;

let retardation_factor;

let font;

let GaussianX = 20;
let GaussianY = 20;
let GaussianZ = 10;

let boundingSphere;

let cameraX;
let cameraY;

let lerp;

let G;

let cameraMoveToX;
let cameraMoveToY;
let cameraMoveToZ;

let startCamX;
let startCamY;

function preload(){
  model_d20 = loadModel('/obj/D20.obj');
  //model_wall = loadModel('/obj/cube.obj');
  sphere = loadModel('/obj/sphere.obj');
  font = loadFont('Roboto-Thin.ttf');
  image = loadImage('StormWatchInn.jpg');
}

function setup() {
  createCanvas(window.innerWidth , window.innerHeight,WEBGL); 
  console.log("Dimensions are " + screen.width*window.devicePixelRatio+ "," + screen.height*window.devicePixelRatio);
  cameraX = 0;
  cameraY = 0;
  G = 9.8;
  retardation_factor = 0.95;
  velocity = new Speed(retardation_factor,randomGaussian(0,GaussianX),randomGaussian(0,GaussianY),randomGaussian(0,GaussianZ),0,0);
  scale_model = 35;
  rotationX = 0;
  rotationY = 0;
  noStroke();
  boundingSphere = new Sphere(0,0,0,1);
  lerp = 1;
  maxDist = Math.sqrt(Math.pow(height/2,2) + Math.pow(width/2,2));
  cameraMoveToX = 0;
  cameraMoveToY = 0;
  cameraMoveToZ = 0;
}

function draw() {
  background(225);   
  ambientLight(200);
  textFont(font);
  textSize(40);
  moveCamera(velocity.x_pos,velocity.y_pos);
  camera(cameraX,cameraY,500+10*velocity.z_pos,0,0,0,0,1,0);//10*velocity.x_pos,10*velocity.y_pos,10*velocity.z_pos+
  text("X : " + cameraX + "\n Y :" +cameraY + "\n Z : " + scale_model + "\n(" + velocity.x_pos+"\n"+velocity.y_pos+"\n"+velocity.z_pos+")",200,-300);       
  push();   
    {   
    translate(10*velocity.x_pos,10*velocity.y_pos,10*velocity.z_pos);        
    texture(image);    
    push();
      rotateX(rotationX);
      rotateY(rotationY);      
      scale(scale_model);
      velocity.move();      
      model(model_d20);    
    pop();
    /*
    push();
      //translate(10*)
      scale(scale_model/85.5);
      //model(sphere);
    pop();
    */
    }
  pop();  
  // perform 
}

function moveCamera(x,y){
  if (lerp <1){
    cameraX += (cameraMoveToX - startCamX)*0.1;
    cameraY += (cameraMoveToY - startCameY)*0.1;
    lerp+=0.1;
  }
  else if(Math.sqrt(Math.pow((x-cameraX),2)+Math.pow((x-cameraY),2))>maxDist){
    lerp = 0;
    startCamX = cameraX;
    startCamY = cameraY;
    cameraMoveToX = x;
    cameraMoveToY = y;
  }

}

function mouseClicked(){
  if(mouseX<100){
    scale_model = ((height-mouseY)/height * 10);
    scale_model *= scale_model;
    scale_model+=35;
  }
}

function mouseMoved(){
  rotationX += ((mouseY-pmouseY)/height)*4;
  rotationY += ((mouseX-pmouseX)/width)*4;
}

class Sphere {
  constructor(x = 0,y = 0,z = 0,rad = 1){
    this.x = x;
    this.y = y;
    this.z = z;
    this.rad = rad;
  }
}

class Cuboid{
  constructor(x = 0,y = 0,z = 0,thickness_x = 0.5,thickness_y = 0.5,thickness_z = 0.5){
    this.x = x;
    this.y = y;
    this.z = z;
    this.thickness_x = thickness_x;
    this.thickness_y = thickness_y;
    this.thickness_z = thickness_z;
  }
}


class Speed{
  constructor(retardation = 1,x_speed = 0,y_speed = 0,z_speed = 0, x_pos = 0,y_pos = 0,frameRate = 60){
    this.x_speed = x_speed;
    this.y_speed = y_speed;
    this.z_speed = z_speed;
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.z_pos = 0;
    this.r = retardation;
    this.frametime = 1/frameRate;
    this.net_speed = 0;
  }
  
  reduce_Speed(){
    this.net_speed = 0;
    this.x_speed*=this.r;
    
    this.y_speed*=this.r;

    this.z_speed*=this.r;

    this.net_speed += (Math.abs(this.x_speed) + Math.abs(this.y_speed) + Math.abs(this.z_speed));
    if(this.net_speed < 0.15){
      this.resetSpeed();
    }

  }

  move(){
    this.x_pos += this.frametime*this.x_speed;
    this.y_pos += this.frametime*this.y_speed;
    this.z_pos += this.frametime*this.y_speed  - 0.5*this.frametime*this.frametime*G;
    this.z_pos = this.z_pos<0?0:this.z_pos;    
    this.reduce_Speed();
  }

  resetSpeed(){
    console.log("Speed set to " +this.x_speed +";" +this.y_speed + ";"+this.z_speed);
    this.x_speed = randomGaussian(0,GaussianX);
    this.y_speed = randomGaussian(0,GaussianY);
    this.z_speed = randomGaussian(0,GaussianZ);
  }
}