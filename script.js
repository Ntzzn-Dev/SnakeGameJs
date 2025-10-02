let panel = document.querySelector('.canva');
let pointsLabel = document.querySelector('.points');
let pointsGameOverLabel = document.querySelector('.pointgo');
let button = document.getElementById("startButton");
let rebutton = document.getElementById("restartButton");
let quitButtons = document.querySelectorAll(".quitButton");
let rangehint = document.getElementById("rangehint");

const slider = document.getElementById("sizeSnake");

button.addEventListener("click", iniciarIntervalo);
rebutton.addEventListener("click", reiniciarIntervalo);

quitButtons.forEach(button => {
  button.addEventListener('click', () => {
    window.electronAPI.closeApp()
  })
})

let posicaoX = 0;
let posicaoY = 0;

let limiteX = window.innerWidth - 100;
let limiteY = window.innerHeight - 100;
let gridValue = 25;

panel.style.width = limiteX + "px";
panel.style.height = limiteY + "px";

let addValue = gridValue;

slider.addEventListener("input", correcaoGrid);
window.addEventListener("resize", correcaoGrid);

let lastCoordHead = ['0px:0px'];
let snakeBody = [];

let actualPoint = null;
let points = 0;
let intervalId = null;

let dir = 1;
let nextDir = 1;

let startHex = '#ffd900';
let endHex = '#66ff00';
let colors = [];

correcaoGrid();

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      if (dir == 2) return;
      nextDir = -2;
      addValue = -gridValue;
      break;
    case 'ArrowDown':
      if (dir == -2) return;
      nextDir = 2;
      addValue = gridValue;
      break;
    case 'ArrowLeft':
      if (dir == 1) return;
      nextDir = -1;
      addValue = -gridValue;
      break;
    case 'ArrowRight':
      if (dir == -1) return;
      nextDir = 1;
      addValue = gridValue;
      break;
    case 'w':
      if (dir == 2) return;
      nextDir = -2;
      addValue = -gridValue;
      break;
    case 's':
      if (dir == -2) return;
      nextDir = 2;
      addValue = gridValue;
      break;
    case 'a':
      if (dir == 1) return;
      nextDir = -1;
      addValue = -gridValue;
      break;
    case 'd':
      if (dir == -1) return;
      nextDir = 1;
      addValue = gridValue;
      break;
    case 'p':
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      addPoint();
      break;
  }
});

function correcaoGrid() {
  rangehint.innerHTML = slider.value;
  gridValue = parseFloat(slider.value);
  addValue = gridValue;

  limiteX = Math.round((window.innerWidth - 100) / gridValue) * gridValue;
  limiteY = Math.round((window.innerHeight - 100) / gridValue) * gridValue;

  panel.style.width = limiteX + "px";
  panel.style.height = limiteY + "px";

  document.documentElement.style.setProperty("--grid-size", gridValue + "px");
}

function reiniciarIntervalo() {
  posicaoX = 0;
  posicaoY = 0;

  addValue = gridValue;

  lastCoordHead = [];
  snakeBody = [];

  actualPoint = null;
  points = 0;
  dir = 1;

  intervalId = null;

  panel.innerHTML = '';
  pointsLabel.innerHTML = "Points: " + points;
  pointsGameOverLabel.innerHTML = "Pontuation: " + points;

  iniciarIntervalo();
}

function addSnakeWidth() {
  let body = document.createElement('div');
  body.classList.add('snakeblk');

  colors = getGradientColors(startHex, endHex, points < 10 ? 10 : points + 1);

  //body.innerHTML = points;

  snakeBody.splice(1, 0, panel.appendChild(body));

  snakeBody[0].style.backgroundColor = colors[0];
  for (let i = 1; i < snakeBody.length; i++) {
    snakeBody[i].style.backgroundColor = colors[snakeBody.length - i];
  }
}

function iniciarIntervalo() {
  button.parentElement.classList.add('hidden');

  slider.disabled = true;

  addSnakeWidth();

  if (intervalId === null) {
    intervalId = setInterval(() => {
      dir = nextDir;
      if (actualPoint == null) {
        do {
          let gridX = Math.floor((limiteX - gridValue) / gridValue);
          posX = Math.floor(Math.random() * gridX) * gridValue;
          let gridY = Math.floor((limiteY - gridValue) / gridValue);
          posY = Math.floor(Math.random() * gridY) * gridValue;
        } while (lastCoordHead.includes(posX + "px:" + posY + "px"));

        posX = Math.floor(posX / gridValue) * gridValue;
        posY = Math.floor(posY / gridValue) * gridValue;

        actualPoint = document.createElement('div');
        actualPoint.classList.add('pointext');
        pointinside = document.createElement('div');
        pointinside.classList.add('point');

        actualPoint.appendChild(pointinside);


        panel.appendChild(actualPoint);

        actualPoint.style.left = posX + "px";
        actualPoint.style.top = posY + "px";
      } else {
        posX = parseFloat(actualPoint.style.left);
        posY = parseFloat(actualPoint.style.top);

        if (posX == posicaoX && posY == posicaoY) {
          animatePoint();
          addPoint();
        }
      }

      if (dir % 2 == 0) {
        if ((posicaoY < limiteY - addValue && posicaoY + addValue >= 0) &&
          !lastCoordHead.slice(1).includes(snakeBody[0].style.left + ":" + (parseInt(snakeBody[0].style.top) + addValue) + "px")
        ) {
          lastCoordHead.push(snakeBody[0].style.left + ":" + snakeBody[0].style.top);
          if (lastCoordHead.length > points + 1) {
            lastCoordHead.shift();
          }

          posicaoY += addValue;
          snakeBody[0].style.top = posicaoY + "px";
        } else {
          gameOver();
        }
      } else {
        if ((posicaoX < limiteX - addValue && posicaoX + addValue >= 0) &&
          !lastCoordHead.slice(1).includes((parseInt(snakeBody[0].style.left) + addValue) + "px" + ":" + snakeBody[0].style.top)
        ) {
          lastCoordHead.push(snakeBody[0].style.left + ":" + snakeBody[0].style.top);
          if (lastCoordHead.length > points + 1) {
            lastCoordHead.shift();
          }

          posicaoX += addValue;
          snakeBody[0].style.left = posicaoX + "px";
        } else {
          gameOver();
        }
      }

      for (let i = 1; i < snakeBody.length; i++) {
        let coord = lastCoordHead[i].split(':');

        snakeBody[i].style.left = coord[0];
        snakeBody[i].style.top = coord[1];
      }
    }, 150);
  }
}

function addPoint() {
  points++;
  pointsLabel.querySelector("span").innerHTML = points;
  pointsGameOverLabel.innerHTML = "Pontuation: " + points;

  addSnakeWidth();
}

function animatePoint() {
  let pointAnm = actualPoint;

  actualPoint = null;

  pointAnm.classList.add("pop");

  pointAnm.addEventListener("animationend", () => {
    panel.removeChild(pointAnm);
  });
}

function gameOver() {
  gameOverModal();
  clearInterval(intervalId);
  slider.disabled = false;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function rgbToHex(r, g, b) {
  const toHex = x => x.toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function getGradientColors(startHex, endHex, steps) {
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  const gradientColors = [];

  for (let i = 0; i < steps; i++) {
    const r = Math.round(start.r + ((end.r - start.r) * (i / (steps - 1))));
    const g = Math.round(start.g + ((end.g - start.g) * (i / (steps - 1))));
    const b = Math.round(start.b + ((end.b - start.b) * (i / (steps - 1))));
    gradientColors.push(rgbToHex(r, g, b));
  }

  return gradientColors;
}
