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
		this.load.path = 'assets/';
		
		game.load.atlas("atlas");
		game.load.atlas("atlas_pad");
		this.load.image("tiles");
		//game.load.bitmapFont("");
		var loadSound = function(name, type, dir) {
			type = type || "mp3"
			dir = dir || "sounds/"

			game.load.audio(name, dir + name + "." + type);
		}
		loadSound("player_hit", "wav");
		loadSound("player_to_stone", "wav");
		loadSound("player_from_stone", "wav");
		loadSound("little_egg_hatch", "wav");
		loadSound("stone_push", "wav");
		loadSound("world", "ogg", "music/");
	},
	
	create: function() {
		game.state.start("Main");
	}
};