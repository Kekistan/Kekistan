_inited = false;
_loaded = false;
_intervalId = null;

data = {
	"units" : [		
		{ "type" : 1, "name" : "Big Red", "filename" : "Feminist.png", "image" : null, "width" : 140, "height" : 140, "speed" : 3, "health" : 200, "attack" : 3 },
		{ "type" : 0, "name" : "Sargon", "filename" : "Sargon.jpg", "image" : null, "width" : 150, "height" : 150, "speed" : 3, "health" : 300, "attack" : 3, "points" : 300 },
		{ "type" : 0, "name" : "Pepe", "filename" : "Pepe.jpg", "image" : null, "width" : 70, "height" : 70, "speed" : 5, "health" : 100, "attack" : 3, "points" : 100 },
		{ "type" : 0, "name" : "God Emperor Trump", "filename" : "GodEmperor.jpg", "image" : null, "width" : 200, "height" : 200, "speed" : 1, "health" : 1000, "attack" : 2, "points" : 600 },
		{ "type" : 1, "name" : "Aids Skrillex", "filename" : "AidsSkrillex.jpg", "image" : null, "width" : 80, "height" : 80, "speed" : 4, "health" : 100, "attack" : 1 },
		{ "type" : 1, "name" : "Carl the Cuck", "filename" : "Cuck.jpg", "image" : null, "width" : 70, "height" : 70, "speed" : 5, "health" : 80, "attack" : 1 }
	],
	"enemies" : [
		{ "name" : "Feminist", "x" : .9, "y" : .2 },
		{ "name" : "Feminist", "x" : .9, "y" : .4 },
		{ "name" : "Feminist", "x" : .9, "y" : .6 },
		{ "name" : "Feminist", "x" : .9, "y" : .8 }
	],
	"points" : { "current" : 0, "total" : 1000 },
	"state" : 0,
	"enemyCount" : 4
}

var images = 0, loaded = 0;

function imageLoaded() {
	loaded++;

	if (images == loaded) {
		init();
	}
}

for (var i = 0; i < data.units.length; i++) {
	images++;

	var d = data.units[i];
	d.image = new Image();
	d.image.onload = function() { imageLoaded(); }
	d.image.src = "Images/" + d.filename;
}

var units = [ ];
var enemies = [ ];


function init() {
	_inited = true;

	var c = document.getElementById('myCanvas');

	if (_loaded) {
		resetGame();
	}
}

function clearScreen() {
	var c = document.getElementById('myCanvas');
	var ctx = c.getContext('2d');

	ctx.clearRect(0, 0, c.width, c.height);
}

function updatePoints() {
	var elem = document.getElementById('points');
	elem.innerHTML = "Points: " + data.points.current + "/" + data.points.total;
}

function resetEnemies() {
	enemies = [ ];

	var names = [ ];
	for (var i = 0; i < data.units.length; i++) {
		if (data.units[i].type == 1) {
			names.push(data.units[i].name);			
		}
	}

	for (var i = 0; i < data.enemyCount; i++) {
		addEnemy(names[Math.floor(Math.random() * names.length)]);
	}
}

function clearUnits() {
	units = [ ];

	data.points.current = data.points.total;
	updatePoints();

	clearScreen();
	drawUnits();
}

function resetGame() {
	enemies = [ ];
	resetEnemies();

	data.points.current = data.points.total;
	updatePoints();

	reset();
}

function reset() {
	clearScreen();
	
	// reset units
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].dead = false;

		enemies[i].health = enemies[i].data.health;

		enemies[i].x = enemies[i].startX;
		enemies[i].y = enemies[i].startY;
	}

	for (var i = 0; i < units.length; i++) {
		units[i].dead = false;

		units[i].health = units[i].data.health;

		units[i].x = units[i].startX;
		units[i].y = units[i].startY;
	}

	// draw units
	drawUnits();
}

function drawUnit(ctx, unit) {
	if (unit.dead) {
		return;
	}

	var d = unit.data;
	ctx.drawImage(d.image, unit.x - d.width / 2, unit.y - d.height / 2, d.width, d.height);
}

function drawUnits() {
	var c = document.getElementById('myCanvas');
	var ctx = c.getContext('2d');

	for (var i = 0; i < enemies.length; i++) {		
		drawUnit(ctx, enemies[i]);
	}

	for (var i = 0; i < units.length; i++) {		
		drawUnit(ctx, units[i]);
	}
}

function start() {
	var btn = document.getElementById('btnStart');

	if (data.state == 0) {
		data.state = 1;
		btn.value = 'Stop';
	} else if (data.state == 1 || data.state == 2) {
		data.state = 0;
		reset();
		btn.value = 'Start';
	}

	document.getElementById('btnReset').disabled = (data.state == 1);
	document.getElementById('btnClear').disabled = (data.state == 1);
	var btns = document.getElementById('unitButtons');
	for (var i = 0; i < btns.children.length; i++) {
		btns.children[i].disabled = (data.state == 1);
	}
}

function loop() {
	if (!data || data.state != 1) {
		return;
	}
	
	for (var k = 0; k < 2; k++) {
		for (var i = 0; i < (k == 0 ? enemies.length : units.length); i++) {
			var datar = (k == 0 ? enemies[i] : units[i]);

			var min = -1;
			var target;
			var diffX, diffY;

			var lst = (k == 0 ? units : enemies);

			for (var j = 0; j < lst.length; j++) {
				if (!lst[j].dead) {
					var dx = lst[j].x - datar.x;
					var dy = lst[j].y - datar.y;

					var d = dx * dx + dy * dy;

					if (min == -1 || d < min) {
						target = lst[j];
						min = d;
						diffX = dx;
						diffY = dy;
					}
				}
			}

			if (target) {
				var min = Math.sqrt(min);

				if (min < datar.data.width / 2 + target.data.width / 2) {
					target.health -= datar.data.attack;				

					if (target.health <= 0) {
						target.dead = true;
					}
				} else {
					datar.x += diffX / min * datar.data.speed;
					datar.y += diffY / min * datar.data.speed;
				}
			}
		}
	}

	clearScreen();
	drawUnits();

	var alive = 0;
	for (var i = 0; i < units.length; i++) {
		if (!units[i].dead) {
			alive++;
		}		
	}

	var c = document.getElementById('myCanvas');
	var ctx = c.getContext('2d');

	if (alive == 0) {
		ctx.font = "30px Arial";
		ctx.fillText('You Lose!', c.width / 2, c.height / 2);

		data.state = 2;
	} else {
		alive = 0;

		for (var i = 0; i < enemies.length; i++) {
			if (!enemies[i].dead) {
				alive++;
			}
		}

		if (alive == 0) {
			ctx.font = "30px Arial";
			ctx.fillText('You Win!', c.width / 2, c.height / 2);

			data.state = 2;
		}
	}
}

function addUnit(val) {
	var d;

	for (var i = 0; i < data.units.length; i++) {
		if (data.units[i].name == val) {
			d = data.units[i];
		}
	}

	if (!d) {
		return;
	}

	if (data.points.current < d.points) {
		return;
	}

	var c = document.getElementById('myCanvas');
	var ctx = c.getContext('2d');

	var x = 100 * (Math.floor(units.length / 4) + 1);
	var y = ((units.length % 4) + .5) / 4 * c.height;

	var unit = { "startX" : x, "startY" : y, "x" : x, "y" : y, "dead" : false, "health" : d.health, "data" : d };
	units.push(unit);

	drawUnit(ctx, unit);

	data.points.current -= d.points;
	updatePoints();
}

function addEnemy(val) {
	var d;

	for (var i = 0; i < data.units.length; i++) {
		if (data.units[i].name == val) {
			d = data.units[i];
		}
	}

	if (!d) {
		return;
	}

	var c = document.getElementById('myCanvas');
	var ctx = c.getContext('2d');

	var x = c.width - 100 * (Math.floor(enemies.length / 4) + 1);
	var y = ((enemies.length % 4) + .5) / 4 * c.height;

	var enemy = { "startX" : x, "startY" : y, "x" : x, "y" : y, "dead" : false, "health" : d.health, "data" : d };
	enemies.push(enemy);

	drawUnit(ctx, enemy);
}

window.onload=function() {
	_loaded = true;

	// add unit buttons
	var elem = document.getElementById('unitButtons');
	for (var i = 0; i < data.units.length; i++) {
		if (data.units[i].type == 0) {
			var name = data.units[i].name;
			var e = document.createElement('button');
			elem.appendChild(e);			
			var txt = document.createTextNode(name + " - " + data.units[i].points);
			e.appendChild(txt);
			e.unitName = name;
			e.onclick = function() { addUnit(this.unitName); };			
		}
	}

	// get game ready
	if (_inited) {
		resetGame();
	}

	// start game loop
	_intervalId = setInterval(loop, 1000 / 30);
}