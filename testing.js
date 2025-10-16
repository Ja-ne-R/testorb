
const canvas = document.getElementById('area');
const ctx = canvas.getContext('2d');
let obstacles = [];
const press = document.getElementById("press");


function createObstacle() {
    let getWidth = Math.floor(Math.random() * 200);
    let getHeight = Math.floor(Math.random() * 300);
    let getX = Math.floor(Math.random() * (canvas.width - 10));
    let getY = Math.floor(Math.random() * (canvas.width - 10));
    let randomColor = '#' + (Math.random().toString(16) + "000000").substring(2, 8);
    obstacles.push({getX, getY, getWidth, getHeight, randomColor});
    // drawObstacles();
}

press.addEventListener("click", createObstacle);

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.rect(obstacle.getX, obstacle.getY, obstacle.getWidth, obstacle.getHeight);
        ctx.fillStyle = obstacle.randomColor;
        ctx.fill();
        ctx.closePath();
    });
}


