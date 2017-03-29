var InfoTalk = function(world, eventData) {
	var it = game.add.sprite(eventData.tileX * 8, eventData.tileY * 8 - 4, "atlas", eventData.img, world.middleLayer);
	game.physics.ninja.enable(it, 1);
	it.isFix = true;
	it.anchor.set(0.5,0.75)
	it.body.immovable = true;
	it.body.setSize(16,8);
	it.body.y += 9;
	it.myUpdate = function() {
		var dist = distance(world.player, it);

		if (dist < 16 && world.player.attachedEvent == null) {
			world.player.attachedEvent = it;
			world.player.setIcon("icon_eye");
			world.player.headIcon.visible = true;

		}
	}

	it.interact = function() {
		TextBoxBig(L("TEXT02"));
	}

	return it;
}