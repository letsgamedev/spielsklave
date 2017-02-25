/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
This is the Player aka the demon contructor.

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The player object
*/
var Player = function(world, x, y) {
	var player = game.add.sprite(x, y, "atlas", "dengel_walk_down_1", world.middleLayer);
	
	//Configure physics
	game.physics.ninja.enable(player, 1);
    player.body.drag = 0.001;
	
	//Config body size and alignment
	player.body.setSize(12,12);
	player.anchor.set(0.5,0.6);

	player.state = STATES.NORMAL;
	player.maxHP = 8;
	player.hp = 8;

	player.item1 = null;
	player.item2 = null;

	player.item1 = Scythe(player, world);

	//Prepare animations
	player.animations.add("stand_up", ["dengel_stand_up_0"], 12, true);
	player.animations.add("stand_down", ["dengel_stand_down_0"], 12, true);
	player.animations.add("stand_left", ["dengel_stand_left_0"], 12, true);
	player.animations.add("stand_right", ["dengel_stand_right_0"], 12, true);
	addAnimation(player, "walk_down", "dengel_walk_down", 8, 20, true);
	addAnimation(player, "walk_up", "dengel_walk_up", 8, 20, true);
	addAnimation(player, "walk_left", "dengel_walk_left", 8, 20, true);
	addAnimation(player, "walk_right", "dengel_walk_right", 8, 20, true);
	
	
	player.animations.play("stand_down");
	
	//Private variables
	var speed = 110;
	var lookDirection = DOWN;
	player.lookDirection = lookDirection;
	var shell = null;
	var inChange = false;
	player.damageSave = false;

	player.humanInput = true;

	player.update = function() {
		if (player.item1) player.item1.update();
		if (player.item2) player.item2.update();
	}

	console.log(player.body);

	/*
	Handels the input from Pad class. Has to be called every frame.
	*/
	player.input = function() {
		var stand = true;
		var newAnimation = "stand";

		var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

		

		//Process movement and animation
		if (player.state !== STATES.STONE && player.state !== STATES.INUSE && !(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
			function setMove(padKey,axis, multi,dirID) {
				if (Pad.isDown(padKey)) {
					player.body[axis] += DT * speed * diagonalFactor * multi;
					stand = false;
					lookDirection = dirID;
					player.lookDirection = lookDirection;
				}
			}

			setMove(Pad.LEFT, "x", -1, LEFT);
			setMove(Pad.RIGHT, "x", 1, RIGHT);
			setMove(Pad.UP, "y", -1, UP);
			setMove(Pad.DOWN, "y", 1, DOWN);

			if (player.animations.currentAnim.name.indexOf("stand") !== -1 || diagonalFactor == 1) {
				player.animations.play("walk_" + lookDirection);
				player.state = STATES.WALK;
			}
		}
		
		if (stand && player.state != STATES.STONE && player.state !== STATES.INUSE) {
			player.animations.play("stand_" + lookDirection);
			player.state = STATES.STAND;
		}


		//Turn on/off multiplayer, will detroy stone at the moment
		if (Pad.justDown(Pad.SELECT)) {
			world.cursor.visible = !world.cursor.visible;
			/*if (player.humanInput == false && world.cursor.visible) {
				setHumanInput(true);
			}*/
		}

		//Swap between stone and flesh
		if (Pad.justDown(Pad.X)) {
			swapStone();
		}

		//Item slot 1
		if (player.state != STATES.INUSE && player.state != STATES.STONE) {
			if (Pad.justDown(Pad.Y) && player.item1) {
				player.item1.action();
			}

			if (Pad.justDown(Pad.B) && player.item2) {
				player.item2.action();
			}
		}
		

	}

	player.onHit = GenPool.onHit;

	//Helper for turn on/off stone swap
	function setHumanInput(isOn) {
		player.humanInput = isOn;
		if (isOn) {
			fromStone();
		} else {
			toStone();
		}
	}

	function swapStone() {
		if (inChange) return;
		if (player.state == STATES.STONE) {
			fromStone();
			world.pig.teleport();
		} else {
			toStone();
		}
	}

	//Creates a stone statue an replaces the demon char
	function toStone() {
		player.visible = false;
		player.state = STATES.STONE;
		shell = game.add.sprite(player.body.x - 32, player.body.y - 32, "atlas", "player_to_stone_0", world.middleLayer);
		game.physics.ninja.enable(shell);
		shell.body.bounce = 0;
	    shell.body.drag = 0;
	    shell.body.oldPos = {x: shell.body.x, y: shell.body.y}
		shell.body.setSize(12,12);
		shell.anchor.set(0.5,0.6);

		sound("player_to_stone");

		shell.sound = null

		inChange = true;


		shell.update = function() {
			var dx = shell.body.x - shell.body.oldPos.x;
			var dy = shell.body.y - shell.body.oldPos.y;

			if (dx != 0 || dy != 0) {
				if (shell.sound == null) shell.sound = sound("stone_push", 1, true);
			} else {
				if (shell.sound != null) {
					shell.sound.stop();
					shell.sound.destroy();
					shell.sound = null;
				}
			}

			shell.body.oldPos.x = shell.body.x;
			shell.body.oldPos.y = shell.body.y;

			player.body.x = shell.x;
			player.body.y = shell.y;
		}

		
		shell.fromStone = shell.animations.add("from_stone", [
			"dengel_from_stone_0",
			"dengel_from_stone_1",
			"dengel_from_stone_2",
			"dengel_from_stone_3",
			"dengel_from_stone_4",
			"dengel_from_stone_5",
			"dengel_from_stone_6",
			"dengel_from_stone_7",
			"dengel_from_stone_8",
			"dengel_from_stone_9",
			], 24, false, true);
		shell.fromStone.onComplete.add(function(){
			setTimeout(function(){
				if (shell.sound) shell.sound.destroy();
				inChange = false;
				shell.destroy();
			},10)
			
		});
		shell.toStone = shell.animations.add("to_stone", ["dengel_to_stone_0", "dengel_to_stone_1", "dengel_to_stone_2", "dengel_to_stone_3", "dengel_to_stone_4"], 24, false, true);
		shell.toStone.onComplete.add(function(){
			inChange = false;
			
		});
		shell.animations.play("to_stone");
		player.shell = shell;

		
	}

	//shatters the stone statue and get back the demon char
	function fromStone() {
		if (player.state == STATES.STONE) {
			shell.body.y+=1;
			player.state = STATES.NORMAL;
			inChange = true;
			shell.animations.play("from_stone");
			player.visible = true;

			sound("player_from_stone");
		}
	}

	player.fromStone = fromStone;

	return player;
};

var ReflectionPlayer = function(world) {
	var player = world.player;
	console.log(player)

	var reflection = game.add.sprite(0, 0, "atlas", "player_walk_down_1", world.reflectionLayer);
	reflection.scale.y = -1;

	reflection.animations.add("stand_up", ["player_walk_up_1"], 12, true);
	reflection.animations.add("stand_down", ["player_walk_down_1"], 12, true);
	reflection.animations.add("stand_left", ["player_walk_left_1"], 12, true);
	reflection.animations.add("stand_right", ["player_walk_right_1"], 12, true);
	addAnimation(reflection, "walk_down", "player_walk_down", 4, 10, true);
	addAnimation(reflection, "walk_up", "player_walk_up", 4, 10, true);
	addAnimation(reflection, "walk_left", "player_walk_left", 4, 10, true);
	addAnimation(reflection, "walk_right", "player_walk_right", 4, 10, true);
	reflection.alpha = 0.75;

	reflection.update = function() {
		reflection.x = player.x - 32;
		reflection.y = player.y + 54;

		reflection.animations.play(player.animations.currentAnim.name);
	}

	return reflection;
}
