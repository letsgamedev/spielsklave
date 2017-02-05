var GenPool = {}

/**
This function should be attached to a player/enemy object
So this function will be called when the object ist hit by
an enemy by collision.

The 'self' will be thrown back a bit to show the collision with 'other'

@param {object} self - The object which this function is attached to
@param {object} other - The Object (e.g. enemy) which collies with 'self'
*/
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