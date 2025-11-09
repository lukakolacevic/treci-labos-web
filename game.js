const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const TOTAL_BRICKS = BRICK_ROWS * BRICK_COLS;

const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;

const BRICK_HORIZONTAL_SPACING = 30;
const BRICK_VERTICAL_SPACING = 15;

const INITIAL_BALL_SPEED = 4;

const BALL_SIZE = 8;

const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;

const PADDLE_SPEED = 6;

const BRICK_COLORS = [
    'rgb(153, 51, 0)',
    'rgb(255, 0, 0)',
    'rgb(255, 153, 204)',
    'rgb(0, 255, 0)',
    'rgb(255, 255, 153)'
];

const BALL_COLOR = 'rgb(220, 220, 220)';
const PADDLE_COLOR = 'rgb(220, 220, 220)';

const SCORE_TEXT_LEFT_OFFSET = 20;
const SCORE_TEXT_TOP_OFFSET = 20;
const SCORE_TEXT_RIGHT_OFFSET = 100;
const SCORE_TEXT_SIZE = 20;

let canvas;
let ctx;

let gameState = 'START';

let ball = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    size: BALL_SIZE,
    speed: INITIAL_BALL_SPEED
};

let paddle = {
    x: 0,
    y: 0,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 0
};

let bricks = [];

let score = 0;

let bestScore = 0;

let keys = {};

/**
 * Funkcija koja se poziva kada se učita web stranica.
 * Inicijalizira canvas, učitava najbolji rezultat i postavlja event listenere.
 */
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    loadBestScore();
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    gameLoop();
}

/**
 * Učitava najbolji rezultat iz localStorage.
 * Ako rezultat ne postoji, postavlja ga na 0.
 */
function loadBestScore() {
    const saved = localStorage.getItem('breakoutBestScore');
    bestScore = saved ? parseInt(saved) : 0;
}

/**
 * Sprema najbolji rezultat u localStorage.
 */
function saveBestScore() {
    localStorage.setItem('breakoutBestScore', bestScore.toString());
}

/**
 * Resetira igru na početno stanje.
 * Postavlja palicu i lopticu na početne pozicije i generira cigle.
 */
function resetGame() {
    paddle.x = canvas.width / 2 - paddle.width / 2;
    paddle.y = canvas.height - 40;
    paddle.dx = 0;
    
    ball.x = paddle.x + paddle.width / 2 - ball.size / 2;
    ball.y = paddle.y - ball.size;
    
    const direction = Math.random() < 0.5 ? -1 : 1;
    ball.dx = direction * ball.speed * Math.cos(Math.PI / 4);
    ball.dy = -ball.speed * Math.sin(Math.PI / 4);
    
    score = 0;
    
    generateBricks();
}

/**
 * Generira niz cigli (5 redova x 10 stupaca).
 * Svaka cigla ima poziciju, dimenzije, boju i status.
 */
function generateBricks() {
    bricks = [];
    
    const totalWidth = BRICK_COLS * BRICK_WIDTH + (BRICK_COLS - 1) * BRICK_HORIZONTAL_SPACING;
    const totalHeight = BRICK_ROWS * BRICK_HEIGHT + (BRICK_ROWS - 1) * BRICK_VERTICAL_SPACING;
    
    const offsetX = (canvas.width - totalWidth) / 2;
    const offsetY = 60;
    
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            bricks.push({
                x: offsetX + col * (BRICK_WIDTH + BRICK_HORIZONTAL_SPACING),
                y: offsetY + row * (BRICK_HEIGHT + BRICK_VERTICAL_SPACING),
                width: BRICK_WIDTH,
                height: BRICK_HEIGHT,
                color: BRICK_COLORS[row],
                active: true
            });
        }
    }
}

/**
 * Handler za pritisak tipke.
 * Bilježi pritisnutu tipku i reagira na Space za početak/restart igre.
 */
function handleKeyDown(e) {
    keys[e.key] = true;
    
    if (gameState === 'START' && e.key === ' ') {
        gameState = 'PLAYING';
        resetGame();
    }
    
    if ((gameState === 'GAME_OVER' || gameState === 'WIN') && e.key === ' ') {
        gameState = 'PLAYING';
        resetGame();
    }
}

/**
 * Handler za otpuštanje tipke.
 * Briše tipku iz objekta pritisnutih tipki.
 */
function handleKeyUp(e) {
    keys[e.key] = false;
}

/**
 * Ažurira poziciju palice na temelju pritisnutih tipki.
 * Podržava strelice (ArrowLeft, ArrowRight) i tipke 'a'/'d'.
 */
function updatePaddle() {
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        paddle.x -= PADDLE_SPEED;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        paddle.x += PADDLE_SPEED;
    }
    
    if (paddle.x < 0) {
        paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

/**
 * Ažurira poziciju loptice i provjerava kolizije.
 */
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.x <= 0 || ball.x + ball.size >= canvas.width) {
        ball.dx = -ball.dx;
    }
    
    if (ball.y <= 0) {
        ball.dy = -ball.dy;
    }
    
    if (ball.y + ball.size >= canvas.height) {
        gameState = 'GAME_OVER';
        if (score > bestScore) {
            bestScore = score;
            saveBestScore();
        }
        return;
    }
    
    checkPaddleCollision();
    
    checkBrickCollision();
}

/**
 * Provjerava koliziju loptice s palicom.
 * Ako dođe do kolizije, mijenja smjer loptice.
 */
function checkPaddleCollision() {
    if (ball.y + ball.size >= paddle.y &&
        ball.y <= paddle.y + paddle.height &&
        ball.x + ball.size >= paddle.x &&
        ball.x <= paddle.x + paddle.width) {
        
        ball.dy = -Math.abs(ball.dy);
        
        const hitPos = (ball.x + ball.size / 2 - paddle.x) / paddle.width;
        ball.dx = (hitPos - 0.5) * ball.speed * 2;
    }
}

/**
 * Provjerava koliziju loptice s ciglama.
 * Uništava ciglu pri koliziji i ažurira rezultat.
 */
function checkBrickCollision() {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        
        if (!brick.active) continue;
        
        if (ball.x + ball.size >= brick.x &&
            ball.x <= brick.x + brick.width &&
            ball.y + ball.size >= brick.y &&
            ball.y <= brick.y + brick.height) {
            
            brick.active = false;
            
            score++;
            
            if (score > bestScore) {
                bestScore = score;
                saveBestScore();
            }
            
            const ballCenterX = ball.x + ball.size / 2;
            const ballCenterY = ball.y + ball.size / 2;
            const brickCenterX = brick.x + brick.width / 2;
            const brickCenterY = brick.y + brick.height / 2;
            
            const dx = ballCenterX - brickCenterX;
            const dy = ballCenterY - brickCenterY;
            
            const isCorner = Math.abs(dx) / brick.width > 0.4 && 
                            Math.abs(dy) / brick.height > 0.4;
            
            if (isCorner) {
                const speedIncrease = 1.1;
                ball.dx = -ball.dx * speedIncrease;
                ball.dy = -ball.dy * speedIncrease;
            } else if (Math.abs(dx) > Math.abs(dy)) {
                ball.dx = -ball.dx;
            } else {
                ball.dy = -ball.dy;
            }
            
            checkWinCondition();
            
            break;
        }
    }
}

/**
 * Provjerava je li igrač uništio sve cigle (pobjeda).
 */
function checkWinCondition() {
    const activeBricks = bricks.filter(b => b.active).length;
    if (activeBricks === 0) {
        gameState = 'WIN';
    }
}

/**
 * Glavna funkcija za iscrtavanje koja se poziva u svakom frame-u.
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'START') {
        drawStartScreen();
    } else if (gameState === 'PLAYING') {
        drawGame();
    } else if (gameState === 'GAME_OVER') {
        drawGame();
        drawGameOver();
    } else if (gameState === 'WIN') {
        drawGame();
        drawWin();
    }
}

/**
 * Iscrtava početni ekran s naslovom i uputama.
 */
function drawStartScreen() {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Helvetica, Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BREAKOUT', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.font = 'bold italic 18px Helvetica, Verdana, sans-serif';
    ctx.fillText('Press SPACE to begin', canvas.width / 2, canvas.height / 2 + 20);
}

/**
 * Iscrtava sve elemente igre (cigle, palicu, lopticu, rezultate).
 */
function drawGame() {
    drawBricks();
    
    drawPaddle();
    
    drawBall();
    
    drawScore();
}

/**
 * Iscrtava sve aktivne cigle s 3D efektom.
 */
function drawBricks() {
    for (let brick of bricks) {
        if (brick.active) {
            drawRect3D(brick.x, brick.y, brick.width, brick.height, brick.color);
        }
    }
}

/**
 * Iscrtava palicu s 3D efektom.
 */
function drawPaddle() {
    drawRect3D(paddle.x, paddle.y, paddle.width, paddle.height, PADDLE_COLOR);
}

/**
 * Iscrtava lopticu s 3D efektom.
 */
function drawBall() {
    drawRect3D(ball.x, ball.y, ball.size, ball.size, BALL_COLOR);
}

/**
 * Iscrtava pravokutnik s 3D sjenčanjem ruba.
 * @param {number} x - X pozicija
 * @param {number} y - Y pozicija
 * @param {number} width - Širina
 * @param {number} height - Visina
 * @param {string} color - Glavna boja
 */
function drawRect3D(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.stroke();
}

/**
 * Iscrtava trenutni i najbolji rezultat.
 * Trenutni rezultat - lijevo gore (20px od lijevog ruba, 20px od gornjeg ruba, align left)
 * Najbolji rezultat - desno gore (100px od desnog ruba, 20px od gornjeg ruba, align right)
 */
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = `${SCORE_TEXT_SIZE}px Helvetica, Verdana, sans-serif`;
    
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Bodovi: ${score}`, 
                 SCORE_TEXT_LEFT_OFFSET, SCORE_TEXT_TOP_OFFSET);
    
    ctx.textAlign = 'right';
    ctx.fillText(`Best: ${bestScore}`, 
                 canvas.width - SCORE_TEXT_RIGHT_OFFSET, SCORE_TEXT_TOP_OFFSET);
}

/**
 * Iscrtava "GAME OVER" poruku preko sredine ekrana.
 */
function drawGameOver() {
    ctx.fillStyle = 'rgb(255, 255, 153)';
    ctx.font = 'bold 40px Helvetica, Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold italic 18px Helvetica, Verdana, sans-serif';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 30);
}

/**
 * Iscrtava poruku o pobjedi preko sredine ekrana.
 */
function drawWin() {
    ctx.fillStyle = 'rgb(255, 255, 153)';
    ctx.font = 'bold 40px Helvetica, Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ČESTITAMO!', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = 'bold 24px Helvetica, Verdana, sans-serif';
    ctx.fillText('Sve cigle su uništene!', canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold italic 18px Helvetica, Verdana, sans-serif';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 30);
}

/**
 * Glavna petlja igre koja se izvršava 60 puta u sekundi.
 * Ažurira stanje igre i iscrtava sve elemente.
 */
function gameLoop() {
    if (gameState === 'PLAYING') {
        updatePaddle();
        updateBall();
    }
    
    draw();
    
    requestAnimationFrame(gameLoop);
}

window.addEventListener('load', init);
