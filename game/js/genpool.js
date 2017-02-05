var GenPool = {}
GenPool.onHit = function(self, other) {
	if (self.damageSave) return;
	var hitDistance = 20;

	var dist = game.math.distance(self.body.x, self.body.y, other.body.x, other.body.y);
	var dx = (self.body.x - other.body.x) / dist;
	var dy = (self.body.y - other.body.y) / dist;


	self.damageSave = true;

	var tween = game.add.tween(self.body).to({
		x: self.body.x + dx * hitDistance,
		y: self.body.y + dy * hitDistance
	}, 150, null, true);
	
	game.camera.shake(0.01, 50, true,Phaser.Camera.SHAKE_BOTH, false);
	timeEvent(0.15, function(){self.damageSave = false});				
}