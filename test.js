
let fruitPoints = 0;
testNum = 0;
const canvas = document.getElementById('area');
const ctx = canvas.getContext('2d');
const sound = new Audio("pop.mp3");
const input = document.querySelector('input');
const getThat = document.getElementById("getThat");
const boundaryStart = 0;
const boundaryEnd = 1000;
const fruitbtn = document.getElementById("test");
const coordsElem = document.getElementById("coords");
let fruitX = 0;
let fruitY = 0;
let moveToLeft = false;
let moveToLeftGround = false;
let moveLeftSpeed = 0;
let activeFruits = [];
const loop = new Audio("loop.mp3");
const GameState = {
    START: 'start',
    PLAYING: 'playing',
    GAME_OVER: 'game_over'
};
let imp = 0;
let activeObstacles = [];
let currentState = GameState.START;
// let obstacles = [];
count = 0;
max = 755;
min = 600;



class Obstacle {
    constructor(name, width, height, x, y, value, color) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.value = value;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
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
        new Obstacle("top0", 50, 100, 850, 10, 1),
        new Obstacle("top1", 50, 160, 800, -10, 2),
        new Obstacle("top2", 50, 90, 900, 10, 1),
    ],
    bottom: [
        new Obstacle("bot0", 50, 100, 880, 160, 1),
        new Obstacle("bot1", 70, 50, 800, 165, 1),
        new Obstacle("bot2", 50, 60, 800, 160, 1),
    ],
    constant: [
        new Obstacle("level1", 3000, 20, 0, 200, 2),
        new Obstacle("level2", 1000, 20, 0, 500, 3),
    ]
};

let constantObstacleCount = obstacleList.constant.length;
let currentBottomObstacle = null
function chooseObstacle() {

   // Choose random obstacles
    let newTopObstacle = obstacleList.top[Math.floor((Math.random() * obstacleList.top.length))];

    let newBottomObstacle = obstacleList.bottom[Math.floor((Math.random() * obstacleList.bottom.length))];
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
   

    if (imp == 0){
    if (activeObstacles.length != 2) {
    obstacleList.constant.forEach(obstacle => {
        activeObstacles.push(new Obstacle(obstacle.name, obstacle.width, obstacle.height, obstacle.x, obstacle.y, obstacle.value, "green"));
    });
    }


    activeObstacles.push(new Obstacle(newTopObstacle.name, newTopObstacle.width, newTopObstacle.height, newTopObstacle.x, newTopObstacle.y, newTopObstacle.value, color));
    if (newTopObstacle.value != constantObstacleCount){
    activeObstacles.push(new Obstacle(newBottomObstacle.name, newBottomObstacle.width, newBottomObstacle.height, newBottomObstacle.x, newBottomObstacle.y, newBottomObstacle.value, color));
    }
    }
}
chooseObstacle();
function drawObstacle() {
    activeObstacles.forEach(obstacle => {
        // Use the obstacle's own draw method
        obstacle.draw(ctx);
    moveObstacle();
    });
}



function moveObstacle() {
    activeObstacles.forEach(obstacle => {
        if (obstacle.value != 3 && moveToLeft == true){
            obstacle.x += moveLeftSpeed;

        }
            if (activeObstacles[0].x + activeObstacles[0].width < 900){
                activeObstacles[0].value = 3;
            }
    });
}
function removeOffScreenObstacles() {
    activeObstacles = activeObstacles.filter(obstacle => obstacle.x + obstacle.width > boundaryStart);

    if (activeObstacles.length == 2)
    {

            chooseObstacle();

    }

}


const MAX_FRUITS = 5; 

function drawFood() {

    activeFruits.forEach(fruit => {
        ctx.beginPath();
        ctx.rect(fruit.x, fruit.y, fruit.width, fruit.height);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    });
}

function generateFoodItem() {
    if (imp == 0){
    if (activeFruits.length < MAX_FRUITS) {
        let ranX = Math.random() * (canvas.width - 10);
        let ranY = Math.random() * (180) + 30;
        activeFruits.push({ x: ranX, y: ranY, width: 10, height: 10 });

    }
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
        this.boundaryEnd = 1000;
        this.color = "black";
        this.timerpoints = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = this.color;
        ctx.fill()
        ctx.closePath();
    }
    pointTimer() {
    if (this.points != 0) {

        this.timerpoints += 1;            
        testNum = this.timerpoints / 20;

    }
}

    newPos() {
        this.x += this.speedX;
    }




    update() {
        coordsElem.innerHTML = "x " + this.x.toFixed() + " y " + this.y.toFixed() + " Grounded " + isGrounded + "<br>Points: " + (Math.floor(testNum) + fruitPoints) + "<br> " + moveLeftSpeed.toFixed(2) + "<br>" + "game state: " + currentState;        time = Date.now();
        const deltaTime = time - prevTime;

        // 1. Assume not grounded at the start of the frame
        isGrounded = false;

        // 2. Calculate tentative new position based on physics and input
        this.y += this.speedY * deltaTime;
        this.speedY += this.gravity * deltaTime; // Apply gravity to vertical speed

        // Apply horizontal movement from controller input and existing dx
        if (controller1.right) { this.dx += 0.5; };
        if (controller1.left) { this.dx -= 0.5; };
        this.x += this.dx;
        this.dx *= 0.9; // Apply friction/drag

        // 3. Check for collision with fixed ground and resolve
        if (this.y >= this.boundaryEnd - 50) {
            this.y = this.boundaryEnd - 50;
            this.speedY = 0;
            isGrounded = true; // Player is grounded on the fixed ground
        }


        // 4. Check for collision with obstacles and resolve
        for (let i = 0; i < activeObstacles.length; i++) {
            const obstacle = activeObstacles[i];
            if (obstacle.checkCollision(this)) {
                // Collision detected! Resolve the collision.

                const overlapX = Math.min(this.x + this.w - obstacle.x, obstacle.x + obstacle.width - this.x);
                const overlapY = Math.min(this.y + this.h - obstacle.y, obstacle.y + obstacle.height - this.y);

                if (overlapX < overlapY) {
                    // Collision is primarily horizontal
                    if (this.x + this.w > obstacle.x && this.x < obstacle.x) {
                        // Collided from the left side of the obstacle
                        this.x = obstacle.x - this.w;
                    } else if (this.x < obstacle.x + obstacle.width && this.x + this.w > obstacle.x + obstacle.width) {
                        // Collided from the right side of the obstacle
                        this.x = obstacle.x + obstacle.width;
                    }
                    this.dx = 0; // Stop horizontal movement upon horizontal collision
                } else {
                    // Collision is primarily vertical
                    if (this.y + this.h > obstacle.y && this.y < obstacle.y) {
                        // Collided from above the obstacle (landing)
                        this.y = obstacle.y - this.h;
                        this.speedY = 0; // Stop falling speed
                        isGrounded = true; // Player is now grounded on the obstacle
                    } else if (this.y < obstacle.y + obstacle.height && this.y + this.h > obstacle.y + obstacle.height) {
                        // Collided from below the obstacle
                        this.y = obstacle.y + obstacle.height;
                        this.speedY = 0; // Stop upward speed
                    }
                }

                // Optional: play a sound effect on collision
                // sound.currentTime = 0;
                // sound.play();
            }
        }

        // 5. Apply horizontal boundaries (apply after horizontal movement and collision resolution)
        if (this.x < this.boundaryStart) {
            this.x = this.boundaryStart;
            if (this.dx < 0) { // Only affect negative velocity
                this.dx = 0; // Or a small positive value to push them away
            }
        } else if (this.x + this.w > this.boundaryEnd) {
            this.x = this.boundaryEnd - this.w;
            if (this.dx > 0) { // Only affect positive velocity
                this.dx = 0; // Or a small negative value
            }
        }
        // 6. Check jump condition (now isGrounded is correctly set for this frame)
        if (controller1.up && isGrounded) {
            this.speedY = this.jumpSpeed;

        };


        // ... (check collision with fruits - can be done after position is finalized) ...
        for (let i = 0; i < activeFruits.length; i++) {
            const fruit = activeFruits[i];
            if (this.x < fruit.x + fruit.width &&
                this.x + this.w > fruit.x &&
                this.y < fruit.y + fruit.height &&
                this.y + this.h > fruit.y) {
                sound.currentTime = 0;
                sound.play();
                fruitPoints += 10;
                this.points += 1; // Assuming each fruit adds 1 point
                if (moveLeftSpeed > -3) {
                    moveLeftSpeed -= 0.1;
                    this.speedX = moveLeftSpeed; // Update player's horizontal speed too
                    moveToLeft = true;
                    moveToLeftGround = true;
                    Object.moveLeftSpeed = moveLeftSpeed;
                }

                // Remove the collided fruit
                activeFruits.splice(i, 1);
                // Generate one new fruit after each fruit is eaten
                generateFoodItem();
                generateFoodItem();
                break; // Stop checking for collisions after finding one
            }
        }

        // 9. Store last draws (using the final position after all movement and collision resolution)
        lastDraws.push({ x: this.x, y: this.y, width: this.w, height: this.h, color: this.color });
        if (lastDraws.length > this.points) { // Keep points + 5 last draws
            lastDraws.shift();
        }


        removeOffScreenObstacles();


        this.draw(); // Draw the player in their final position for the frame

        prevTime = Date.now();
    }
}
let p = 100;

// function checkTimerPoints() {

//     if (main1.timerpoints == p) {
//         chooseObstacle();
//         p += 15;
//     }

// }


function checkWhere() {
    if (main1.x > 800 && main1.y > 200) {
        imp = 1;
    }

    if (imp == 1) {
        main1.speedX = 0;
        callIt(); // call the function to change the map and remove fruits
    }

}
let startW = 0;
let maxW = 50;
let startCount = 0;
let stopCount = 200;
let theCount = 0;

function callIt(){
    if (imp == 1){
    activeObstacles[0].y -= 0.5;
    activeFruits.length = 0;
    }
growIt();
}

function growIt(){

if (theCount == 0){
    main1.w++;
    main1.h++;
    startW++;
}

if (theCount == 1){
    main1.w--;
    main1.h--;
    startW--;    
}

if (startCount == stopCount){
    clearInterval(theInterval);
    theCount = 3;
}
else if (startCount != stopCount){
    startCount++;

}


}
const theInterval = setInterval(int, 200);

function int(){
    if (theCount == 0){
        theCount = 1
    }
    else {
        theCount = 0;
    }    
}




function redrawLastDraws() {

    //change redraw color based on points

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastDraws.forEach((draw, idx) => {
        ctx.fillStyle = color = `hsl(${(idx / lastDraws.length) * 360}, 100%, 50%)`;
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

let main1 = new Main(20, 100, 50, 50)
let controller1 = new Controller();



    generateFoodItem();



function animate() {

    main1.pointTimer();
    redrawLastDraws(); // Redraw the player's trail (and potentially clears the canvas)
    drawFood(); // Draw the food in its fixed position
    drawObstacle();
    checkWhere();
    // createObstacle();
    // checkTimerPoints();

    main1.update();
    requestAnimationFrame(animate);
}

function updatePos() {
    main1.newPos();
}

animate()
setInterval(updatePos, 10)


