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
        if (DEBUG) {
            game.debug.body(this.pig);
            game.debug.body(this.player);
            game.debug.text(
            	this.cursor.x + "x" + this.cursor.y, 
            5, 10);


            if (this.player.shell) game.debug.body(this.player.shell);
        }

    },
	
	/**
	Load all the additional assets we need to use.
	*/
	preload: function() {
		this.load.tilemap("map", 'map.json', null, Phaser.Tilemap.TILED_JSON);
	},
	
	/**
	Initialise the game and prepare everything.
	*/
	create: function() {
		//General setup
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

        this.cursor = Cursor(this);
	
        this.game.camera.follow(this.player);

 
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
        this.groundDetail = this.map.createLayer(MAP.GROUND_DETAIL);

        var slopeMap = [0,//first is ignored
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			1, 1, 3, 1, 2, 0, 0, 0, 0, 0, 
			1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 
			1, 1, 4, 1, 5, 0, 0, 0, 0, 0, 
			1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        this.tiles = game.physics.ninja.convertTilemap(this.map, this.layer, slopeMap);

        this.layer.resizeWorld();
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

		
		//Collision detection
		for (var i = 0; i < this.tiles.length; i++) {
			if(this.player.state == STATES.STONE) {
				this.player.shell.body.aabb.collideAABBVsTile(this.tiles[i].tile);
			}

	        this.player.body.aabb.collideAABBVsTile(this.tiles[i].tile);
	        this.pig.body.aabb.collideAABBVsTile(this.tiles[i].tile);
	    }

	    //Dont do this in the for loop cause this would be super dumb!
	    if (this.player.state == STATES.STONE) {
	    	game.physics.ninja.collide(this.player.shell, this.pig);
	    }

		this.middleLayer.sort('y', Phaser.Group.SORT_ASCENDING);
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

