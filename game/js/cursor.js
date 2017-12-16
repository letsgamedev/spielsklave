/**
This is the mouse pointer substitue for
a second player. The pig will follow
this cursor with a direkt line.

@param {object} world - The current state

@return {Phaser.Sprite} - The coursor/pointer object
*/
var Cursor = function (world) {
  var cursor = G.Sprite(0, 0, 'cursor')
  cursor.anchor.set(0, 0)
  cursor.change = false
  cursor.update = function () {
    var nx = Math.round(game.input.mousePointer.position.x) + game.camera.x
    var ny = Math.floor(game.input.mousePointer.position.y) + game.camera.y

    cursor.change = (nx != cursor.x || ny != cursor.y)

    cursor.x = nx
    cursor.y = ny

    var distance = game.math.distance(world.pig.x, world.pig.y, cursor.x, cursor.y)
    cursor.alpha = distance < 16 ? 0.5 : 1
  }

  cursor.visible = PlayerData.isKoop

  return cursor
}