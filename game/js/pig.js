/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
This is the pig charakter.
The player can take over the controll of
this or even a second player can handle
this character with the mouse.player

In single player the pig is controled 
like the demon.

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The pig object
*/
var Pig = function(world, x, y) {
	var pig = game.add.sprite(x, y, "atlas", "pig_walk_down_1", world.middleLayer);
	
	//Configure physics
	game.physics.ninja.enable(pig, 1, 0, 4);
    pig.body.drag = 0.001;
    pig.damageSave = true;
	
    //Config body size and alignment
	pig.anchor.set(0.5, 0.8);
	pig.body.setSize(8,8);
	pig.ySortOffset = -5;

	//Prepare animations
	pig.animations.add("stand_up", ["pig_walk_up_1"], 24, true);
	pig.animations.add("stand_down", ["pig_walk_down_1"], 12, true);
	pig.animations.add("stand_left", ["pig_walk_left_1"], 12, true);
	pig.animations.add("stand_right", ["pig_walk_right_1"], 12, true);

	addAnimation(pig, "walk_down", "pig_walk_down", 4, 12, true);
	addAnimation(pig, "walk_up", "pig_walk_up", 4, 12, true);
	addAnimation(pig, "walk_left", "pig_walk_left", 4, 12, true);
	addAnimation(pig, "walk_right", "pig_walk_right", 4, 12, true);
	pig.animations.play("stand_down");

	//Private variables
	var speed = 110;
	var minDis = 30;
	var teleportDistance = 90;
	var lookDirection = DOWN;
	var walkSave = 0;
	var sameDirectionCount = 0;
	var lastDirection = 0;

	/**
	The pig will follow the player if its not controlled by a human.
	May be some pathfinding will be added later.
	*/
	pig.update = function() {
		//Yes, this function is a bit messi
		pig.damageSave = world.player.state != STATES.STONE;

		if (world.player.state == STATES.STONE && world.cursor.visible == false) return;

		var follow = world.cursor.visible ? world.cursor : world.player.body;
		minDis = world.cursor.visible ? 2 : 30;
		var distance = game.math.distance(follow.x, follow.y, pig.body.x, pig.body.y);

		var dirKey = Math.round(game.math.angleBetweenPoints(pig, follow) / Math.PI * 2);

		switch (dirKey) {
			case 0: lookDirection = RIGHT; break;
			case 1: lookDirection = DOWN; break;
			case -2:
			case 2: lookDirection = LEFT; break;
			case -1: lookDirection = UP; break;
		}

		if (distance > teleportDistance && world.cursor.visible == false) {
			pig.teleport();
		}

		if (distance > minDis){
			var direction = {
				x: (follow.x - pig.body.x) / distance,
				y: (follow.y - pig.body.y) / distance
			}

			var speedIntern = speed * 0.49; 

			pig.body.x += direction.x * speedIntern * DT;
			pig.body.y += direction.y * speedIntern * DT;



			if (lastDirection == dirKey) sameDirectionCount++;
			else sameDirectionCount = 0;

			if (sameDirectionCount > 5)
				pig.animations.play("walk_" + lookDirection);

			lastDirection = dirKey;
			walkSave = 0;
		} else {
			if (walkSave < 6) {
				walkSave++;
			} else {
				pig.animations.play("stand_" + lookDirection);
			}
			
			
		}


	}

	pig.onHit = function(self, enemy) {
		//GenPool.onHit;
		console.log(enemy.harmless)
		if (!enemy.harmless) {
			world.player.fromStone();
		}
		
	}

	/*
	Handels the input from Pad class. Has to be called every frame.
	*/
	pig.input = function() {
		if (world.player.state == STATES.STONE && world.cursor.visible == false) {

			var stand = true;
			var newAnimation = "stand";

			var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

			//Process movement and animation
			if (!(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
				function setMove(padKey,axis, multi,dirID) {
					if (Pad.isDown(padKey)) {
						pig.body[axis] += DT * speed * diagonalFactor * multi;
						stand = false;
						lookDirection = dirID;
					}
				}
				setMove(Pad.LEFT, "x", -1, LEFT);
				setMove(Pad.RIGHT, "x", 1, RIGHT);
				setMove(Pad.UP, "y", -1, UP);
				setMove(Pad.DOWN, "y", 1, DOWN);

				if (pig.animations.currentAnim.name.includes("stand") || diagonalFactor == 1) {
					pig.animations.play("walk_" + lookDirection);
				}
			}
		
			if (stand) {
				pig.animations.play("stand_" + lookDirection);
			}


			if (Pad.justDown(Pad.A)) {
				
			}
			if (Pad.justDown(Pad.X)) {
				
			}
		}
		

	}

	pig.teleport = function() {
		//puff!
		var dis = 16;
		var xOff = 0;
		var yOff = 0;
		switch (world.player.lookDirection) {
			case UP: 	yOff = dis; break;
			case DOWN:  yOff = -dis; break;
			case LEFT:  xOff = dis; break;
			case RIGHT: xOff = -dis; break;
		}

		PigSmoke(pig, world);
		
		

		pig.body.x = world.player.body.x + xOff;
		pig.body.y = world.player.body.y + yOff;

		PigSmoke(pig.body, world);
	}

	pig.tweenToPlayer = function() {
		var tween = game.add.tween(pig.body).to({
			x: world.player.x,
			y: world.player.y
		}, 500, Phaser.Easing.Default, true);
	}

	return pig;
};

var ReflectionPig = function(world) {
	var pig = world.pig;

	var reflection = game.add.sprite(0, 0, "atlas", "pig_walk_down_1", world.reflectionLayer);
	reflection.scale.y = -1;

	reflection.animations.add("stand_up", ["pig_walk_up_1"], 12, true);
	reflection.animations.add("stand_down", ["pig_walk_down_1"], 12, true);
	reflection.animations.add("stand_left", ["pig_walk_left_1"], 12, true);
	reflection.animations.add("stand_right", ["pig_walk_right_1"], 12, true);
	addAnimation(reflection, "walk_down", "pig_walk_down", 4, 10, true);
	addAnimation(reflection, "walk_up", "pig_walk_up", 4, 10, true);
	addAnimation(reflection, "walk_left", "pig_walk_left", 4, 10, true);
	addAnimation(reflection, "walk_right", "pig_walk_right", 4, 10, true);
	reflection.alpha = 0.75;

	reflection.update = function() {
		reflection.x = pig.x - 10;
		reflection.y = pig.y + 24;

		reflection.animations.play(pig.animations.currentAnim.name);
	}

	return reflection;
}

var PigSmoke = function(xy, world) {
	var smoke = game.add.sprite(xy.x, xy.y, "atlas", "pig_smoke_0", world.middleLayer);
		smoke.anchor.set(0.6);
		smoke.ySortOffset = 5;
		smoke.anim = addAnimation(smoke, "play", "pig_smoke", 5, 12, false);
		smoke.anim.onComplete.add(destroyWrap(smoke));
		smoke.animations.play("play");
}