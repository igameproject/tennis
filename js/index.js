var canvas;
var context;
var ballX = 50; 
var ballY = 50;
var speedX = 10;
var speedY = 5;

var player1Score = 0;
var player2Score = 0;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;
var showingWinScreen =false;


var handleMouseClick = (evt) => {
  if(showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
};
var getMousePos = (evt) =>{
  var rect = canvas.getBoundingClientRect(); //returns the size of an element and its position relative to the viewport.
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {x:mouseX,y:mouseY};
  
} 

window.onload = () => {
  canvas = document.getElementById("pongBoard");
  context = canvas.getContext('2d');
  context.fillStyle = "black";
  context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "white";
  canvas.addEventListener('mousemove',(evt)=>{
      var mousePos = getMousePos(evt);
      paddle1Y = mousePos.y  - PADDLE_HEIGHT/2;
  });
  canvas.addEventListener('mousedown',handleMouseClick);
};
  
var framesPerSecond = 30;
setInterval(() =>{moveEverything();drawEverything();},1000/framesPerSecond);
  


var computerMovement = () => {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
 if(paddle2YCenter < ballY - 35) {
		paddle2Y += 6;
	} else if(paddle2YCenter > ballY + 35) {
		paddle2Y -= 6;
	}
}

var moveEverything = () => {
  if(showingWinScreen){
    return;
  }
  computerMovement();
  ballX += speedX;
  ballY += speedY;
  if(ballX < 10){
    
    if(ballY > paddle1Y  && ballY < paddle1Y + PADDLE_HEIGHT){
      speedX = -speedX;
      var delta = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      speedY = delta * 0.35;}
    else{
      player2Score++;
      ballReset();
    }
    
  }
  if(ballX > canvas.width - 10){
     if(ballY > paddle2Y  && ballY < paddle2Y + PADDLE_HEIGHT){
      speedX = -speedX;
      var delta = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      speedY = delta * 0.35;
    }
    else{
      player1Score++;
      ballReset();
    }
  }
  if(ballY > canvas.height - 10 || ballY < 10){
    speedY = -speedY;
  }
}

var drawNet = () => {
	for(var i=0;i<canvas.height;i+=40) {
		colorRect('white',canvas.width/2-1,i,2,20);
	}
}

var drawEverything = () => {
  //background
  colorRect("black",0,0,canvas.width,canvas.height);
  
  if(showingWinScreen) {
		context.fillStyle = 'white';

		if(player1Score >= WINNING_SCORE) {
			context.fillText("Player Wins", 320, 200);
		} else if(player2Score >= WINNING_SCORE) {
			context.fillText("Computer Wins", 310, 200);
		}

		context.fillText("Click to Continue", 300, 500);
		return;
	}
  
  //paddle 1-Player
  colorRect("white",0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT);
  //paddle 2-Computer
  colorRect("white",canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT);
  //ball
  drawNet();
  
  
  
  colorCircle("white",ballX,ballY,10);
  context.font="30px Arial";
  context.fillText(player1Score,100,100);
  context.fillText(player2Score,canvas.width-100,100);
}

//Resets the Scene if anyone wins.
var ballReset = () => {
  if(player1Score >=  WINNING_SCORE  || player2Score >= WINNING_SCORE){
    
    showingWinScreen = true;
    
  }
  speedX = -speedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

//Creates a rectangle from given parameters.
var colorRect = (color,leftX,topY,width,height) => {
  context.fillStyle = color;
  context.fillRect(leftX,topY,width,height)
}

//Creates a circle from given parameters.
var colorCircle = (color,centerX,centerY,radius) => {
  context.fillStyle = color;   
  context.beginPath();
  context.arc(centerX,centerY,radius,0,Math.PI*2);
  context.fill();
}