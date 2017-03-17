/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

//Lufia 13 Zeilen -> 208px
//Zelda nes 10 - 11 Zeilen -> 160px
//zelda snes 13 Zeilen -> 208px
//zelda gb 8 -> 128px
//alwa pc 14 -> 224px


//8, 12, 24
//8, 12, 24

function init() {
	logInfo("init init");

	var Size = {
		normal: {w: 256, h: 144}, //Zelda NES,GB (9 Zeilen)
		big: {w: 384, h: 216},	//Lufia, Zelda SNES, Alwa (13.5 Zeilen)
		max: {w: 512, h: 288},	// (18 Zeilen)	
	};

	var s = Size.big;

	var params = getParams();
	/*if (params.size) {
		switch(params.size) {
			case "big": s = Size.big; break;
			case "max": s = Size.max; break;
		}
	}*/
	Game.width = s.w;
	Game.height = s.h;

	game = new Phaser.Game( Game.width, Game.height, Phaser.CANVAS, '', null, false, false);

	game.state.add("Preloader", Game.Preloader);
	game.state.add("Main", Game.Main);
	game.state.add("BlendModeTest", Game.BlendModeTest);
	
	game.state.start("Preloader");
};


function timeEvent(seconds, func, scope) {
	game.time.events.add(Phaser.Timer.SECOND * seconds, func, scope);
};

function playMusic(name, volume, loop, pitch) {
	volume = (volume === null || volume === undefined)? 1 : volume;
	return sound(name, volume * globalMusicVolume, loop, pitch)
}

function playSound(name, volume, loop, pitch) {
	volume = (volume === null || volume === undefined)? 1 : volume;
	return sound(name, volume * globalSoundVolume, loop, pitch)
}

function sound(name, volume, loop, pitch) {
	console.log("sound", name, volume)
	var sound = game.add.audio(name, volume, loop);
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

function addAnimation(obj, name, assetsName, count, fps, loop) {
	var animNames = [];
	for (var i = 0; i < count; i++) {
		animNames.push(assetsName + "_" + i);
	};
	return obj.animations.add(name, animNames, fps, loop);
};

function sleep(millisec) {
	game.paused = true;
	setTimeout(function(){
		game.paused = false;
	}, millisec);
};

function destroyWrap(obj) {
	return function(){
		setTimeout(obj.destroy.bind(obj), 0);
	}
	
}

function getParams() {
    qs = document.location.search.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
};