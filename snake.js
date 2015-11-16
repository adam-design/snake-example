function doTouchStart(event) {
    event.preventDefault();

    var x = event.targetTouches[0].pageX;
    var y = event.targetTouches[0].pageY;
    hero.x = x - 36;
    hero.y = y - 36;
}



// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 384;
document.body.appendChild(canvas);
canvas.addEventListener("touchmove", doTouchStart, false);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/water-background.png";

// Hero image
var heroReady = false;

var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/shark.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/fish.png";

// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: canvas.width / 2,
    y: canvas.height / 2

};
var monster = {};
var fishEaten = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {


    // Throw the monster somewhere on the screen randomly
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
    }

    if (hero.x > canvas.width) { // Player goes over right boundary
        hero.x = 0;
    }

    if (hero.x < 0 - 36) { // Player goes past left boundary
        hero.x = canvas.width;
    }

    if (hero.y > canvas.height + 30) { // Player goes past top }
        hero.y = 0;
    }

    if (hero.y < 0 - 30) { // Player goes below bottom }
        hero.y = canvas.height;
    }

    // Are they touching?
    if (
        hero.x <= (monster.x + 32) && monster.x <= (hero.x + 32) && hero.y <= (monster.y + 32) && monster.y <= (hero.y + 32)
    ) {
        ++fishEaten;
        reset();
    }
};

// Draw everything
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Fish eaten: " + fishEaten, 32, 32);
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};



// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();

main();