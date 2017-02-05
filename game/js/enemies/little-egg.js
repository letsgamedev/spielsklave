/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
LittleEgg is one of the first enemies in game

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The little egg enemy object
*/
var LittleEgg = function(world, x, y) {
	var egg = game.add.sprite(x, y, "atlas", "little_egg_hatch_0", world.middleLayer);
	egg.strength = 1;
	addAnimation(egg, "stand_down", "little_egg_stand_down", 2, 3, true);
	addAnimation(egg, "stand_up", "little_egg_stand_up", 2, 3, true);
	addAnimation(egg, "stand_left", "little_egg_stand_left", 2, 3, true);
	addAnimation(egg, "stand_right", "little_egg_stand_right", 2, 3, true);
	addAnimation(egg, "walk_down", "little_egg_walk_down", 4, 12, true);
	addAnimation(egg, "walk_up", "little_egg_walk_up", 4, 12, true);
	addAnimation(egg, "walk_left", "little_egg_walk_left", 4, 12, true);
	addAnimation(egg, "walk_right", "little_egg_walk_right", 4, 12, true);
	addAnimation(egg, "hatch", "little_egg_hatch", 7, 24, false);
	
	var EGG = 0;
	var HATCHING = 1;
	var HATCHED = 2;

	egg.status = EGG;

	
	//Configure physics
	game.physics.ninja.enable(egg, 1);
    egg.body.drag = 0.1;
    egg.body.immovable = true;
    var lookDirection = DOWN;
	
	//Config body size and alignment
	egg.body.setSize(12,12);
	egg.anchor.set(0.5,0.6);

	var xDir = 0;
	var yDir = 0;
	var moveTime = 0;
	var speed = 40;
	var isBushSet = false;

	egg.update = function() {
		moveTime -= DT;
		switch(egg.status) {
			case EGG:
				hatchCheck();
			break;
			case HATCHING:
				if (egg.frameName == "little_egg_hatch_4" && isBushSet == false) {
					isBushSet = true;
					game.add.sprite(egg.x - 11, egg.y - 13, "atlas", "little_egg_shell_0", world.bottomLayer);
	
				}
			break;
			case HATCHED:
				if (moveTime <= 0) setNewMove();
				egg.body.x += DT * speed * xDir;
				egg.body.y += DT * speed * yDir;
			break;
		}		
	}

	function hatchCheck() {
		var distancePlayer = game.math.distance(world.player.x, world.player.y, egg.body.x, egg.body.y);
		var distancePig = game.math.distance(world.pig.x, world.pig.y, egg.body.x, egg.body.y);
		var dist = Math.min(distancePlayer, distancePig);

		if (dist < 40) {
			var anim = egg.animations.play("hatch");
			egg.status = HATCHING
			anim.onComplete.add(function(){
				egg.status = HATCHED;
			});
		}
	}

	function setNewMove() {
		switch (game.rnd.between(0,7)) {
			case 0: xDir = 1; yDir = 0; lookDirection = RIGHT; break;
			case 1: xDir = -1; yDir = 0; lookDirection = LEFT; break;
			case 2: xDir = 0; yDir = 1; lookDirection = DOWN; break;
			case 3: xDir = 0; yDir = -1; lookDirection = UP; break;
			default: xDir = 0; yDir = 0;
		}

		moveTime = 0.25 + Math.random() * 1; 
		setAnimation();
	}

	function setAnimation() {
		var kind = (xDir == 0 && yDir == 0) ? "stand_" : "walk_";
		egg.animations.play(kind + lookDirection);
		
	}

	return egg;
}