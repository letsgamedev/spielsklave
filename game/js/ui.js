var UI = function(world) {
	var ui = game.add.group();
	ui.fixedToCamera = true;
	ui.cameraOffset.x = 10;
	ui.cameraOffset.y = 10;


	var head = game.add.sprite(0,3, "atlas", "ui_head", ui);

	var health = [];
	var x = 0;
	var y = 0;
	for (var i = 0; i < 10; i++) {
		var h = game.add.sprite(17 + x * 14, y * 14, "atlas", "health_full", ui);
		x++;
		if (x >= 5) {
			y++;
			x = 0;
		}
		health.push(h);
	};

	var visible = 0;

	ui.updateHealth = function() {
		visible = 0;
		for (var i = 1; i <= health.length; i++) {
			var h = health[i-1];
			if (i*2 <= world.player.maxHP) {
				h.visible = true;
				visible++;
				if (world.player.hp >= i*2) h.frameName = "health_full";
				else if (world.player.hp == i*2 - 1) h.frameName = "health_half";
				else h.frameName = "health_empty";
			} else {
				h.visible = false;
			}
			
		};

		head.y = visible > health.length / 2 ? 3 : -2;

	}



	//items
	var btnOffsetX = -40;
	ui.btnY = game.add.sprite(game.width - 130 + btnOffsetX, -7, "atlas", "icon_id_0", ui);
	ui.btnB = game.add.sprite(game.width - 100 + btnOffsetX, -7, "atlas", "icon_id_7", ui);
	ui.btnX = game.add.sprite(game.width - 70 + btnOffsetX, -7, "atlas", "icon_id_1", ui);
	var map = MiniMap(game.width - 68, 0);
	ui.add(map);
	ui.miniMap = map;
	ui.add(map.overlay);

	ui.setIconY = function(id) {
		setIcon(ui.btnY, id);
	}

	ui.setIconB = function(id) {
		setIcon(ui.btnB, id);
	}

	ui.setIconX = function(id) {
		setIcon(ui.btnX, id);
	}

	function setIcon(btn, id) {
		btn.frameName = "icon_id_" + id;
	}

	TEST = map;
	return ui;
};

var Map = function(x, y) {
	var map = game.add.group();
	map.x = x;
	map.y = y;
	var openMap = game.add.sprite(0, 0, "atlas", "map_free");
	openMap.mask = game.add.graphics(0, 0);
	openMap.addChild(openMap.mask);
	openMap.mask.beginFill(0xffffff);
	openMap.mask.drawRect(0, 0, 1, 1);

	var mapImg = game.add.sprite(0, 0, "atlas", "map_cloud");
	
	map.add(mapImg);
	map.add(openMap);

	map.clearField = function(tileX, tileY) {
	    openMap.mask.beginFill(0x0);
		openMap.mask.drawRect(tileX * 16, tileY * 16, 16, 16);
	}

	return map;
}

var MiniMap = function(x, y) {
	var oPos = {x:x, y:y}
	var map = Map(x, y);
	var miniMapMask = game.add.graphics(0, 0);
	miniMapMask.beginFill(0x444444);
	//miniMapMask.drawRect(0, 0, 16 * 3 + 1, 16 * 3 + 1);
	miniMapMask.drawCircle(16 * 1.5 + 0.5, 16 * 1.5 + 0.5, 16 * 3 + 1)

	TEST2 = miniMapMask;
	map.setCenterTile = function(tileX, tileY) {
		console.log("create hole ", tileX, tileY)
		map.clearField(tileX, tileY);
		var tx = game.math.clamp(tileX, 1, 10);
		var ty = game.math.clamp(tileY, 1, 6);
		miniMapMask.x = (tx - 1) * 16; 
		miniMapMask.y = (ty - 1) * 16; 
		map.x = -(tx - 1) * 16 + oPos.x;
		map.y = -(ty - 1) * 16 + oPos.y;
	}
	map.addChild(miniMapMask);
	map.mask = miniMapMask;

	var overlay = game.add.sprite(x-1, y-1, "atlas", "mapoverlay");
	map.overlay = overlay;

	return map;

}


