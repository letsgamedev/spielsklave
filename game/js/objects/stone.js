var Stone = function (world, x, y) {
  var stone = G.Sprite(x, y, 'stone_sit', world.middleLayer)
  setBasicFunctionallityToObject(stone)
  setObjectSuckable(stone, 15, breakStone)
  
  stone.body.drag = 0
  stone.body.friction = 0
  stone.anchor.set(0.5, 0.75)
  stone.body.setSize(14, 14)
  stone.body.y += 9

  addAnimation(stone, 'onSuck', 'stone_roll', 12, true)
  addAnimation(stone, 'explode', 'stone_explode', 12, false)
  stone.animations.add('drop', ['stone_sit'], 12, true)
  stone.animations.add('carry', ['stone_roll_0'], 12, true)

  function breakStone() {
    var ani = stone.animations.play('explode')
    stone.suckable = false
    ani.onComplete.add(function () {
      stone.kill()
      stone.x = stone.y = -9999
    })
  }

  return stone
}