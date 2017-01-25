var game = null;

function timeEvent(seconds, func, scope) {
	game.time.events.add(Phaser.Timer.SECOND * seconds, func, scope);
}

var Game = {
	height: 144,
	width: 256
};

function init() {
	logInfo("init init");

	game = new Phaser.Game( Game.width, Game.height, Phaser.CANVAS, '', null, false, false);

	
	game.state.add("Preloader", Game.Preloader);
	game.state.add("Main", Game.Main);
	
	game.state.start("Preloader");

	
	
};

function sound(name, volume, loop, pitch) {
	var sound = game.add.audio(name, volume || 1, loop);
    sound.play();
    if (sound._sound) sound._sound.playbackRate.value = pitch || 1;
    return sound;
}

function logInfo(text) {
	console.log("%c" + text, "color: #A8009D");
};

function loadItem(id) {
	return localStorage.getItem("abinsall_" + id);
};

function saveItem(id, value) {
	localStorage.setItem("abinsall_" + id, value);
}