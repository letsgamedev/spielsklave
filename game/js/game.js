/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/
var DOWN = "down";
var UP = "up";
var LEFT = "left";
var RIGHT = "right";
var DEBUG = true;
var STATES = {
	NORMAL: 0,
	STONE: 1,
	WALK: 2,
	STAND: 3
};
var TEST = null;

Game.Main = function(){
	//variable stuff	
};

Game.Main.prototype = {
	init: function() {	
		logInfo("init Main");
	},

	render: function() {
        if (!DEBUG) {
            game.debug.body(this.pig);
            game.debug.body(this.player);

            if (this.player.shell) game.debug.body(this.player.shell);
        }

    },
	
	preload: function() {
		this.load.tilemap("map", 'map.json', null, Phaser.Tilemap.TILED_JSON);
	},
	
	create: function() {
		game.renderer.renderSession.roundPixels = true;
		this.game.canvas.style.cursor = "none";
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Pad.init();
        game.time.advancedTiming = true;

        game.stage.backgroundColor = "#4488AA";

        this.initPhysics();
        this.initMap();
        this.middleLayer = game.add.group();

        this.player = Player(this, 16 * 25, 16 * 25);
        
        this.pig = Pig(this, 16 * 25, 16 * 23);

        console.log(this.player.body.circle);


        this.cursor = Cursor(this);
	
        this.game.camera.follow(this.player);
 
	},	

	initPhysics: function() {
		 this.game.physics.startSystem(Phaser.Physics.NINJA);
	},

	initMap: function() {
		this.map = this.add.tilemap("map");
        //setz a image key to a json tileset name key
        this.map.addTilesetImage("tiles", 'tiles');
        this.backround = this.map.createLayer(0);
        this.layer = this.map.createLayer(1);

        var slopeMap = [0, // first is ignored
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        3, 2, 1, 1, 1, 0, 0, 0, 0, 0,
        4, 5, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0, 0, 0, 0
        ];

        this.tiles = game.physics.ninja.convertTilemap(this.map, this.layer, slopeMap);
         this.game.physics.ninja.gravity = 0;

        this.backround.resizeWorld();
	},
	
	update: function() {
		DT = this.time.physicsElapsedMS * 0.001;
		Pad.checkJustDown();
		
		this.player.input();
		this.pig.update();
		this.pig.input();

		for (var i = 0; i < this.tiles.length; i++) {
	        this.player.body.aabb.collideAABBVsTile(this.tiles[i].tile);
	        this.pig.body.aabb.collideAABBVsTile(this.tiles[i].tile);

	        if(this.player.state == STATES.STONE) this.player.shell.body.aabb.collideAABBVsTile(this.tiles[i].tile);
	    }

	    if (this.player.state == STATES.STONE) {
	    	game.physics.ninja.collide(this.player.shell, this.pig);

	    }

		this.middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);
	}
	
	
};

var Player = function(world, x, y) {
	var player = game.add.sprite(x, y, "atlas", "player_walk_down_1", world.middleLayer);
	game.physics.ninja.enable(player, 1);
    player.body.drag = 0.1;
    player.body.immovable = true;
	
	player.body.setSize(12,12);
	player.anchor.set(0.5,0.6);
	player.state = STATES.NORMAL;

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
	var shell = null;

	player.input = function() {
		var stand = true;
		var newAnimation = "stand";

		var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

		

		//MOVEMENT
		if (player.humanInput && !(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
			function setMove(padKey,axis, multi,dirID) {
				if (Pad.isDown(padKey)) {
					player.body[axis] += DT * speed * diagonalFactor * multi;
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
				player.state = STATES.WALK;
			}
		}
		
		if (stand && player.state != STATES.STONE) {
			player.animations.play("stand_" + lookDirection);
			player.state = STATES.STAND;
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
		if (isOn) {
			fromStone();
		} else {
			toStone();
		}
		world.pig.humanInput = !isOn;
	}

	function toStone() {
		player.visible = false;
		player.state = STATES.STONE;
		shell = game.add.sprite(player.body.x - 32, player.body.y - 32, "atlas", "player_to_stone_0", world.middleLayer);
		game.physics.ninja.enable(shell);
		shell.body.bounce = 0;
	    shell.body.drag = 0;
	    shell.body.immovable = true;
		shell.body.setSize(12,12);
		shell.anchor.set(0.5,0.6);

		
		shell.animations.add("from_stone", [
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
		shell.animations.add("to_stone", ["player_to_stone_0", "player_to_stone_1", "player_to_stone_2", "player_to_stone_3", "player_to_stone_4"], 24, false, true);
		shell.animations.play("to_stone");
		player.shell = shell;
	}

	function fromStone() {
		player.body.x = shell.body.x;
		player.body.y = shell.body.y;
		shell.body.y+=1;
		shell.animations.play("from_stone");
		player.visible = true;
	}

	return player;
}

var Pig = function(world, x, y) {
	var pig = game.add.sprite(x, y, "atlas", "pig_walk_down_1", world.middleLayer);
	game.physics.ninja.enable(pig, 1, 0, 4);
    pig.body.drag = 0.1;
    pig.body.immovable = true;
	pig.anchor.set(0.5, 0.8);
	pig.body.setSize(8,8);

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
	var walkSave = true;

	pig.update = function() {
		if (pig.humanInput) return;
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

		if (distance > minDis){
			var direction = {
				x: (follow.x - pig.body.x) / distance,
				y: (follow.y - pig.body.y) / distance
			}

			pig.body.x += direction.x * speed * DT;
			pig.body.y += direction.y * speed * DT;


			pig.animations.play("walk_" + lookDirection);
			walkSave = true;
		} else {
			if (walkSave) {
				walkSave = false;
			} else {
				pig.animations.play("stand_" + lookDirection);
			}
			
			
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


		if (Pad.justDown(Pad.JUMP)) {
			
		}
		if (Pad.justDown(Pad.SHOOT)) {
			
		}

	}

	return pig;
}

var Cursor = function(world) {
	var cursor = game.add.sprite(0, 0, "atlas", "cursor");
	cursor.anchor.set(0, 0);
	cursor.update = function() {
		cursor.x = game.input.mousePointer.position.x + game.camera.x;
		cursor.y = game.input.mousePointer.position.y  + game.camera.y;

		var distance = game.math.distance(world.pig.x, world.pig.y, cursor.x, cursor.y);
		cursor.alpha = distance < 16 ? 0.5 : 1;
	}

	cursor.visible = false;

	return cursor;
}

