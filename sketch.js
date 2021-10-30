var score;

var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var trex, trex_running, edges;
var groundImage, invisGround;
var cloud, cloudImage, cloudGroup;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var collidedTrex;

var restartImg, restart;
var GameOverImg, GameOver;

var jumpSound, dieSound, milestoneSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png")

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  collidedTrex = loadImage("trex_collided.png");

  restartImg = loadImage("restart.png");
  GameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  milestoneSound = loadSound("checkpoint.mp3")

}

function setup() {
  createCanvas(windowWidth,windowHeight);

  score = 0;

  // creating trex
  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", collidedTrex)

  //adding scale and position to trex
  trex.scale = 1;
  trex.x = 50

    //creating invisible ground
    invisGround = createSprite(width/2,height-10,width,125);
    invisGround.visible = false;
  
  //creating ground now
  ground = createSprite(width/2, height-10, width, 70)
  ground.addImage("ground", groundImage);
  ground.x=width/2

  obstaclesGroup = createGroup();
  cloudGroup = createGroup();

  restart = createSprite(width/2, height/2, 50, 50);
  restart.addImage(restartImg);
  restart.scale = 0.5

  GameOver = createSprite(width/2, height/2-50, 50, 50);
  GameOver.addImage(GameOverImg);
  GameOver.scale = 0.5


}


function draw() {
  //set background color 
  background("white");

  //logging the y position of the trex
  console.log(trex.y)

  if (score > 0 && score % 300 === 0) {
    milestoneSound.play();
  }

  //to view trex collision
  /*trex.debug=true;
  trex.setCollider("circle",0,0,40)*/

  if (gamestate === PLAY) {
    //ground movement now
    
    console.log(ground.x);

   ground.velocityX = -(6 + 3*score/100);

    //visibility of game over and restart is false
    GameOver.visible = false;
    restart.visible = false;

    //score
    score = score + Math.round(getFrameRate()/60);

    //resetting ground after its over
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when space key is pressed
    if (keyDown("space") && trex.y >= height-140) {
      trex.velocityY = -10;
      jumpSound.play();
    }

    //to make trex come down after a jump
    trex.velocityY = trex.velocityY + 0.5;

    cloudSpawn();

    obstacleSpawn();
  }

  else if (gamestate === END) {

    //ground stopping now
    ground.velocityX = 0;

    cloudGroup.setVelocityXEach(0);

    obstaclesGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);

    cloudGroup.setLifetimeEach(-1);

    trex.changeAnimation("collided", collidedTrex);

    trex.velocityY = 0;

    GameOver.visible = true;
    restart.visible = true;

    
  //making game restart if restart button clicked
  if (mousePressedOver(restart)){
    console.log("restart button clicked")
  
   reset();

  }

  }

  text("Score: " + score, 50, 25);

  //stop trex from falling down
  trex.collide(invisGround);

  if (obstaclesGroup.isTouching(trex)) {
    gamestate = END;

    //dieSound.play

  }

  drawSprites();
}

function reset(){
  gamestate = PLAY;

  obstaclesGroup.destroyEach();
  cloudGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  
  GameOver.visible=false;
  restart.visible=false;

  score=0;
}

function cloudSpawn() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20, height-300, 50, 50);
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;

    cloud.y = Math.round(random(50, 125));

    //set life of cloud
    cloud.lifetime = 300;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudGroup.add(cloud);

  }
}

function obstacleSpawn() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(width-10, height-95, 50, 50)
    obstacle.scale = 1
    obstacle.velocityX = -10

    obstacle.lifetime = 300

    var rand = Math.round(random(1, 6));
    switch (rand) {

      case 1: obstacle.addImage(obstacle1);
        break;

      case 2: obstacle.addImage(obstacle2);
        break;

      case 3: obstacle.addImage(obstacle3);
        break;

      case 4: obstacle.addImage(obstacle4);
        break;

      case 5: obstacle.addImage(obstacle5);
        break;

      case 6: obstacle.addImage(obstacle6);
        break;

      default:
        break;
    }
    obstaclesGroup.add(obstacle);
  }
}