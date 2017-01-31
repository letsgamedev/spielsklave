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
		this.load.image("tiles");
		//game.load.bitmapFont("");
		var loadSound = function(name, type) {
			type = type || "mp3"
			game.load.audio(name, "sound/" + name + "." + type);
		}
		//loadSound("", "");
	},
	
	create: function() {
		game.state.start("Main");
	}
};