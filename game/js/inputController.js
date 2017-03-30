var InputController = function(world) {
	
	var ic = {};
	ic.update = function() {
		var player = world.player;
		var pig = world.pig;

		if (isEvent == false) {
			if (Pad.justDown(Pad.SELECT)) {
				world.cursor.visible = !world.cursor.visible;
			}

			if (player.state != STATES.INUSE) {
				if (Pad.justDown(Pad.X)) {
					player.swapStone();
				}

				if (player.state != STATES.STONE) {
					//Controll of the player
					player.input();

					if (Pad.justDown(Pad.Y) && player.item1) {
						player.item1.action();
					}

					if (Pad.justDown(Pad.B) && player.item2) {
						player.item2.action();
					}

					if (Pad.justDown(Pad.A) && player.attachedEvent) {
						player.animations.play("stand_" + player.lookDirection);
						player.attachedEvent.interact();
					}
				} else {
					//Player ist stone so we controll the pig
					pig.input();

					if (Pad.justDown(Pad.B)) {
						if (pig.state == STATES.NORMAL) {
							pig.sitDown();
						} else {
							pig.standUp();
						}
					}
				}
			}

			
		}
		
	}

	return ic;
}