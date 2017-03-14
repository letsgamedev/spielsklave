var SwipeFade = function(world, from, kind) {
	var container = game.add.group();
	container.fixedToCamera = true;

	var addShape = function(x,y) {
		return game.add.sprite(x,y, "atlas", "raute", container)
	};

	var addBlack = function(x,y, anchorX, anchorY) {
		var black = game.add.sprite(x, y, "atlas", "black", container);
		black.width = game.width + 24;
		black.height = game.height + 24;
		black.anchor.set(anchorX, anchorY);
		return black;
	}

	var tweenContainer = function(x, y, onComplete) {
		var tween = game.add.tween(container.cameraOffset).to({
			x: x,
			y: y
		}, 800, Phaser.Easing.Cubic.InOut, true);

		tween.onComplete.add(function(){
			onComplete();
		}, this)
	}

	var nextMap = function() {
		game.stage.backgroundColor = 0x000000;
		world.startNextMap();
	}

	var goOnWithGame = function() {
		world.isInTransition = false;
		container.destroy();
	}
	world.isInTransition = true;
	if (kind == "out") {
		switch (from) {
			case LEFT:
				for (var i = 0; i < 9; i++) addShape(-24, 24 * i);
				addBlack(-24 + 12, 0, 1, 0);
				tweenContainer(game.width + 24, 0, nextMap);
			break;
			case RIGHT:
				for (var i = 0; i < 9; i++) addShape(game.width, 24 * i);
				addBlack(game.width + 12, 0, 0, 0);
				tweenContainer(-game.width - 12, 0, nextMap);
			break;
		}
	} else {
		switch (from) {
			case LEFT:
				for (var i = 0; i < 9; i++) addShape(-24, 24 * i);
				addBlack(-24 + 12, 0, 0, 0);
				tweenContainer(game.width + 24, 0, goOnWithGame)
			break;
			case RIGHT:
				for (var i = 0; i < 9; i++) addShape(game.width, 24 * i);
				addBlack(game.width + 12, 0, 1, 0);
				tweenContainer(-game.width - 24, 0, goOnWithGame);
			break;
		}
		world.stage.backgroundColor = MAPDATA[nextMapId].backgroundColor;
	}
	
}
