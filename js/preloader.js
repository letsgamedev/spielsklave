Game.Preloader = function(){
};

Game.Preloader.prototype = {
	init: function() {
		logInfo("init Preloader");
	},
	
	preload: function() {
		this.load.path = 'assets/';
		game.load.atlas("atlas");
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