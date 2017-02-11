var canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

var context = canvas.getContext("2d");
var score = 0;

var shoot = function (event) {
	if (shot.active) { return; }

	var x = event.x - canvas.offsetLeft;
	var y = event.y - canvas.offsetTop;
	shot.x = x;
	shot.y = y;

	shot.active = true;
	shot.radius = 100;
};

var resetTarget = function () {
	target.speed = 250 + score;
	target.x = canvas.width + target.radius;
	target.y = Math.random() * canvas.height;

	target.radius = 50 - score;
	if (target.radius < 25) {
		target.radius = 25;
	}
};

canvas.addEventListener("mousedown", shoot);

var target = {
	radius: 0,
	speed: 0,
	x: 0,
	y: 0
};

var shot = {
	active: false,
	radius: 0,
	x: 0,
	y: 0
};

var gameOver = function () {
	score = 0;
	resetTarget();
};

var update = function (delta) {
	// Update the target
	var seconds = delta / 1000;
	target.x -= target.speed * seconds;
	if (target.x <= -target.radius) {
		gameOver();
	}

	// Update ths shot
	if (shot.active) {
		// Decrease shot size
		var decrease = delta / 5;
		shot.radius = shot.radius - decrease;

		// Check for collision
		if (shot.radius <= 0) {
			shot.active = false;

			if (Math.abs(shot.x - target.x) <= target.radius) {
				if (Math.abs(shot.y - target.y) <= target.radius) {
					score++;

					resetTarget();
				}
			}
		}
	}
};

var render = function () {
	// Fill canvas
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw the target
	context.beginPath();
	context.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
	context.fillStyle = "rgb(255, 0, 0)";
	context.fill();

		// Draw the shot
	if (shot.active) {
	
		context.beginPath();
		context.arc(shot.x, shot.y, shot.radius, 0, Math.PI * 2);
		context.fillStyle = "rgba(0, 255, 0, 0.5)";
		context.fill();
	}

	// Render the score
	context.fillStyle = "white";
	context.font = "24px Verdana";
	context.fillText(score, 16, canvas.height - 24);
};

var now = Date.now();
var tick = function () {
	var delta = Date.now() - now;

	update(delta);
	render();

	now = Date.now();
};

resetTarget();

var fps = 60;
var interval = 1000 / fps;
setInterval(tick, interval);
