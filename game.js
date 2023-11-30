const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const buttonUp = document.querySelector('#up');
const buttonDown = document.querySelector('#down');
const buttonRight = document.querySelector('#right');
const buttonLeft = document.querySelector('#left');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const highScore = document.querySelector('#Score');
const buttonRestart = document.querySelector('#button-restart');


window.addEventListener('resize', setCanvasSize);
window.addEventListener('load', setCanvasSize);

const playerPosition = {
  x: undefined,
  y: undefined
}

const giftPosition = {
  x: undefined,
  y: undefined,
}
let lives = 3;
let bombPosition = [];
let level = 0;

let timeStart;
let timePlayer;


window.addEventListener('keydown', moveByKeys);
buttonUp.addEventListener('click', moveUp);
buttonDown.addEventListener('click', moveDown);
buttonRight.addEventListener('click', moveRight);
buttonLeft.addEventListener('click', moveLeft);
buttonRestart.addEventListener('click', restart);
let canvasSize;
let elementsSize;
function startGame() {
  showLives();
  game.font = (elementsSize) + 'px serif';
  game.textAlign = "center";
  game.textBaseline = 'middle';
  const map = maps[level];
  if(!map){
    return gameOver();
  }

  if(!timeStart){
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 1000);
    showRecord();
  }

  const mapRows = map.trim().split('\n');
  const mapRowsCol = mapRows.map(row => row.trim().split(""));
  game.clearRect(0, 0, canvasSize, canvasSize);

  bombPosition = [];

  mapRowsCol.forEach((row, indexRow) => {
    row.forEach((col, indexCol) =>{ 
      const emoji = emojis[col];
      const posX = elementsSize * (indexCol + 1/2);
      const posY = elementsSize * (indexRow + 1/2);

      if(col == 'O') {
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      }else if(col == 'I'){
        giftPosition.x = posX;
        giftPosition.y = posY;
      }else if(col == 'X'){
        bombPosition.push([posX.toFixed(1), posY.toFixed(1)]);
      }
      game.fillText(emoji, posX, posY)});
  });
  movePlayer();
/*   for(let row = 1; row <= 10; row++){
    for(let col = 1; col <= 10; col++){
      game.fillText(emojis[mapRowsCol[row - 1][col - 1]], elementsSize * col + 10, elementsSize * row - 9);
    }
  } */

  /* game.fillRect(0, 50, 100, 100); */
  /* game.clearRect(50,50,50,50); */
/*   game.font = "25px Verdana";
  game.fillStyle = "purple";
  game.textAlign = '';
  console.log(elementsSize);
  game.fillText("whats Up", elementsSize*0, elementsSize); */
}
function setCanvasSize(){
  
  if(window.innerHeight > window.innerWidth){
    canvasSize = (window.innerWidth * 0.70);
  }else{
    canvasSize = (window.innerHeight * 0.70);
  }
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  elementsSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function moveByKeys(event) {
  if(event.key == 'ArrowUp') moveUp();
  else if(event.key == 'ArrowDown') moveDown();
  else if(event.key == 'ArrowRight') moveRight();
  else if(event.key == 'ArrowLeft') moveLeft();
}
function movePlayer(){
  const giftCollisionX = playerPosition.x.toFixed(1) == giftPosition.x.toFixed(1);
  const giftCollisionY = playerPosition.y.toFixed(1) == giftPosition.y.toFixed(1);
  const giftCollision = giftCollisionX && giftCollisionY;
  let bombCollision = false;
  bombPosition.forEach(bombPos => {
    if(bombPos[0] === playerPosition.x.toFixed(1) && bombPos[1] === playerPosition.y.toFixed(1)){
      bombCollision = true;
    }
  });

  if(giftCollision){
    levelWin();
  }else if(bombCollision){
    console.log("PERDISTE TU PUEDES VOLVER CAMPEON");
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function gameOver(){
  console.log('Terminaste el juego');
  clearInterval(timeInterval);


  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  if(recordTime){
    if(recordTime >= playerTime){
      localStorage.setItem('record_time', playerTime);
      console.log("SUPERASTE EL RECORD");
    }else {
      console.log("Lo siento no superaste el record")
    }
  }else{
    localStorage.setItem('record_time', playerTime);
  }
  console.log({recordTime, playerTime});
}
function levelFail(){
  lives--;
  if(lives <= 0){
    level = 0;
    lives = 3;
    timeStart = undefined;
  }


  console.log("Estas son mis vidas: " + lives , "nivel " + level);
  playerPosition.y = undefined;
  playerPosition.x = undefined;
  startGame();
}
function levelWin(){
  playerPosition.y = undefined;
  playerPosition.x = undefined;
  console.log('Subiste de nivel');
  level++;
  startGame();
}
function showRecord(){
  highScore.innerHTML = localStorage.getItem('record_time');
}
function showTime(){
  spanTime.innerHTML = `${Math.round((Date.now() - timeStart)/1000)} [s]`;
}
function showLives(){
  spanLives.innerHTML = Array(lives).fill(emojis['HEART']).join('');
}
function moveUp(){
  playerPosition.y -= elementsSize;
  if(playerPosition.y < 0) playerPosition.y += elementsSize;
  startGame();
}
function moveDown(){
  playerPosition.y += elementsSize;
  if(playerPosition.y > canvasSize) playerPosition.y -= elementsSize;
  startGame();
}
function moveRight(){
  playerPosition.x += elementsSize;
  if(playerPosition.x > canvasSize) playerPosition.x -= elementsSize;
  startGame();
}
function moveLeft(){
  playerPosition.x -= elementsSize;
  if(playerPosition.x < 0) playerPosition.x += elementsSize;
  startGame();
}
function restart(){
  clearInterval(timeInterval);
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  level = 0;
  lives = 3;
  giftPosition.x = undefined;
  giftPosition.y = undefined;
  timeStart = undefined;
  startGame();
}