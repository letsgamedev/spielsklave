var Scythe = function(player, world) {
	var scythe = {};
	scythe.strength = 1;

	var sicle_down = addAnimation(player, "scythe_down", "dengel_scythe_down", 5, 30, false);
	sicle_down.onComplete.add(onFinish);

	var sicle_up = addAnimation(player, "scythe_up", "dengel_scythe_up", 5, 30, false);
	sicle_up.onComplete.add(onFinish);

	var sicle_left = addAnimation(player, "scythe_left", "dengel_scythe_left", 5, 30, false);
	sicle_left.onComplete.add(onFinish);

	var sicle_right = addAnimation(player, "scythe_right", "dengel_scythe_right", 5, 30, false);
	sicle_right.onComplete.add(onFinish);

	function onFinish() {
		player.state = STATES.NORMAL;
		isPlaying = false;
		player.animations.play("stand_" + player.lookDirection);
	}

	isPlaying = false;

	scythe.action = function() {
		player.state = STATES.INUSE;
		playSound("scythe");
		isPlaying = true;

		player.animations.play("scythe_" + player.lookDirection);
	}

	var hitbox = {
		down: [
			{ x: -20, y: -10, w: 0, h: 0 },
			{ x: -13, y: 5, w: 10, h: 10 },
			{ x: -10, y: 10, w: 20, h: 10 },
			{ x: 8, y: -5, w: 10, h: 20 },
			{ x: 10, y: -10, w: 10, h: 10 },
		],
		up: [
			{ x: 10, y: -10, w: 0, h: 0 },
			{ x: 8, y: -18, w: 10, h: 10 },
			{ x: -10, y: -25, w: 20, h: 10 },
			{ x: -18, y: -24, w: 10, h: 20 },
			{ x: -20, y: -10, w: 10, h: 10 },
		],
		left: [
			{ x: 10, y: -10, w: 0, h: 0 },
			{ x: -18, y: -15, w: 10, h: 10 },
			{ x: -25, y: -10, w: 10, h: 20 },
			{ x: -16, y: 8, w: 20, h: 10 },
			{ x: 2, y: 6, w: 10, h: 10 },
		],
		right: [
			{ x: 0, y: 10, w: 0, h: 0 },
			{ x: 5, y: 2, w: 10, h: 10 },
			{ x: 13, y: -10, w: 10, h: 20 },
			{ x: -5, y: -16, w: 20, h: 10 },
			{ x: -7, y: -16, w: 10, h: 10 },
		]
	}

	var diagonalFactor = 0;
	function setMove(padKey,axis, multi,dirID) {
		if (Pad.isDown(padKey)) {
			player.body[axis] += DT * 20 * diagonalFactor * multi;
		}
	}

	var currentHitBox = null;
	scythe.update = function() {
		if (isPlaying) {
			
			diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

			setMove(Pad.LEFT, "x", -1, LEFT);
			setMove(Pad.RIGHT, "x", 1, RIGHT);
			setMove(Pad.UP, "y", -1, UP);
			setMove(Pad.DOWN, "y", 1, DOWN);


			var hb = hitbox[player.lookDirection][player.frameName.slice(-1)];
			currentHitBox = new Phaser.Rectangle(player.body.x + hb.x, player.body.y + hb.y, hb.w, hb.h);

			hitTest();

		}
	}

	function hitTest() {
		if (currentHitBox) {
			for (var i = 0; i < world.enemies.length; i++) {
				var e = world.enemies[i];
				if (e.alive && currentHitBox.intersects(e.getHitBox())) {
					e.onHit(scythe.strength);
				}
			};
		}
		
	}

	return scythe;
}