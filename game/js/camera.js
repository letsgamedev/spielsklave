var GameCamera = function(world) {
	var camera = world.camera

	camera.tweenToCurrentChunk = function (oldChunkBounds, newChunkBounds, oldChunkDirection, onComplete) {
    var x = Math.min(oldChunkBounds.left, newChunkBounds.left)
    var y = Math.min(oldChunkBounds.top, newChunkBounds.top)
    var w = Math.max(oldChunkBounds.left, newChunkBounds.left) + 512
    var h = Math.max(oldChunkBounds.top, newChunkBounds.top) + 512
    world.world.setBounds(x, y, w, h)

    var cx = 0
    var cy = 0
    var offSet = 16 * 13.5

    switch (oldChunkDirection) {
      case UP: cy = offSet; break
      case DOWN: cy = -offSet; break
      case LEFT: cx = offSet; break
      case RIGHT: cx = -offSet; break
    }


    function releaseWorldFix() {
    	world.isInTransition = false
    	onComplete()
    }

    G.TweenCubic(camera, {
      x: '' + cx,
      y: '' + cy
    }, 1000, releaseWorldFix).start()
  }

  camera.moveTo = function (x, y) {
    G.TweenCubic(game.camera, {
      x: x,
      y: y
    }, 500).start()
  }

  camera.updatePosition = function (isInstant) {
    // delete all kommented stuff on march 2018
    if (world.isInTransition && isInstant != true) return
    /* var lookOffsetY = 0
    var lookOffsetX = 0
    var lookOffsetDistance = 0 */
    var follower = world.player.state == STATES.STONE ? world.pig : world.player

    /* switch (follower.lookDirection) {
      case UP: lookOffsetY = lookOffsetDistance; break
      case DOWN: lookOffsetY = -lookOffsetDistance; break
      case LEFT: lookOffsetX = lookOffsetDistance; break
      case RIGHT: lookOffsetX = -lookOffsetDistance; break
    }

    var xd = follower.body.x - (this.camera.x + Game.width / 2 - 8 + lookOffsetX)
    var yd = follower.body.y - (this.camera.y + Game.height / 2 + lookOffsetY)

    if (isInstant) {
      this.camera.x = Math.floor(this.camera.x + xd)
      this.camera.y = Math.floor(this.camera.y + yd)
    } else {
      this.camera.x = Math.floor(this.camera.x + (xd * 1.0))
      this.camera.y = Math.floor(this.camera.y + (yd * 1.0))
    } */

    camera.x = follower.body.x - Game.width / 2
    camera.y = follower.body.y - Game.height / 2

    game.camera.x += game.camera._shake.xx
    game.camera.y += game.camera._shake.yy
  }

	return camera
}