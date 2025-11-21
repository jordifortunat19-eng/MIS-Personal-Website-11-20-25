// Super Mario Flappy Bird - Team Project
// A Mario-themed Flappy Bird variant game

document.addEventListener('DOMContentLoaded', function() {
    const gameArea = document.getElementById('game-area');
    
    if (gameArea) {
        // Game canvas setup
        const canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        gameArea.innerHTML = '';
        gameArea.appendChild(canvas);
        
        // Game state
        let gameState = 'start'; // 'start', 'playing', 'gameover'
        let score = 0;
        let highScore = localStorage.getItem('marioHighScore') || 0;
        
        // Mario character
        const mario = {
            x: 150,
            y: 250,
            width: 40,
            height: 40,
            velocity: 0,
            gravity: 0.6,
            jumpPower: -10,
            color: '#FF0000' // Mario red
        };
        
        // Pipes (Mario-style pipes)
        const pipes = [];
        const pipeWidth = 80;
        const pipeGap = 200;
        const pipeSpeed = 3;
        let pipeTimer = 0;
        const pipeInterval = 120; // frames between pipes
        
        // Game loop
        let animationId;
        
        // Draw functions
        function drawMario() {
            // Mario body (red)
            ctx.fillStyle = mario.color;
            ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
            
            // Mario hat (red cap)
            ctx.fillStyle = '#CC0000';
            ctx.fillRect(mario.x + 5, mario.y, 30, 15);
            
            // Mario face (skin color)
            ctx.fillStyle = '#FFDBAC';
            ctx.fillRect(mario.x + 10, mario.y + 15, 20, 15);
            
            // Mario eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(mario.x + 15, mario.y + 18, 3, 3);
            ctx.fillRect(mario.x + 22, mario.y + 18, 3, 3);
            
            // Mario mustache
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(mario.x + 12, mario.y + 22, 16, 4);
            
            // Mario overalls (blue)
            ctx.fillStyle = '#0066FF';
            ctx.fillRect(mario.x + 8, mario.y + 28, 24, 12);
        }
        
        function drawPipe(x, topHeight, bottomY) {
            // Pipe color (green Mario pipe)
            const pipeColor = '#00AA00';
            const pipeTopColor = '#008800';
            
            // Top pipe
            ctx.fillStyle = pipeColor;
            ctx.fillRect(x, 0, pipeWidth, topHeight);
            ctx.fillStyle = pipeTopColor;
            ctx.fillRect(x - 5, topHeight - 20, pipeWidth + 10, 20);
            
            // Bottom pipe
            ctx.fillStyle = pipeColor;
            ctx.fillRect(x, bottomY, pipeWidth, canvas.height - bottomY);
            ctx.fillStyle = pipeTopColor;
            ctx.fillRect(x - 5, bottomY, pipeWidth + 10, 20);
        }
        
        function drawBackground() {
            // Sky (Mario blue sky)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#E0F6FF');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            drawCloud(100, 80, 60);
            drawCloud(300, 120, 50);
            drawCloud(500, 100, 55);
            drawCloud(700, 90, 60);
        }
        
        function drawCloud(x, y, size) {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
            ctx.arc(x + size * 1.2, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        function drawGround() {
            // Ground (brown Mario ground)
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
            
            // Grass on top
            ctx.fillStyle = '#228B22';
            ctx.fillRect(0, canvas.height - 40, canvas.width, 5);
        }
        
        function drawUI() {
            // Score
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 32px Arial';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.strokeText(`Score: ${score}`, 20, 40);
            ctx.fillText(`Score: ${score}`, 20, 40);
            
            // High score
            ctx.font = 'bold 20px Arial';
            ctx.strokeText(`High Score: ${highScore}`, 20, 70);
            ctx.fillText(`High Score: ${highScore}`, 20, 70);
        }
        
        function drawStartScreen() {
            drawBackground();
            drawGround();
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Arial';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            const title = 'Super Mario Flappy';
            const titleWidth = ctx.measureText(title).width;
            ctx.strokeText(title, (canvas.width - titleWidth) / 2, canvas.height / 2 - 50);
            ctx.fillText(title, (canvas.width - titleWidth) / 2, canvas.height / 2 - 50);
            
            ctx.font = 'bold 24px Arial';
            const instruction = 'Click or Press SPACE to Start & Jump';
            const instWidth = ctx.measureText(instruction).width;
            ctx.strokeText(instruction, (canvas.width - instWidth) / 2, canvas.height / 2 + 20);
            ctx.fillText(instruction, (canvas.width - instWidth) / 2, canvas.height / 2 + 20);
            
            // Draw Mario at start position
            drawMario();
        }
        
        function drawGameOver() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 48px Arial';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            const gameOver = 'Game Over!';
            const gameOverWidth = ctx.measureText(gameOver).width;
            ctx.strokeText(gameOver, (canvas.width - gameOverWidth) / 2, canvas.height / 2 - 50);
            ctx.fillText(gameOver, (canvas.width - gameOverWidth) / 2, canvas.height / 2 - 50);
            
            ctx.font = 'bold 32px Arial';
            const finalScore = `Final Score: ${score}`;
            const scoreWidth = ctx.measureText(finalScore).width;
            ctx.strokeText(finalScore, (canvas.width - scoreWidth) / 2, canvas.height / 2 + 20);
            ctx.fillText(finalScore, (canvas.width - scoreWidth) / 2, canvas.height / 2 + 20);
            
            ctx.font = 'bold 20px Arial';
            const restart = 'Click or Press SPACE to Restart';
            const restartWidth = ctx.measureText(restart).width;
            ctx.strokeText(restart, (canvas.width - restartWidth) / 2, canvas.height / 2 + 70);
            ctx.fillText(restart, (canvas.width - restartWidth) / 2, canvas.height / 2 + 70);
        }
        
        // Game logic
        function updateMario() {
            mario.velocity += mario.gravity;
            mario.y += mario.velocity;
            
            // Boundary check
            if (mario.y < 0) {
                mario.y = 0;
                mario.velocity = 0;
            }
            if (mario.y + mario.height > canvas.height - 40) {
                mario.y = canvas.height - 40 - mario.height;
                gameOver();
            }
        }
        
        function updatePipes() {
            // Add new pipes
            pipeTimer++;
            if (pipeTimer >= pipeInterval) {
                pipeTimer = 0;
                const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
                pipes.push({
                    x: canvas.width,
                    topHeight: topHeight,
                    bottomY: topHeight + pipeGap,
                    passed: false
                });
            }
            
            // Update existing pipes
            for (let i = pipes.length - 1; i >= 0; i--) {
                pipes[i].x -= pipeSpeed;
                
                // Check if passed
                if (!pipes[i].passed && pipes[i].x + pipeWidth < mario.x) {
                    pipes[i].passed = true;
                    score++;
                    if (score > highScore) {
                        highScore = score;
                        localStorage.setItem('marioHighScore', highScore);
                    }
                }
                
                // Check collision
                if (checkCollision(mario, pipes[i])) {
                    gameOver();
                }
                
                // Remove off-screen pipes
                if (pipes[i].x + pipeWidth < 0) {
                    pipes.splice(i, 1);
                }
            }
        }
        
        function checkCollision(mario, pipe) {
            return mario.x < pipe.x + pipeWidth &&
                   mario.x + mario.width > pipe.x &&
                   (mario.y < pipe.topHeight || mario.y + mario.height > pipe.bottomY);
        }
        
        function jump() {
            if (gameState === 'start') {
                gameState = 'playing';
                resetGame();
            } else if (gameState === 'playing') {
                mario.velocity = mario.jumpPower;
            } else if (gameState === 'gameover') {
                gameState = 'start';
                resetGame();
            }
        }
        
        function resetGame() {
            mario.y = 250;
            mario.velocity = 0;
            pipes.length = 0;
            pipeTimer = 0;
            score = 0;
        }
        
        function gameOver() {
            if (gameState === 'playing') {
                gameState = 'gameover';
            }
        }
        
        // Game loop
        function gameLoop() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (gameState === 'start') {
                drawStartScreen();
            } else if (gameState === 'playing') {
                drawBackground();
                drawGround();
                
                updateMario();
                updatePipes();
                
                // Draw pipes
                pipes.forEach(pipe => {
                    drawPipe(pipe.x, pipe.topHeight, pipe.bottomY);
                });
                
                drawMario();
                drawUI();
            } else if (gameState === 'gameover') {
                drawBackground();
                drawGround();
                
                // Draw pipes
                pipes.forEach(pipe => {
                    drawPipe(pipe.x, pipe.topHeight, pipe.bottomY);
                });
                
                drawMario();
                drawUI();
                drawGameOver();
            }
            
            animationId = requestAnimationFrame(gameLoop);
        }
        
        // Event listeners
        canvas.addEventListener('click', jump);
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                jump();
            }
        });
        
        // Responsive canvas
        function resizeCanvas() {
            const container = gameArea;
            const maxWidth = Math.min(800, container.clientWidth - 40);
            const aspectRatio = 800 / 600;
            canvas.style.width = maxWidth + 'px';
            canvas.style.height = (maxWidth / aspectRatio) + 'px';
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Start game loop
        gameLoop();
    }
});
