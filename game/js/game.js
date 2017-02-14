/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
Some SUPER EVEL GLOBAL variables!
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

var MAP = {
	OBJECTS: 2,
	GROUND_DETAIL: 1,
	GROUND: 0
}

var flip = true;


/**
The Main state represants the "inGame" stuff.
That means, everything you can actually play.
*/
Game.Main = function(){
	//variable stuff	
};

Game.Main.prototype = {
	init: function() {	
		logInfo("init Main");
	},

	/**
	Time to render debug objecs or apply some canvas filters!
	*/
	render: function() {
        if (!DEBUG) {
            game.debug.body(this.pig);
            game.debug.body(this.player);
            for (var i = 0; i < this.enemies.length; i++) {
            	game.debug.body(this.enemies[i]);

            };
            var pu = Pad.isDown(Pad.UP) ? "U" : "-";
            var pd = Pad.isDown(Pad.DOWN) ? "D" : "-";
            var pl = Pad.isDown(Pad.LEFT) ? "L" : "-";
            var pr = Pad.isDown(Pad.RIGHT) ? "R" : "-";
            var pj = Pad.isDown(Pad.JUMP) ? "J" : "-";
            var ps = Pad.isDown(Pad.SHOOT) ? "S" : "-";
            game.debug.text(pu+pd+pl+pr+pj+ps, 5, 10);


            if (this.player.shell) game.debug.body(this.player.shell);
        }

        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");   

    },

    preRender: function() {
    	this.middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);
    },
	
	/**
	Load all the additional assets we need to use.
	*/
	preload: function() {
		this.load.tilemap("map", 'map2.json', null, Phaser.Tilemap.TILED_JSON);
	},
	
	/**
	Initialise the game and prepare everything.
	*/
	create: function() {
		//General setup
		game.renderer.renderSession.roundPixels = true;
		//this.game.canvas.style.cursor = "none";
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Pad.init();
        game.time.advancedTiming = true;
        game.stage.backgroundColor = "#000000";

        this.enemies = [];


        this.initPhysics();
        this.initMap();
        this.bottomLayer = game.add.group();
        this.middleLayer = game.add.group();

        this.player = Player(this, 16 * 25, 16 * 35);
        
        this.pig = Pig(this, 16 * 25, 16 * 33);

        this.addEnemies();

        this.cursor = Cursor(this);

        sound("world", 0.75, true);
        
        if (game.device.desktop == false) Pad.addVirtualButtons(game);
	},	

	/**
	Initialise the general physics preferences.
	*/
	initPhysics: function() {
		 this.game.physics.startSystem(Phaser.Physics.NINJA);
		 this.game.physics.ninja.gravity = 0;
	},

	/**
	Load and create/add the map layers.
	Also define which tiles have slopes.
	*/
	initMap: function() {
		this.map = this.add.tilemap("map");
       
        this.map.addTilesetImage("tiles", 'tiles'); //sets a image key to a json tileset name key
        this.layer = this.map.createLayer(MAP.GROUND);
        console.log(this.layer);
        this.groundDetail = this.map.createLayer(MAP.GROUND_DETAIL);

        var slopeMap = [0,//first is ignored
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 0, 3, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 4, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 0, 4, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 0, 0, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 0, 0, 15, 14, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 
1, 0, 0, 1, 18, 14, 15, 19, 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 
5, 0, 0, 4, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 3, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
3, 1, 1, 5, 0, 0, 4, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 2, 0, 0, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 4, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 4, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        this.tiles = game.physics.ninja.convertTilemap(this.map, this.layer, slopeMap);

        this.layer.resizeWorld();
	},

	addEnemies: function() {
		var ids = [
			{tileId: 17, className: LittleEgg}
		];

		var that = this;

		for (var i = 0; i < ids.length; i++) {
			var enemyId = ids[i];
			var result = this.findTilesWithID(MAP.OBJECTS, enemyId.tileId);
			result.forEach(function addEnemy(tile){
				var enemy = enemyId.className(that, tile.x * 8, tile.y * 8);
				that.enemies.push(enemy)
			});
		};

		
	},

	moveCameraTo: function(x, y) {
		var tween = game.add.tween(game.camera).to({
			x: x,
			y: y
		}, 500, Phaser.Easing.Cubic.InOut, true);
	},

	updateCamera: function() {
		var lookOffsetY = 0;
		var lookOffsetX = 0;
		var lookOffsetDistance = 0;
		var follower = this.player.state == STATES.STONE ? this.pig : this.player;
		switch(follower.lookDirection) {
			case UP: lookOffsetY = lookOffsetDistance; break;
			case DOWN: lookOffsetY = -lookOffsetDistance; break;
			case LEFT: lookOffsetX = lookOffsetDistance; break;
			case RIGHT: lookOffsetX = -lookOffsetDistance; break;
		}
		var xd = follower.body.x - (this.camera.x + Game.width / 2 - 8 + lookOffsetX);
		var yd = follower.body.y - (this.camera.y + Game.height / 2 + lookOffsetY);

		this.camera.x = Math.floor( this.camera.x + (xd * 0.5));
		this.camera.y = Math.floor( this.camera.y + (yd * 0.5));

		game.camera.x += game.camera._shake.xx;
    	game.camera.y += game.camera._shake.yy;
	},

	findTilesWithID: function(layerNr, tileId) {
        var result = [];

        var data = this.map.layers[layerNr].data;

        data.forEach(function(line){
            result = result.concat(line.filter(function(tile){
                return tile.index === tileId;
            }));
        });
        return result;
    },
	
	/**
	The update method will me called every frame.
	so time to get some input and update charakters and objects!
	*/
	update: function() {
		DT = this.time.physicsElapsedMS * 0.001;
		Pad.checkJustDown();
		
		this.player.input();
		this.pig.update();
		this.pig.input();
		this.cursor.update();

		flip = !flip;

		//Collision detection
		
		for (var i = 0; i < this.tiles.length; i++) {
			if(this.player.state == STATES.STONE) {
				this.player.shell.body.aabb.collideAABBVsTile(this.tiles[i].tile);
			}

			for (var j = flip ? 0 : 1; j < this.enemies.length; j+=2) {
				if (this.enemies[j].isFix) continue;
				this.enemies[j].body.aabb.collideAABBVsTile(this.tiles[i].tile);
			};

	        var r = this.player.body.aabb.collideAABBVsTile(this.tiles[i].tile);
	        if (r && this.player.hitTween) {
	        	this.player.hitTween.stop();
	        	this.player.hitTween = undefined;
	        }
	        if (this.player.state == STATES.STONE || this.cursor.visible) {
	        	r = this.pig.body.aabb.collideAABBVsTile(this.tiles[i].tile);
		        if (r && this.pig.hitTween) {
		        	this.pig.hitTween.stop();
		        	this.pig.hitTween = undefined;
		        }
	        } 
	        
	    }

	    //Dont do this in the for loop cause this would be super dumb!
	    if (this.player.state == STATES.STONE) {
	    	game.physics.ninja.collide(this.player.shell, this.pig);
	    }

	    //Overlap with enemies

	    for (var i = 0; i < this.enemies.length; i++) {
	    	if (this.player.state != STATES.STONE) game.physics.ninja.overlap(this.player, this.enemies[i], this.player.onHit);
	    	if (this.player.state == STATES.STONE || this.cursor.visible) game.physics.ninja.overlap(this.pig, this.enemies[i], this.pig.onHit);
	    	if (this.player.state == STATES.STONE) game.physics.ninja.collide(this.player.shell, this.enemies[i]);
	    };

		this.updateCamera();
	
	}
	
	
};

/**
This is the mouse pointer substitue for
a second player. The pig will follow
this cursor with a direkt line.

@param {object} world - The current state

@return {Phaser.Sprite} - The coursor/pointer object
*/
var Cursor = function(world) {
	var cursor = game.add.sprite(0, 0, "atlas", "cursor");
	cursor.anchor.set(0, 0);
	cursor.change = false;
	cursor.update = function() {
		var nx = Math.floor(game.input.mousePointer.position.x) + game.camera.x;
		var ny = Math.floor(game.input.mousePointer.position.y) + game.camera.y;

		cursor.change = (nx != cursor.x || ny != cursor.y);

		cursor.x = nx;
		cursor.y = ny;

		var distance = game.math.distance(world.pig.x, world.pig.y, cursor.x, cursor.y);
		cursor.alpha = distance < 16 ? 0.5 : 1;
	}

	cursor.visible = false;

	return cursor;
};

