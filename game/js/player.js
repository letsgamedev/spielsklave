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
	var player = game.add.sprite(x, y, "atlas", "player_walk_down_1", world.middleLayer);
	
	//Configure physics
	game.physics.ninja.enable(player, 1);
    player.body.drag = 0.1;
	
	//Config body size and alignment
	player.body.setSize(12,12);
	player.anchor.set(0.5,0.6);

	player.state = STATES.NORMAL;

	//Prepare animations
	player.animations.add("stand_up", ["player_walk_up_1"], 12, true);
	player.animations.add("stand_down", ["player_walk_down_1"], 12, true);
	player.animations.add("stand_left", ["player_walk_left_1"], 12, true);
	player.animations.add("stand_right", ["player_walk_right_1"], 12, true);
	addAnimation(player, "walk_down", "player_walk_down", 4, 12, true);
	addAnimation(player, "walk_up", "player_walk_up", 4, 12, true);
	addAnimation(player, "walk_left", "player_walk_left", 4, 12, true);
	addAnimation(player, "walk_right", "player_walk_right", 4, 12, true);
	player.animations.play("stand_down");
	
	//Private variables
	var speed = 110;
	var lookDirection = DOWN;
	var shell = null;
	var inChange = false;
	player.damageSave = false;

	player.humanInput = true;

	/*
	Handels the input from Pad class. Has to be called every frame.
	*/
	player.input = function() {
		var stand = true;
		var newAnimation = "stand";

		var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

		

		//Process movement and animation
		if (player.state !== STATES.STONE && !(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
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
		
		if (stand && player.state != STATES.STONE) {
			player.animations.play("stand_" + lookDirection);
			player.state = STATES.STAND;
		}


		//Turn on/off multiplayer, will detroy stone at the moment
		if (Pad.justDown(Pad.JUMP)) {
			world.cursor.visible = !world.cursor.visible;
			/*if (player.humanInput == false && world.cursor.visible) {
				setHumanInput(true);
			}*/
		}

		//Swap between stone and flesh
		if (Pad.justDown(Pad.SHOOT)) {
			swapStone();
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

		TEST = shell.body;
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
		}

		
		shell.fromStone = shell.animations.add("from_stone", [
			"player_from_stone_0",
			"player_from_stone_1",
			"player_from_stone_2",
			"player_from_stone_3",
			"player_from_stone_4",
			"player_from_stone_5",
			"player_from_stone_6",
			"player_from_stone_7",
			"player_from_stone_8",
			"player_from_stone_9",
			], 24, false, true);
		shell.fromStone.onComplete.add(function(){
			setTimeout(function(){
				if (shell.sound) shell.sound.destroy();
				inChange = false;
				shell.destroy();
			},10)
			
		});
		shell.toStone = shell.animations.add("to_stone", ["player_to_stone_0", "player_to_stone_1", "player_to_stone_2", "player_to_stone_3", "player_to_stone_4"], 24, false, true);
		shell.toStone.onComplete.add(function(){
			inChange = false;
			
		});
		shell.animations.play("to_stone");
		player.shell = shell;

		
	}

	//shatters the stone statue and get back the demon char
	function fromStone() {
		player.body.x = shell.body.x;
		player.body.y = shell.body.y;
		shell.body.y+=1;
		player.state = STATES.NORMAL;
		inChange = true;
		shell.animations.play("from_stone");
		player.visible = true;

		sound("player_from_stone");

		//world.moveCameraTo(player.body.x, player.body.y);
	}

	return player;
}
