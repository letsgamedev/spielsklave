var GenPool = {}

/**
This function should be attached to a player/enemy object
So this function will be called when the object ist hit by
an enemy by collision.

The 'self' will be thrown back a bit to show the collision with 'other'

@param {object} self - The object which this function is attached to
@param {object} other - The Object (e.g. enemy) which collies with 'self'
*/
GenPool.onHit = function (self, other) {
  if (other.harmless) return
  if (self.damageSave) return
  if (self.hitTween) return
  self.hp -= other.strength

  GenPool.throwBack(self, other, 20)

  self.damageSave = true
  G.playSound('player_hit')

  G.sleep(20)

  game.camera.shake(0.02, 70, true, Phaser.Camera.SHAKE_BOTH, false)
  G.timeEvent(0.15, function () { self.damageSave = false })
}

GenPool.throwBack = function (self, other, hitDistance, speed) {
  speed = speed || 150
  var dist = game.math.distance(self.body.x, self.body.y, other.body.x, other.body.y)
  var dx = (self.body.x - other.body.x) / dist
  var dy = (self.body.y - other.body.y) / dist

  var tween = G.StepUpdateTween(self.body, {
    x: dx * hitDistance,
    y: dy * hitDistance
  }, speed, clearHitTween).start()

  function clearHitTween () {
    self.hitTween = undefined
    console.log('remove')
  }

  self.hitTween = tween
}

GenPool.getHitBox = function () {
  return new Phaser.Rectangle(this.body.x + this.hitBox.x, this.body.y + this.hitBox.y, this.hitBox.width, this.hitBox.height)
}

GenPool.getHitBoxFunction = function (self) {
  return function () {
    return new Phaser.Rectangle(self.body.x + self.hitBox.x, self.body.y + self.hitBox.y, self.hitBox.width, self.hitBox.height)
  }
}
