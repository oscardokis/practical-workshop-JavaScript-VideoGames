const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('resize', setCanvasSize);
window.addEventListener('load', setCanvasSize);
let canvasSize;
let elementsSize;
function startGame() {
  
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[2];
  const mapRows = map.trim().split('\n');
  const mapRowsCol = mapRows.map(row => row.trim().split(""));
  for(let row = 1; row <= 10; row++){
    for(let col = 1; col <= 10; col++){
      game.fillText(emojis[mapRowsCol[row - 1][col - 1]], elementsSize * col + 10, elementsSize * row - 9);
      
    }
  }

  /* game.fillRect(0, 50, 100, 100); */
  /* game.clearRect(50,50,50,50); */
/*   game.font = "25px Verdana";
  game.fillStyle = "purple";
  game.textAlign = 'start';
  game.fillText("whats Up", 25, 25); */
}
function setCanvasSize(){
  
  if(window.innerHeight > window.innerWidth){
    canvasSize = window.innerWidth * 0.75;
  }else{
    canvasSize = window.innerHeight * 0.75;
  }
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = (canvasSize / 10);
  startGame();
}