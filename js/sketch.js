let model_d20;
let sphere;
let model_wall;
let texture_1;
let texture_2;
let velocity;

let G;
let retardation_factor;

let scale_model;

let rotationX;
let rotationY;

let font;

let GaussianX ;
let GaussianY ;
let GaussianZ ;

let boundingSphere;

let cameraX;
let cameraY;

let lerp;

let cameraMoveToX;
let cameraMoveToY;
let cameraMoveToZ;

let startCamX;
let startCamY;

let orientation;

function preload() {
  model_d20 = loadModel('/obj/D20.obj');
  //model_wall = loadModel('/obj/cube.obj');
  sphere = loadModel('/obj/sphere.obj');
  font = loadFont('Roboto-Thin.ttf');
  texture_1 = loadImage('/image/StormWatchInn.jpg');
  texture_2 = loadImage('/image/Large city 2018-06-27T00_50_48.562Z.png');
}

function setup() {
  createCanvas(window.innerWidth* 0.99, window.innerHeight*0.98 , WEBGL);
  console.log("Dimensions are " + window.innerHeight + "," + window.innerWidth);
  // Constants
  {
  G = 9.8;
  retardation_factor = 0.95;
  GaussianX = 20;
  GaussianY = 20;
  GaussianZ = 10;
  }
  // Variables 
  {
    velocity = new Speed(retardation_factor, randomGaussian(0, GaussianX), randomGaussian(0, GaussianY), randomGaussian(0, GaussianZ), 0, 0);
    cameraX = 0;
    cameraY = 0;
    scale_model = 35;
    rotationX = 0;
    rotationY = 0;
    boundingSphere = new Sphere(0, 0, 0, 1);
    lerp = 1;
    maxDist = (Math.sqrt(Math.pow(height / 2, 2) + Math.pow(width / 2, 2)) / scale);
    cameraMoveToX = 0;
    cameraMoveToY = 0;
    cameraMoveToZ = 0;  
  }
  //noStroke();
}

function draw() {
  // Define starting conditions for each draw loop
  { 
  angleMode(RADIANS);
  background(225);
  ambientLight(200);
  textFont(font);
  textSize(40);
  }

  // Moving camera Maybe ?
  {
  moveCamera(velocity.x_pos, velocity.y_pos);
  //camera(cameraX,cameraY, height, velocity.x_pos, velocity.y_pos, velocity.z_pos, 0, 1, 0);//10*velocity.x_pos,10*velocity.y_pos,10*velocity.z_pos+
  camera(cameraX, cameraY, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
  }

  // Any text on display
  {
  //text("CamDist : " + (Math.sqrt(Math.pow((velocity.x_pos - cameraX), 2) + Math.pow((velocity.y_pos - cameraY), 2))) + "\n Scale : " + scale_model + "\n(" + velocity.x_speed + "\n" + velocity.y_speed + "\n" + velocity.z_speed + ")", 200, -300);
  }

  // Draw any models here
  push();
    texture(texture_1);
    angleMode(DEGREES);
    rotateY(90);
    translate(0,-width/3);
    plane(height/2, height/2);
  pop();
  push();
    texture(texture_2);
    angleMode(DEGREES);
    rotateY(180);
    translate(0,width/3);
    plane(height/2, height/2);
  pop();
  push();
  {
    translate(10 * velocity.x_pos, 10 * velocity.y_pos, 10 * velocity.z_pos);
    //texture(image);
    push();
    rotateX(rotationX);
    rotateY(rotationY);
    scale(scale_model);
    velocity.move();
    model(model_d20);
    pop();
  }
  pop();
}

function moveCamera(x, y) {
  if (lerp < 1) {
    cameraX += (cameraMoveToX - startCamX) * 0.1;
    cameraY += (cameraMoveToY - startCameY) * 0.1;
    lerp += 0.1;
  }
  else if (Math.sqrt(Math.pow((x - cameraX), 2) + Math.pow((x - cameraY), 2)) > maxDist) {
    console.log("Moving camera");
    lerp = 0;
    startCamX = cameraX;
    startCamY = cameraY;
    cameraMoveToX = x;
    cameraMoveToY = y;
  }
}

function mouseClicked() {
  if (mouseX < 100) {
    scale_model = ((height - mouseY) / height * 10);
    scale_model *= scale_model;
    scale_model += 35;
  }
}

function mouseDragged() {
  rotationX += ((mouseY - pmouseY) / height) * 4;
  rotationY += ((mouseX - pmouseX) / width) * 4;
}

function deviceShaken(){
  //text("Accelerometer exists",0,0);
  scale_model = Math.random() * 1000 + 35
}

function deviceTurned(){
  scale_model = Math.random() * 20000
}

class Sphere {
  constructor(x = 0, y = 0, z = 0, rad = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rad = rad;
  }
}

class Cuboid {
  constructor(x = 0, y = 0, z = 0, thickness_x = 0.5, thickness_y = 0.5, thickness_z = 0.5) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.thickness_x = thickness_x;
    this.thickness_y = thickness_y;
    this.thickness_z = thickness_z;
  }
}

class Speed {
  constructor(retardation = 1, x_speed = 0, y_speed = 0, z_speed = 0, x_pos = 0, y_pos = 0, frameRate = 60) {
    this.x_speed = x_speed;
    this.y_speed = y_speed;
    this.z_speed = z_speed;
    this.x_pos = x_pos;
    this.y_pos = y_pos;
    this.z_pos = 0;
    this.r = retardation;
    this.frametime = 1 / frameRate;
    this.net_speed = 0;
  }

  reduce_Speed() {
    this.net_speed = 0;
    this.x_speed *= this.r;

    this.y_speed *= this.r;

    this.z_speed = this.z_pos > 0 ? this.z_speed* 0.95 - 9.8 * this.frametime : -this.z_speed * 0.95;

    this.net_speed += (Math.abs(this.x_speed) + Math.abs(this.y_speed) + Math.abs(this.z_speed));
    if (this.net_speed < 0.15) {
      this.resetSpeed();
    }

  }

  move() {
    this.x_pos += this.frametime * this.x_speed;
    this.y_pos += this.frametime * this.y_speed;
    this.z_pos += this.frametime * this.z_speed - 0.5 * this.frametime * this.frametime * G;
    this.z_pos = this.z_pos < 0 ? 0 : this.z_pos;
    this.reduce_Speed();
  }

  resetSpeed() {
    this.x_speed = Math.sign(randomGaussian(0, 1)) * (Math.random() * (GaussianX - 1) + 1);
    this.y_speed = Math.sign(randomGaussian(0, 1)) * (Math.random() * (GaussianY - 1) + 1);
    this.z_speed = Math.sign(randomGaussian(0, 1)) * (Math.random() * (GaussianZ - 1) + 1);
    console.log("Speed set to " + this.x_speed + ";" + this.y_speed + ";" + this.z_speed);
  }
}