var Stone = function (world, x, y) {
  var stone = game.add.sprite(x, y, 'atlas', 'stone_sit', world.middleLayer)
  game.physics.ninja.enable(stone, 1)
  stone.isFix = true
  stone.anchor.set(0.5, 0.75)
  stone.body.immovable = true
  stone.body.setSize(14, 14)
  stone.body.y += 9
  stone.myUpdate = function () {
  }

  stone.interact = function () {
  }

  return stone
}

var FenceMaker = function (id) {
  return function Fance (world, x, y) {
    var fence = game.add.sprite(x, y - 16, 'atlas', 'graveyard_fence_' + id, world.middleLayer)
    game.physics.ninja.enable(fence, 1)
    fence.isFix = true
    fence.body.setSize(8, 8)
    fence.anchor.set(0.5, 0.9)
    fence.body.immovable = true
    fence.myUpdate = function () {
    }

    fence.interact = function () {
    }

    return fence
  }
}
