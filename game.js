
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let best = localStorage.getItem('swingHeroBest') || 0;
document.getElementById('best').textContent = best;

let running = true;

function resetGame() {
    score = 0;
    player.x = 200;
    player.y = 100;
    player.vx = 2;
    player.vy = 0;
    attached = false;
}

function gameLoop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    score++;
    document.getElementById('score').textContent = score;

    if (attached) {
        let dx = player.x - player.anchorX;
        let dy = player.y - player.anchorY;
        let angle = Math.atan2(dy, dx);
        let dist = Math.sqrt(dx*dx + dy*dy);
        let tension = (dist - player.ropeLength) * 0.1;

        let tx = Math.cos(angle) * tension;
        let ty = Math.sin(angle) * tension;

        player.vx -= tx;
        player.vy -= ty;
    } else {
        player.vy += gravity;
    }

    player.x += player.vx;
    player.y += player.vy;

    if (player.y > canvas.height) {
        running = false;
        if (score > best) {
            best = score;
            localStorage.setItem('swingHeroBest', best);
        }
        setTimeout(() => {
            resetGame();
            running = true;
            gameLoop();
        }, 1500);
        return;
    }

    if (attached) {
        ctx.beginPath();
        ctx.moveTo(player.anchorX, player.anchorY);
        ctx.lineTo(player.x, player.y);
        ctx.strokeStyle = '#aaa';
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    requestAnimationFrame(gameLoop);
}

document.body.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
        if (!attached) {
            attachRope();
        } else {
            releaseRope();
        }
    }
});

resetGame();
gameLoop();
