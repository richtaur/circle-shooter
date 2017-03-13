// What's a game without a score?
var score = 0;

// ... but we also need graphics, so create a canvas
var canvas = document.createElement("canvas");

// Assign canvas dimensions (in pixels)
canvas.width = 500;
canvas.height = 500;

// Add the canvas to the document's body element
document.body.appendChild(canvas);

// Create an object to hold the target properties
var target = {
	radius: 0,
	speed: 0,
	x: 0,
	y: 0
};

// Create an object to hold the player shot properties
var shot = {
	active: false,
	radius: 0,
	speed: 250,
	x: 0,
	y: 0
};

// Create a function to reset the target's properties
var resetTarget = function () {
	// Set target speed
	target.speed = 150;

	// Make the target faster as the score increases
	target.speed = target.speed + score;

	// Set the target's radius (circle size)
	target.radius = 50;

	// Move the target to a random position along the X axis
	target.x = Math.random() * canvas.width;

	// Move the target just above the canvas
	target.y = -target.radius;

	// Make the target smaller as the score increases
	target.radius -= score;

	// Don't let the target get TOO small. LET'S NOT GO CRAZY
	if (target.radius < 25) {
		target.radius = 25;
	}
};

// Create a function to spawn a shot for the player
var shoot = function (event) {
	// Back out if the shot is already doing its thing
	if (shot.active) { return; }

	// Capture the position of the click, accounting for canvas position
	var x = event.x - canvas.offsetLeft;
	var y = event.y - canvas.offsetTop;

	// Center the shot on the click position
	shot.x = x;
	shot.y = y;

	// Activate the shot
	shot.active = true;
	shot.radius = 100;
};

// When the player clicks on the canvas, fire the shoot function
canvas.addEventListener("mousedown", shoot);

// Create a function to start a new game
var newGame = function () {
	score = 0;
	shot.active = false;

	resetTarget();
};

// Create a function to update game properties
var update = function (delta) {
	// Get the seconds that have passed so we can multiply by speed
	var seconds = delta / 1000;

	// Move the target along the X axis
	target.y += target.speed * seconds;

	// When the target leaves the canvas, start a new game
	if (target.y > canvas.height + target.radius) {
		newGame();
	}

	// Update the shot
	if (shot.active) {
		// Decrease shot size
		var decrease = shot.speed * seconds;
		shot.radius -= decrease;

		// Check if the shot is done shrinking
		if (shot.radius <= 0) {
			// Deactivate the shot
			shot.active = false;

			// Check if the shot is within range of the target
			// Whoa math what IT'S OK POWER THROUGH IT
			var distance = Math.sqrt(Math.pow(shot.x - target.x, 2) + Math.pow(shot.y - target.y, 2));
			if (distance <= target.radius) {
				// SCORE! Good job
				// Increment player score by 1
				score++;

				resetTarget();
			}
		}
	}
};

// Create a canvas context that we can use to draw things
var context = canvas.getContext("2d");

// Create a function to draw the graphics
var render = function () {
	// Set the "fill" color to paint with pixels
	context.fillStyle = "black";

	// Fill the whole canvas with a rectangle
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Start a "path" for the target to let us draw a circle
	context.beginPath();

	// Set path for an "arc" which will be a full circle
	context.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
	context.fillStyle = "red";
	context.fill();

	// Draw the shot
	if (shot.active) {
		context.beginPath();
		context.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2);
		context.fillStyle = "white";
		context.fill();
	}

	// Render the score
	context.fillStyle = "white";
	context.font = "24px Verdana";
	context.textAlign = "center";
	context.fillText(score, canvas.width / 2, 32);
};

// Get the current time
var now = Date.now();

// Create a function to run the game on an interval
var tick = function () {
	// Get the time delta (how much time has passed) so we can make calculations
	var delta = Date.now() - now;

	// Update the game objects
	update(delta);

	// Draw the graphics
	render();

	// Get the new time for the next tick
	now = Date.now();
};

// Get the frames per second (FPS) that we want to target
var fps = 60;

// Calculate how often we should fire the tick
// This number will be about 16 milliseconds (60 FPS)
var interval = 1000 / fps;

// Run the tick on an interval (see also: requestAnimationFrame)
setInterval(tick, interval);

// You got this
newGame();

// Now you've made a game. Great job! LEVEL UP
// -Matt Hackett (http://matthackedit.com/)
