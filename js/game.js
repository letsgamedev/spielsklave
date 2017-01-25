var DOWN = "down";
var UP = "up";
var LEFT = "left";
var RIGHT = "right";

Game.Main = function(){
	//variable stuff	
};

Game.Main.prototype = {
	init: function() {	
		logInfo("init Main");
	},

	render: function() {

    },
	
	preload: function() {
		
	},
	
	create: function() {
		game.renderer.renderSession.roundPixels = true;
		this.game.canvas.style.cursor = "none";
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Pad.init();
        game.time.advancedTiming = true;

        game.stage.backgroundColor = "#4488AA";

        this.middleLayer = game.add.group();

        this.player = Player(this, 60, 30);
        this.pig = Pig(this, 110, 50);


        this.cursor = Cursor(this);
	

 
	},	
	
	update: function() {
		DT = this.time.physicsElapsedMS * 0.001;
		Pad.checkJustDown();
		
		this.player.input();
		this.pig.update();
		this.pig.input();

		this.middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);
	}
	
	
};

var Player = function(world, x, y) {
	var player = game.add.sprite(x, y, "atlas", "player_walk_down_1", world.middleLayer);
	player.anchor.set(0,1);
	player.animations.add("stand_up", ["player_walk_up_1"], 12, true, true);
	player.animations.add("stand_down", ["player_walk_down_1"], 12, true, true);
	player.animations.add("stand_left", ["player_walk_left_1"], 12, true, true);
	player.animations.add("stand_right", ["player_walk_right_1"], 12, true, true);
	player.animations.add("walk_down", ["player_walk_down_0", "player_walk_down_1", "player_walk_down_2", "player_walk_down_3"], 12, true, true);
	player.animations.add("walk_up", ["player_walk_up_0", "player_walk_up_1", "player_walk_up_2", "player_walk_up_3"], 12, true, true);
	player.animations.add("walk_left", ["player_walk_left_0", "player_walk_left_1", "player_walk_left_2", "player_walk_left_3"], 12, true, true);
	player.animations.add("walk_right", ["player_walk_right_0", "player_walk_right_1", "player_walk_right_2", "player_walk_right_3"], 12, true, true);
	player.animations.play("stand_down");
	
	var speed = 100;
	var lookDirection = DOWN;
	player.humanInput = true;

	player.input = function() {
		var stand = true;
		var newAnimation = "stand";

		var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

		

		//MOVEMENT
		if (player.humanInput && !(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
			function setMove(padKey,axis, multi,dirID) {
				if (Pad.isDown(padKey)) {
					player[axis] += DT * speed * diagonalFactor * multi;
					stand = false;
					lookDirection = dirID;
				}
			}

			setMove(Pad.LEFT, "x", -1, LEFT);
			setMove(Pad.RIGHT, "x", 1, RIGHT);
			setMove(Pad.UP, "y", -1, UP);
			setMove(Pad.DOWN, "y", 1, DOWN);

			if (player.animations.currentAnim.name.includes("stand") || diagonalFactor == 1) {
				player.animations.play("walk_" + lookDirection);
			}
		}
		
		if (stand) {
			player.animations.play("stand_" + lookDirection);
		}


		if (Pad.justDown(Pad.JUMP)) {
			world.cursor.visible = !world.cursor.visible;
			if (player.humanInput == false && world.cursor.visible) {
				setHumanInput(true);
			}
		}
		if (Pad.justDown(Pad.SHOOT) && world.cursor.visible == false) {
			setHumanInput(!player.humanInput);
		}

	}

	function setHumanInput(isOn) {
		player.humanInput = isOn;
		player.alpha = isOn ? 1 : 0.5;
		world.pig.humanInput = !isOn;
	}

	return player;
}

var Pig = function(world, x, y) {
	var pig = game.add.sprite(x, y, "atlas", "pig_walk_down_1", world.middleLayer);
	pig.anchor.set(0,1);
	pig.animations.add("stand_up", ["pig_walk_up_1"], 24, true, true);
	pig.animations.add("stand_down", ["pig_walk_down_1"], 12, true, true);
	pig.animations.add("stand_left", ["pig_walk_left_1"], 12, true, true);
	pig.animations.add("stand_right", ["pig_walk_right_1"], 12, true, true);
	pig.animations.add("walk_down", ["pig_walk_down_0", "pig_walk_down_1", "pig_walk_down_2", "pig_walk_down_3"], 12, true, true);
	pig.animations.add("walk_up", ["pig_walk_up_0", "pig_walk_up_1", "pig_walk_up_2", "pig_walk_up_3"], 12, true, true);
	pig.animations.add("walk_left", ["pig_walk_left_0", "pig_walk_left_1", "pig_walk_left_2", "pig_walk_left_3"], 12, true, true);
	pig.animations.add("walk_right", ["pig_walk_right_0", "pig_walk_right_1", "pig_walk_right_2", "pig_walk_right_3"], 12, true, true);
	pig.animations.play("stand_down");

	var speed = 100;
	var minDis = 30;
	var lookDirection = DOWN;
	pig.humanInput = false;

	pig.update = function() {
		if (pig.humanInput) return;
		var follow = world.cursor.visible ? world.cursor : world.player;
		minDis = world.cursor.visible ? 2 : 30;
		var distance = game.math.distance(follow.x, follow.y, pig.x, pig.y);

		if (distance > minDis){
			var direction = {
				x: (follow.x - pig.x) / distance,
				y: (follow.y - pig.y) / distance
			}

			pig.x += direction.x * speed * DT;
			pig.y += direction.y * speed * DT;
		}

		var dirKey = Math.round(game.math.angleBetweenPoints(pig, follow) / Math.PI * 2);

		switch (dirKey) {
			case 0: lookDirection = RIGHT; break;
			case 1: lookDirection = DOWN; break;
			case -2:
			case 2: lookDirection = LEFT; break;
			case -1: lookDirection = UP; break;
		}

		if (pig.deltaX != 0 && pig.deltaY != 0) {
			//if (pig.animations.currentAnim.name.includes("stand")) {
				pig.animations.play("walk_" + lookDirection);
			//}
		} else {
			pig.animations.play("stand_" + lookDirection);
		}
	}

	pig.input = function() {
		if (pig.humanInput == false) return;
		var stand = true;
		var newAnimation = "stand";

		var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

		//MOVEMENT
		if (pig.humanInput && !(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
			function setMove(padKey,axis, multi,dirID) {
				if (Pad.isDown(padKey)) {
					pig[axis] += DT * speed * diagonalFactor * multi;
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


		if (Pad.justDown(Pad.JUMP)) {
			
		}
		if (Pad.justDown(Pad.SHOOT)) {
			
		}

	}

	return pig;
}

var Cursor = function(world) {
	var cursor = game.add.sprite(0, 0, "atlas", "cursor");
	cursor.anchor.set(-0.5, 0.5);
	cursor.update = function() {
		cursor.x = game.input.mousePointer.position.x;
		cursor.y = game.input.mousePointer.position.y;

		var distance = game.math.distance(world.pig.x, world.pig.y, cursor.x, cursor.y);
		cursor.alpha = distance < 16 ? 0.5 : 1;
	}

	cursor.visible = false;

	return cursor;
}

