const canvas = document.getElementById('area');
const ctx = canvas.getContext('2d');
const sound = new Audio("pop.mp3");
const input = document.querySelector('input');
const getThat = document.getElementById("getThat");
const boundaryStart = 0;
const boundaryEnd = 500;
const fruitbtn = document.getElementById("test");
const coordsElem = document.getElementById("coords");

const player = {
    x: 50,
    y: 50,
    width: 30,
    height: 30,
    color: 'black',
    speed: 5,
    jump: 100,
    gravity: 0.5,
    jumpSpeed: -1.5,
    speedX: 0,
    speedY: 0,

};

let time; // Current time
let prevTime = Date.now(); // Store previous time
let isGrounded; // Check if player is on the ground

class Main {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.lives = 3;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = .01;
        // this.gravitySpeed = 0;
        this.jumpSpeed = -1.5; // How fast to jump upwards
        this.dx = 0;
        this.dy = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill()
        ctx.closePath();
    }

    newPos() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
    }

    update() {
            coordsElem.innerHTML = "x " + this.x + " y " + this.y + " onGround " + isGrounded;
        // Calculate how much time has passed since last update
        time = Date.now();
        const deltaTime = time - prevTime;

        // Update y-position based speed in y-direction
        // If we jump this.speed will be set to this.jumpSpeed
        this.y += this.speedY * deltaTime;
        // Gravity should always affect the player!
        // The ground check will make sure we don't fall through the floor
        this.y += this.gravity * deltaTime;
        // Make sure to reduce our player's speed in y by gravity!
        this.speedY += this.gravity * deltaTime;

        // Only allow the player to jump if he is on the ground
        if (controller1.up && isGrounded) {
            // Set the player y-speed to jump speed
            this.speedY = this.jumpSpeed;
        };

        if (controller1.right) { this.dx += 0.5 };
        if (controller1.left) { this.dx -= 0.5 };

        this.x += this.dx;
        // this.y += this.dy;
        this.dx *= 0.9;
        this.dy *= 0.9;

        // Ground check
        if (this.y >= canvas.height - 50) {
            this.y = canvas.height - 50;
            isGrounded = true;
        } else {
            isGrounded = false;
        }

        this.draw();

        // Store the current time to use for calculation in next update
        prevTime = Date.now();
    }

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
        addEventListener('mousemove', keyEvent)
    }
}

let main1 = new Main(canvas.width / 2, canvas.height / 2, 50, 50)
let controller1 = new Controller();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    main1.update();
    requestAnimationFrame(animate)
}

function updatePos() {
    main1.newPos();
}

animate()
setInterval(updatePos, 10)

// let boxes = 0;
// const lastDraws = [];

// const items = {
//     food: [
//         {name: "apple",
//         effect: "heal",
//         color: "red"
//         },
//         {name: "green_apple",
//         effect: "heal",
//         color: "green"
//         }
//     ]
// }
// let fooditems = [...items.food];

// // Pick the food once
// let currentFood = fooditems[Math.floor(Math.random() * fooditems.length)];

// function drawFood() {
//     // Use the same food every time
//     ctx.beginPath();
//     ctx.arc(200, 200, 10, 0, Math.PI * 2);
//     ctx.fillStyle = currentFood.color;
//     ctx.fill();
//     ctx.closePath();

// }
// drawFood();
// fruitbtn.addEventListener("click", drawFood);

// function drawPlayer() {
//     ctx.beginPath();
//     ctx.rect(player.x, player.y, player.width, player.height);
//     ctx.fillStyle = player.color;
//     ctx.fill();
//     ctx.closePath();
// }

// player.newPos = function() {
//     player.jumpSpeed += player.gravity;
//     player.x += player.speedX;

// };

// player.update = function() {
//     player.x += player.speedX;
//     player.y += player.speedY;
// };

    // lastDraws.push({ x: player.x, y: player.y, width: player.width, height: player.height, color: player.color });
    // boxes = player.speed / 1.2;

//     // Remove old draws immediately, no timeout
//     while (lastDraws.length > boxes) {
//         lastDraws.shift();
//     }

//     player.newPos = function() {
//         if (!player.onGround) {
//             player.gravitySpeed += player.gravity;
//             player.y += player.gravitySpeed;
//             if (player.y + player.height > 215) { // Ground level
//                 player.y = 185;
//                 player.gravitySpeed = 0;
//                 player.onGround = true;
//             }
//         }
//     }
// }

// // To erase the canvas and redraw only the last boxes amount of draws:
// function redrawLastDraws() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     lastDraws.forEach((draw, idx) => {
//         ctx.fillStyle = idx === lastDraws.length - 1 ? 'black' : 'grey'; // Last box is black, rest are grey
//         ctx.fillRect(draw.x, draw.y, draw.width, draw.height);
//     });
// }

// drawPlayer();

// // -----------------------move

// document.addEventListener('keydown', function(event) {
//     if (player.y == 185){
//         player.onGround = true;
//     }
//     switch (event.key) {
//         case 'ArrowUp':
//             if (player.onGround) {
//                 // -----------jumping
//                 player.y -= player.jump;
//                 player.onGround = false;
//                 player.gravitySpeed = 0; // Reset gravity speed when jumping
//                 player.newPos = function() {
//                     if (!player.onGround) {
//                         player.gravitySpeed += player.gravity;
//                         player.y += player.gravitySpeed;
//                         if (player.y + player.height > 215) { // Ground level
//                             player.y = 185;
//                             player.gravitySpeed = 0;
//                             player.onGround = true;
//                         }
//                     }
//                 }
//             }
//             console.log(player.onGround);
//             break;
//         case 'ArrowDown':
//             if (player.y + player.height + player.speed <= canvas.height) player.y += player.speed;
//             break;
//         case 'ArrowLeft':
//             if (player.x - player.speed >= boundaryStart) player.x -= player.speed;
//             break;
//         case 'ArrowRight':
//             if (player.x + player.width + player.speed <= canvas.width) player.x += player.speed;
//             break;
//     }

//     coordsElem.innerHTML = "x " + player.x + " y " + player.y + " onGround " + player.onGround;
//     if (player.y == 185 && player.x == 185)
//     {
//         sound.play();
//     }


// });
// setInterval(() => {
//     player.newPos();
//         drawPlayer();      // <-- Add this line
//     redrawLastDraws();
//     drawFood();
// }, 50);

// getThat.addEventListener("click", daButton);

// function daButton() {
//     console.log(input.value);
//     player.speed = Number(input.value);
// }