const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const start = document.getElementById('start');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;
let highscore = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

// Create Ball Props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4, 
  dx: 4,
  dy: -4
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

// Ball on canvas
function drawBall(){
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = '#fd3a69';
  ctx.fill();
  ctx.closePath();
}

// Paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = '#fd3a69';
  ctx.fill();
  ctx.closePath();
}

// Brick Props
const brickInfo = {
  w: 70,
  h: 20, 
  padding: 10, 
  offsetX: 45,
  offsetY: 60,
  visible: true
}

// Bricks
const bricks = [];
for(let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for(let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo }
  }
}

// Bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#120078' : 'transparent';
      ctx.fill();
      ctx.closePath();
    })
  })
}


// Score on canvas
function drawScore() {
  ctx.font = '20px monospace';
  ctx.fillText(`score: ${score}`, canvas.width - 110, 30);
}

// Highscore on canvas
function drawHighScore() {
  ctx.font = '20px monospace';
  ctx.fillText(`Highscore: ${highscore}`, canvas.width - 780, 30);
}


// Move paddle on canvas
function movePaddle(){
  paddle.x += paddle.dx;

  // Wall detection
  if(paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if(paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move Ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (x) - Right / Left
  if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  } 

  // Wall collision (Y) - Top / Bottom
  if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // Paddle Collision
  if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y) {
    ball.dy = -ball.speed;
  }

  // Brick Collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if(brick.visible) {
        if(ball.x - ball.size > brick.x &&  // Left brick side check
          ball.x + ball.size < brick.x + brick.w &&  // right brick side
          ball.y + ball.size > brick.y && // Top brick side check
          ball.y - ball.size < brick.y + brick.h // Bottom brick side check 
        ){ 
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    })
  });

  // Hit bottom wall - lose
  if(ball.y + ball.size > canvas.height) {
    localStorage.setItem('highscore', score)
    localStorage.setItem('currentHighScore', highscore)
    showAllBricks();
    score = 0;

    if (localStorage.getItem('highscore') >= highscore) {
      highscore = localStorage.getItem('highscore')
    } else {
      highscore = localStorage.getItem('currentHighScore')
    }
  }
} 

// Increase Score
function increaseScore() {
  score++;

  if(score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// Show All bricks
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
        brick.visible = true;
    })
  });
}

// Draw Everything
function draw() {
  // Clear canvas
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawHighScore();
  drawBricks();
 }
 
// Update Canvas drawing and animation
function update() {
  movePaddle();
  moveBall();
  // Draw everything
  draw();

  requestAnimationFrame(update);
}

// Start game
start.addEventListener('click', () => {
  const startDiv = start.parentElement;
  
  start.classList.add('hidden');
  startDiv.classList.add('hidden');

  setTimeout(() => {
   update();
  }, 500)
});


// Keydown Event
function keyDown(e) {
  if(e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if(e.key === 'left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

// Keyup Event
function keyUp(e) {
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = 0;
  }
}

// Keyboard events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);


// Rules and close event handlers
rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});