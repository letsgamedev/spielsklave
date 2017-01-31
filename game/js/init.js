/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/
var game = null;

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


function timeEvent(seconds, func, scope) {
	game.time.events.add(Phaser.Timer.SECOND * seconds, func, scope);
};

function sound(name, volume, loop, pitch) {
	var sound = game.add.audio(name, volume || 1, loop);
    sound.play();
    if (sound._sound) sound._sound.playbackRate.value = pitch || 1;
    return sound;
};

function logInfo(text) {
	console.log("%c" + text, "color: #A8009D");
};

function loadItem(id) {
	return localStorage.getItem("spielsklave_" + id);
};

function saveItem(id, value) {
	localStorage.setItem("spielsklave_" + id, value);
};