var Stone = function (world, x, y) {// eslint-disable-line
  var stone = G.Sprite(x, y, 'stone_sit', world.middleLayer)
  G.setBasicFunctionallityToObject(stone)
  G.setObjectSuckable(stone, 15, breakStone)

  stone.body.drag = 0
  stone.body.friction = 0
  stone.anchor.set(0.5, 0.75)
  stone.body.setSize(14, 14)
  stone.body.y += 9

  G.addAnimation(stone, 'onSuck', 'stone_roll', 12, true)
  G.addAnimation(stone, 'explode', 'stone_explode', 12, false)
  stone.animations.add('drop', ['stone_sit'], 12, true)
  stone.animations.add('carry', ['stone_roll_0'], 12, true)

  function breakStone () {
    var ani = stone.animations.play('explode')
    stone.suckable = false
    ani.onComplete.add(function () {
      stone.kill()
      stone.x = stone.y = -9999
    })
  }

  return stone
}
