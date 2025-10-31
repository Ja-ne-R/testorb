
const canvas = document.getElementById('area');
const ctx = canvas.getContext('2d');
let obstacles = [];
const press = document.getElementById("press");
let activeTriangles = [];
let moveTriangles = false;

class TriangleObstacle {
    constructor(x1, y1, x2, y2, x3, y3, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
        this.color = color;
    }
}
let lowground = 520;
// x = left or right, y = up or down
// 1 = first corner 2 = 2nd corner 3 = third corner
const triangles = [
    new TriangleObstacle(700, lowground, 800, 400, 900, lowground, "blue"),
    new TriangleObstacle(700, lowground, 800, 360, 900, lowground, "red"),
    new TriangleObstacle(700, lowground, 840, 340, 900, lowground, "green")
];



function chooseTriangleObstacle() {
    // Randomly select a triangle from the array
    const newTriangle = triangles[Math.floor(Math.random() * triangles.length)];
    activeTriangles.push(new TriangleObstacle(newTriangle.x1, newTriangle.y1, newTriangle.x2, newTriangle.y2, newTriangle.x3, newTriangle.y3, newTriangle.color));
}

function drawTriangleObstacles() {
    activeTriangles.forEach(triangle => {
        ctx.beginPath();
        ctx.moveTo(triangle.x1, triangle.y1);
        ctx.lineTo(triangle.x2, triangle.y2);
        ctx.lineTo(triangle.x3, triangle.y3);
        ctx.closePath();
        ctx.fillStyle = triangle.color;
        ctx.fill();
    });
}


chooseTriangleObstacle();

function removeOffScreenTriangleObstacles() {
    activeTriangles = activeTriangles.filter(triangle => triangle.x1 > boundaryStart && triangle.x2 > boundaryStart && triangle.x3 > boundaryStart);
}

function moveTriangleObstacles() {
    if (moveTriangles == true) {
        activeTriangles.forEach(triangle => {
            triangle.x1 += moveLeftSpeed;
            triangle.x2 += moveLeftSpeed;
            triangle.x3 += moveLeftSpeed;
        });
    }
}    


function animate(){
    drawTriangleObstacles();
}

animate()