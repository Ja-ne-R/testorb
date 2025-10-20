
const canvas = document.getElementById('area');
const ctx = canvas.getContext('2d');
const sound = new Audio("pop.mp3");
const input = document.querySelector('input');
const getThat = document.getElementById("getThat");
const boundaryStart = 0;
const boundaryEnd = 800;
const fruitbtn = document.getElementById("test");
const coordsElem = document.getElementById("coords");
let fruitX = 0;
let fruitY = 0;
let moveToLeft = false;
let moveLeftSpeed = 0;
let activeFruits = [];
const loop = new Audio("loop.mp3");
const GameState = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};

let currentState = GameState.START;
// let obstacles = [];
count = 0;
max = 755;
min = 600;
// function createObstacle() {
//     let getWidth = Math.floor((Math.random() * 200) + 1);
//     let getHeight = Math.floor((Math.random() * 100) + 1);
//     let getX = Math.floor(Math.random() * (max - min + 1) + min);
//     let getY = Math.floor((Math.random() * 200) + 1);
//     let randomColor = '#' + (Math.random().toString(16) + "000000").substring(2, 8);
//     obstacles.push({ getX, getY, getWidth, getHeight, randomColor });
//     // drawObstacles();
// }
// createObstacle();
// function drawObstacles() {
//     obstacles.forEach(obstacle => {
//         ctx.beginPath();
//         ctx.rect(obstacle.getX, obstacle.getY, obstacle.getWidth, obstacle.getHeight);
//         ctx.fillStyle = obstacle.randomColor;
//         ctx.fill();
//         ctx.closePath();
//     });
// }
class Obstacle {
    constructor(name, width, height, x, y, value) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.value = value;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.value === 1 ? "grey" : "black"; // Differentiate based on value
        ctx.fill();
        ctx.closePath();
    }

    checkCollision(player) {
        
        return player.x < this.x + this.width &&
            player.x + player.w > this.x &&
            player.y < this.y + this.height &&
            player.y + player.h > this.y;
    }
}
const obstacleList = {
    top: [
        new Obstacle("top0", 50, 100, 600, 10, 1),
        new Obstacle("top1", 50, 160, 600, 0, 2),
    ],
    bottom: [
        new Obstacle("bot0", 50, 100, 500, 120, 1),
        new Obstacle("bot1", 70, 50, 570, 165, 1),
    ]
};
let currentBottomObstacle = null
function chooseObstacle() {

    obstacleToDrawTop = obstacleList.top[Math.floor((Math.random() * obstacleList.top.length))]; 
    ranObBot =  obstacleList.bottom[Math.floor((Math.random()* obstacleList.bottom.length))];
    
}
chooseObstacle();
function drawObstacle() {
    obstacleList.top.forEach(obstacle => obstacle.draw(ctx));
    obstacleList.bottom.forEach(obstacle => obstacle.draw(ctx));
}

// document.addEventListener("keydown", function() {
//     if (count == 0) {
//     loop.play();   
//     loop.loop = true; 
//     count++;    
//     }

// })
// Define the maximum number of fruits allowed
const MAX_FRUITS = 5; // You can change this number to your desired limit

// function generateFood(){
// fruitX = 185;
// fruitY = 185;
// }
// document.onload = generateFood();

// Function to draw all active fruits
function drawFood() {
    // The canvas is cleared by redrawLastDraws, so no need to clear here

    activeFruits.forEach(fruit => {
        ctx.beginPath();
        ctx.rect(fruit.x, fruit.y, fruit.width, fruit.height);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    });
}

// Function to generate *one* food item initially (or when needed)
function generateFoodItem() {
    // Check if the number of fruits is less than the maximum allowed
    if (activeFruits.length < MAX_FRUITS) {
        let ranX = Math.random() * (canvas.width - 10);
        let ranY = Math.random() * (180) + 20;
        activeFruits.push({ x: ranX, y: ranY, width: 10, height: 10 });
        // Optionally, update fruitX and fruitY here if you plan to use them for collision
        // fruitX = ranX;
        // fruitY = ranY;
    }
}

fruitbtn.addEventListener("click", function () {
    sound.currentTime = 0; 
    sound.play();

});



let time; // Current time
let prevTime = Date.now(); // Store previous time
let isGrounded; 
lastDraws = [];
class Main {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.points = 0;
        this.speedX = moveLeftSpeed;
        this.speedY = 0;
        this.gravity = .01;
        this.jumpSpeed = -1.5; // How fast to jump upwards
        this.dx = 0;
        this.dy = 0;
        this.boundaryStart = 0;
        this.boundaryEnd = 800;
        this.color = "black";
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.closePath();
    }

    newPos() {
        this.x += this.speedX;
    }

    update() {
        coordsElem.innerHTML = "x " + this.x.toFixed() + " y " + this.y.toFixed() + " Grounded " + isGrounded + "<br>Points: " + this.points + "<br> " + moveLeftSpeed.toFixed(2);
        time = Date.now();
        const deltaTime = time - prevTime;

            this.y += this.speedY * deltaTime;
        this.y += this.gravity * deltaTime;
        // Make sure to reduce our player's speed in y by gravity!
        this.speedY += this.gravity * deltaTime;

        // Only allow the player to jump if he is on the ground
        if (controller1.up && isGrounded) {
            // Set the player y-speed to jump speed
            this.speedY = this.jumpSpeed;
        };
        //boundaries
        if (this.x < this.boundaryStart) { this.x = this.boundaryStart };
        if (this.x + this.w > this.boundaryEnd) { this.x = this.boundaryEnd - this.w }

        for (let i = 0; i < obstacleList.bottom.length; i++) {
            const obstacle = obstacleList.bottom[i];
            if (obstacle.checkCollision(this)) {
                sound.currentTime = 0;
                sound.play();
                // Implement additional logic for when the player collides with an obstacle
            }
        }


        if (controller1.right) { this.dx += 0.5 };
        if (controller1.left) { this.dx -= 0.5 };

        this.x += this.dx;
        // this.y += this.dy; // This seems unused
        this.dx *= 0.9;
        this.dy *= 0.9; // This seems unused

        // Ground check
        if (this.y >= canvas.height - 50) {
            this.y = canvas.height - 50;
            isGrounded = true;
        } else {
            isGrounded = false;
        }

        // check collision - Iterate through activeFruits for collision
        for (let i = 0; i < activeFruits.length; i++) {
            const fruit = activeFruits[i];
            if (this.x < fruit.x + fruit.width &&
                this.x + this.w > fruit.x &&
                this.y < fruit.y + fruit.height &&
                this.y + this.h > fruit.y) {
                sound.currentTime = 0;
                sound.play();

                this.points += 1; // Assuming each fruit adds 1 point
                if (moveLeftSpeed > -3) {
                    moveLeftSpeed -= 0.2;
                    this.speedX = moveLeftSpeed;
                    moveToLeft = true;
                }

                // Remove the collided fruit
                activeFruits.splice(i, 1);
                // Generate one new fruit after each fruit is eaten
                generateFoodItem();
                generateFoodItem();
                break; // Stop checking for collisions after finding one
            }
        }

        // Iterate through the obstacles in obstaclelist.bottom
        for (let i = 0; i < obstacleList.bottom.length; i++) {
            const obstacle = obstacleList.bottom[i];



            // Check for collision using bounding boxes
            if (this.x < obstacle.obX + obstacle.obWidth &&
                this.x + this.w > obstacle.obX &&
                this.y < obstacle.obY + obstacle.obHeight &&
                this.y + this.h > obstacle.obY) {

            //     // Collision detected with this obstacle
                sound.currentTime = 0;
                sound.play();

            //     // You might want to add additional logic here,
            //     // like stopping the player, reducing health, etc.

            //     // If you only need to detect collision once per obstacle,
            //     // you could break or add a flag to the obstacle object.
            }
        }


        //store last draws
        lastDraws.push({ x: this.x, y: this.y, width: this.w, height: this.h, color: this.color });
        // Limit the number of last draws based on points (adjust as needed)
        if (lastDraws.length > this.points ) { // Example: Keep points + 5 last draws
            lastDraws.shift();
        }


        this.draw();

        // Store the current time to use for calculation in next update
        prevTime = Date.now();
    }

}

function redrawLastDraws() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastDraws.forEach((draw, idx) => {
        ctx.fillStyle = idx === lastDraws.length - 1 ? 'black' : 'grey'; // Last box is black, rest are grey
        ctx.fillRect(draw.x, draw.y, draw.width, draw.height);
    });
}
class Controller {
    constructor() {
        this.up = false;
        this.right = false;
        this.down = false;
        this.left = false;

        let keyEvent = (e) => {
            if (e.code == "KeyW" || e.code == "ArrowUp") { this.up = e.type == 'keydown' };
            if (e.code == "KeyD" || e.code == "ArrowRight") { this.right = e.type == 'keydown' };
            if (e.code == "KeyA" || e.code == "ArrowLeft") { this.left = e.type == 'keydown' };
        }

        addEventListener('keydown', keyEvent);
        addEventListener('keyup', keyEvent);
        // addEventListener('mousemove', keyEvent) // mousemove seems irrelevant for these controls
    }
}

let main1 = new Main(canvas.width / 2, canvas.height / 2, 50, 50)
let controller1 = new Controller();

// Generate the initial food items up to the limit

    generateFoodItem();



function animate() {
    // ctx.clearRect(0, 0, canvas.width, canvas.height); // This might be cleared by redrawLastDraws


    redrawLastDraws(); // Redraw the player's trail (and potentially clears the canvas)
    drawFood(); // Draw the food in its fixed position
    drawObstacle();
    // createObstacle();
    main1.update();
    requestAnimationFrame(animate);
}

function updatePos() {
    main1.newPos();
}

animate()
setInterval(updatePos, 10)


