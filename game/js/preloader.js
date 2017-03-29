/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

Game.Preloader = function(){
};

Game.Preloader.prototype = {
	init: function() {
		logInfo("init Preloader");
	},
	
	preload: function() {
		game.plugins.add(Fabrique.Plugins.NineSlice);

		this.load.path = 'assets/';
		
		game.load.atlas("atlas");
		game.load.atlas("atlas_pad");
		this.load.image("tiles");

		// top is 10, left is 15, right is 20 and bottom is 30 pixels in size 
		game.load.nineSlice('textBoxBig', 'textBoxBig.png', 9, 8, 8, 8);
		game.load.bitmapFont("font");
		var loadSound = function(name, type, dir) {
			type = type || "mp3"
			dir = dir || "sounds/"

			game.load.audio(name, dir + name + "." + type);
		}
		loadSound("player_hit", "wav");
		loadSound("hit2", "wav");
		loadSound("player_to_stone", "wav");
		loadSound("player_from_stone", "wav");
		loadSound("little_egg_hatch", "wav");
		loadSound("explosion1", "wav");
		loadSound("stone_push", "wav");
		loadSound("scythe", "wav");
		loadSound("world", "ogg", "music/");
	},
	
	create: function() {
		//game.state.start("BlendModeTest");
		Pad.init();
		nextMapId = "01";
		game.state.start("Main");
	}
};