/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/


/**
The Main state represants the "inGame" stuff.
That means, everything you can actually play.
*/
Game.BlendModeTest = function(){
	//variable stuff	
};

Game.BlendModeTest.prototype = {
	init: function() {	
		logInfo("init BlendModeTest");
	},

	/**
	Time to render debug objecs or apply some canvas filters!
	*/
	render: function() {   

    },

    preRender: function() {
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
        game.stage.backgroundColor = "#2CDE65";

        this.initMap();
    	this.addClouds();
	},

	initMap: function() {
		this.map = this.add.tilemap("map");
       
        this.map.addTilesetImage("tiles", 'tiles'); //sets a image key to a json tileset name key
        this.layer = this.map.createLayer(MAP.GROUND);
        console.log(this.layer);
        this.groundDetail = this.map.createLayer(MAP.GROUND_DETAIL);
        this.layer.resizeWorld();
	},

	addClouds: function() {
		var bm = 0;
		this.clouds = game.add.group();
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 4; x++) {
				var c = game.add.sprite(x * 80, y * 50, "atlas", "cloud", this.clouds);
				c.blendMode = bm;
				c.tint = 0x999999;
				c.scale.set(0.8);
				bm++;
			};
			
		};
	},
	
	/**
	The update method will me called every frame.
	so time to get some input and update charakters and objects!
	*/
	update: function() {
		DT = this.time.physicsElapsedMS * 0.001;
		Pad.checkJustDown();
		if (Pad.isDown(Pad.DOWN)) this.clouds.y += DT * 100;
		if (Pad.isDown(Pad.UP)) this.clouds.y -= DT * 100;
		if (Pad.isDown(Pad.LEFT)) this.clouds.x -= DT * 100;
		if (Pad.isDown(Pad.RIGHT)) this.clouds.x += DT * 100;
	
	}
	
};

