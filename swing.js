
let gravity = 0.4;
let attached = false;

function attachRope() {
    player.anchorX = player.x;
    player.anchorY = player.y - player.ropeLength;
    attached = true;
}

function releaseRope() {
    attached = false;
}
