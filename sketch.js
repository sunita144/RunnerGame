var player,zombie,zombie_image,player_image;
var ground,bg_image,invisible_ground;
var score=0;
var ObstacleGroup, CoinGroup;
var gameState= "PLAY";
var coin_image;
var restart,gameOver;
var restart_image,gameOver_image;
var bgSound, zombieSound, scoreSound, jumpSound;

function preload(){
  zombie_image=loadAnimation("images/zombie1.png","images/zombie2.png","images/zombie3.png","images/zombie4.png");
   player_image=loadAnimation("images/player1_img.png","images/player2_img.png");
  bg_image=loadImage("images/bg.jpg");
  
  obstacle1=loadImage("images/obstacle1.png");
  obstacle2=loadImage("images/obstacle2.png");
  obstacle3=loadImage("images/obstacle3.png");
  obstacle4=loadImage("images/obstacle4.png");
  
  coin_image=loadImage("images/coin.png");
  restart_image=loadImage("images/restart.png");
  gameOver_image=loadImage("images/game-over.png");
  
  zombieSound=loadSound("sounds/zombiegrowl.wav");
  scoreSound=loadSound("sounds/scoreSound.wav");
}

function setup() {

  createCanvas(800, 500);
  ground=createSprite(800,220,800,30);
 
  ground.shapeColor="green"
  ground.x=ground.width/2;
  ground.addImage(bg_image);
  //ground.scale=0.5;
  
  player=createSprite(280,20,20,60);
  player.addAnimation("a",player_image);
  player.scale=0.5;
  player.setCollider("rectangle",0,0,70,120);
  
  zombie=createSprite(150,420,20,100);
  zombie.addAnimation("zom",zombie_image);
  //zombie.debug=true
  
  invisible_ground=createSprite(400,470,800,10);
  invisible_ground.visible=false;
  
  restart=createSprite(400,220,20,20);
  restart.addImage(restart_image);
  restart.scale=0.5;
  gameOver=createSprite(400,150,20,20);
  gameOver.addImage(gameOver_image);
  gameOver.scale=0.7;
  
  ObstacleGroup=new Group();
  CoinGroup=new Group();
}


function draw() {

  if(gameState==="PLAY"){
    
    restart.visible=false;
    gameOver.visible=false;
  
     ground.velocityX = -(4+score/20);
    // infinite scrolling of ground
    if (ground.x < 0){
       ground.x = ground.width/2;
    }

    // jump & gravity for player
    if(keyDown("space") && player.y>=220) {
        player.velocityY = -10;  
     }  
    player.velocityY = player.velocityY + 1;

    if(keyDown("LEFT_ARROW")) {
        player.x-=2;
      }  
     if(keyDown("RIGHT_ARROW")) {
        player.x+=2;
      }
      spawnObstacles();
      spawnCoins();

      if (player.isTouching(ObstacleGroup)){
         zombieSound.play();
         gameState="END";
      }
    
    if(player.isTouching(CoinGroup)){
      score++;  
      scoreSound.play();
      player.velocityY=3;
      CoinGroup.destroyEach();
    }
    
  }else if( gameState==="END"){
          ObstacleGroup.setVelocityXEach(0);
          ObstacleGroup.setLifetimeEach(-1);
          CoinGroup.setVelocityXEach(0);
          CoinGroup.setLifetimeEach(-1);
          ground.velocityX=0;
          player.velocityY=0;
          player.velocityX=0;
          zombie.x=player.x;
          restart.visible=true;
          gameOver.visible=true;
          if(mousePressedOver(restart)){
            reset();
          }
  }
 
  player.collide(invisible_ground);
  zombie.collide(invisible_ground);
  
  drawSprites();
  
  fill("white");
  text("SCORE: "+score,700,100);
}

function spawnObstacles() {
  if (frameCount % 100 === 0){
    var obstacle = createSprite(800,450,10,40);
    var randomObsImg= Math.round(random(1,4));
    switch(randomObsImg){
      case 1: obstacle.addImage(obstacle1);
             break;
      case 2: obstacle.addImage(obstacle2);
             break;
      case 3: obstacle.addImage(obstacle3);
             break;
      case 4: obstacle.addImage(obstacle4);
             break;
    }
    obstacle.scale=0.3;
    obstacle.velocityX = -(4+score/20);
    obstacle.lifetime=200;
    obstacle.setCollider("rectangle",0,0,100,60);
    ObstacleGroup.add(obstacle);
    } 
  }

function spawnCoins() {
  if (frameCount % 200 === 0){
    var coin = createSprite(800,random(70,350),10,40);
    coin.addImage(coin_image);
    coin.scale=0.3;
    coin.velocityX = -4;
    coin.lifetime=200;
    CoinGroup.add(coin);
    } 
  }

function reset(){
    restart.visible=false;
    gameOver.visible=false;
    gameState ="PLAY";
    ObstacleGroup.destroyEach();
    CoinGroup.destroyEach();
    score=0;
    zombie.x=150;
}
