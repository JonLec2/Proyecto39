var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var paj1, paj2;
var myfont, myfont2
var fondo
var nocheImg
var dia=1;

function preload(){
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");

  trex_collided = loadAnimation("trex_collided.png");

  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  paj1= loadImage("bird1.png")
  paj2= loadImage("bird2.png")
  fondo=loadImage("desierto.png")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");

  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

  myfont=loadFont('9839/zrnic.ttf')
  myfont2=loadFont('10204/Fortnite.ttf')

  nocheImg=loadImage("noche.png")
}

function setup() {
  createCanvas(displayWidth-200, 200);


  var message = "This is a message";
 console.log(message)

 ground = createSprite(400,220,800,20);
  ground.addImage("ground",groundImage);
  ground.scale=0.5

  
  trex = createSprite(0,170,20,50);
  trex.addAnimation("running", trex_running);

  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.09;

  
  

// ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.06;
  
  invisibleGround = createSprite(200,199,800,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  
  score = 0;
  
}

function draw() {
  background(180);
if(dia===1){
  image(fondo, camera.position.x-1900, 0, displayWidth*5, displayHeight*0.7)}

  if(dia===2){
    nocturno();
  }
 
  //displaying score
  fill(0, 128, 128)
  
  textFont(myfont)
  textSize(25)
  text("Score: "+ score, camera.position.x+400,50);
  
  
  if(gameState === PLAY){
trex.velocityX=+(5 + 3* score/100)
camera.position.x=trex.x+380
    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = +(5 + 3* score/100)
   

    invisibleGround.velocityX=+(5 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    

   // if (ground.x < camera.position.x){
     // ground.x = /2;
    //}

    //if (invisibleGround.x < 0){
      //invisibleGround.x = invisibleGround.width/2;
    //}

    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();

    if(score===200){
      dia=2
    }
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
     gameOver.x=camera.position.x
      gameOver.visible = true;
      restart.x=camera.position.x;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      ground.velocityX = 0;
      trex.velocityY = 0
      invisibleGround.velocityX=0;
      trex.velocityX=0
      
     textFont(myfont2)
     textSize(32)
     text("¡Sigue intentandolo!", camera.position.x-120, 70)
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY
  gameOver.visible=false
restart.visible=false
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running",trex_running);
  score=0
}


function spawnObstacles(){
 if (frameCount % 100 === 0){
   var obstacle = createSprite(camera.position.x+500,160,10,40);
  // obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;

      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x+500,120,40,10);
    cloud.y = Math.round(random(80,100));
    cloud.scale = 0.5;

var rand= Math.round(random(1,3));
switch(rand){
  case 1:cloud.addImage(cloudImage)
        break;
  case 2:cloud.addImage(paj1)
  cloud.scale = 0.05;
        break;

  case 3:cloud.addImage(paj2)
  cloud.scale = 0.03;
break;
default:break;
}



   // cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function nocturno(){
  background(0)
  image(nocheImg, camera.position.x-600, 0, displayWidth, displayHeight)


}