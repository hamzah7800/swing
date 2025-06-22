const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

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

    // Draw dark background
    ctx.fillStyle = "#0a0a1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update score
    score++;
    document.getElementById('score').textContent = score;

    // Apply swing physics if rope is attached
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

    // Update player position
    player.x += player.vx;
    player.y += player.vy;

    // If player falls, reset
    if (player.y > canvas.height + 100) {
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

    // Draw rope if attached
    if (attached) {
        ctx.beginPath();
        ctx.moveTo(player.anchorX, player.anchorY);
        ctx.lineTo(player.x, player.y);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]); // spider web style
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw the player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red'; // spider-suit color
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    requestAnimationFrame(gameLoop);
}

// Remote OK button (Enter) toggles swing
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
