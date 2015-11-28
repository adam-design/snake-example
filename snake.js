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

// Knife Image
var knifeImageReady = false;
var knifeImage = new Image();
knifeImage.onload = function () {
    knifeReady = true;
};
monsterImage.src = "images/fish.png";
knifeImage.src = "images/knife.png";

// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 32,
    offsetx: 40,
    height: 32,
    offsety: 12

};
var monster = {
    speed: 4,
    width: 16,
    height: 16,
    trash: false
};
var fishEaten = 0;
var livesLost = 3;

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


    // Throw the monster somewhere on the right side of the screen randomly
    monster.x = canvas.width;
    monster.y = 32 + (Math.random() * (canvas.height - 64));
    var trashtest = Math.floor(Math.random() * 3 + 1);

    if (trashtest == 1)
        monster.trash = true;
    else
        monster.trash = false;


}

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

    if (monster.x < 0 - 36) { // Player goes past left boundary
        reset();
    }

    if (hero.y > canvas.height + 30) { // Player goes past top }
        hero.y = 0;
    }

    if (hero.y < 0 - 30) { // Player goes below bottom }
        hero.y = canvas.height;
    }

    // Are they touching?
    if (
        (hero.x + hero.offsetx) <= (monster.x + monster.width) && monster.x <= (hero.x + hero.width + hero.offsetx) && (hero.y + hero.offsety) <= (monster.y + monster.height) && monster.y <= (hero.y + hero.height + hero.offsety)
    ) {
        if (monster.trash) {
            --livesLost;

        } else {
            ++fishEaten;

        }
        reset();
    }

};

// Draw everything
var render = function () {
    var debug = false;
    monster.x -= monster.speed;
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady && knifeReady) {

        if (monster.trash) {
            ctx.drawImage(knifeImage, monster.x, monster.y);
        } else
            ctx.drawImage(monsterImage, monster.x, monster.y);


    }
    if (debug) {
        ctx.strokeRect(monster.x, monster.y, monster.width, monster.height);
        ctx.strokeRect(hero.x + hero.offsetx, hero.y + hero.offsety, hero.width, hero.height);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Fish swallowed: " + fishEaten, 32, 32);
    ctx.fillText("Lives left: " + livesLost, 60, 80);

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