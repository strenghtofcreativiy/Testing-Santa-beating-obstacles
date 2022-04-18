
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;
var score = 0;
var lives = 3;


var backgroundImg;
var gameOverImg;
var chimney, chimneysGroup;
var ornaments, ornamentsGroup;
var santa;
var restart_btn;

function preload(){
  backgroundImg = loadImage("./assets/background.png");
  
  chimney = loadImage("./assets/obstacles1.png");
  ornaments = loadImage("./assets/obstacle2.png");
  santa = loadImage("./assets/santa.png");

  gameOverImg = loadImage("./assets/game_over.png");
 // restart_btn = loadImage("./assets/restart.png");
}



function setup() {
  createCanvas(windowWidth,windowHeight);

  // creating chimney
  chimney = createSprite(600,height-595,20,30);
  chimney.addImage("chimney", chimney);
  chimney.scale = 0.5;

  // creating ornaments
  ornaments = createSprite(550,10,20,30);
  ornaments.addImage("ornaments", ornaments);
  ornaments.scale = 0.5;

  //creating santa
  santa = createSprite(50,height/2,20,50);
  santa.addImage("santa", santa);
  santa.scale = 0.5;

  // restart button
  restart_btn = createImg('./assets/restart.png');
  restart_btn.position(width-50,20);
  restart_btn.size(50,50);
  restart_btn.mouseClicked(reset);
  restart_btn.visible = false;

  // game over icon
  gameOverImg.addImage("gameOverImg", gameOverImg);
  gameOverImg.position(width-70,20);
  gameOverImg.scale = 0.05;
  gameOverImg.visible = false;

  // creating groups
  chimneysGroup = new Group();
  ornamentsGroup = new Group();

    score = 0;

  engine = Engine.create();
  world = engine.world;
  
}


function draw() 
{
  //background
  background(51);
  image(bg_img,0,0,width,height);

  // score display
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);

  // gamestate play

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length > 0 || keyDown("SPACE")) && santa.y  >= height-120) {
      jumpSound.play();
      santa.velocityY = -10;
       touches = [];
    }
    
    santa.velocityY = santa.velocityY + 0.8;
  
    if (bg_img.x < 0){
      bg_img.x = bg_img.width/2;
    }
  
    spawnChimneys();
    spawnOrnaments();
  
    if(chimneysGroup.isTouching(santa)){
        collidedSound.play()
        gameState = END;
    }
  }
  // gamestate end
  else if (gameState === END) {
    gameOverImg.visible = true;
    restart_btn.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    santa.velocityY = 0;
    chimneysGroup.setVelocityXEach(0);
    ornamentsGroup.setVelocityXEach(0);
    
    //change the trex animation
    //trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    chimneysGroup.setLifetimeEach(-1);
    ornamentsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)) {      
      reset(); 
      touches = []
    }
  }
  Engine.update(engine);
  
   drawSprites();

}

// spawning chimneys
function spawnChimneys () {
  if(frameCount % 70 === 0) {
    var chimney = createSprite(600,height-500,20,30);
    chimney.setCollider('circle',0,0,45)
    // ornament.debug = true
  
    chimney.velocityX = -(6 + 3*score/100);
    }
    
    //assign scale and lifetime to the ornaments           
    chimney.scale = 0.3;
    chimney.lifetime = 400;
    chimney.depth = santa.depth;
    santa.depth +=1;
    //add each ornament to the group
    chimneysGroup.add(chimney);
}

// spawning ornaments
function spawnOrnaments () {
  if(frameCount % 60 === 0) {
    var ornament = createSprite(600,height-95,20,30);
    ornament.setCollider('circle',0,0,45)
    // ornament.debug = true
  
    ornament.velocityX = -(6 + 3*score/100);
    }
    
    //assign scale and lifetime to the ornaments           
    ornaments.scale = 0.3;
    ornamnets.lifetime = 400;
    ornaments.depth = santa.depth;
    santa.depth +=1;
    //add each ornament to the group
    ornamentsGroup.add(ornaments);
}

// reset function 
function reset () {
  gameState = PLAY;
  gameOverImg.visible = false;
  restart_btn.visible = false;
  
  chimneysGroup.destroyEach();
  ornamentsGroup.destroyEach();
  
//  santa.changeAnimation();
  
  score = 0;
}