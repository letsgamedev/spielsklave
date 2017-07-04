var Stone = function (world, x, y) {
  var stone = game.add.sprite(x, y, 'atlas', 'stone_sit', world.middleLayer)
  game.physics.ninja.enable(stone, 1)
  stone.isFix = true
  stone.suckable = true
  stone.isCarry = false
  stone.isShoot = false
  stone.body.drag = 0
  stone.shootDmg = 15
  stone.body.friction = 0
  stone.anchor.set(0.5, 0.75)
  stone.body.immovable = true
  stone.body.setSize(14, 14)
  stone.body.y += 9

  addAnimation(stone, 'onSuck', 'stone_roll', 12, true)
  addAnimation(stone, 'explode', 'stone_explode', 12, false)
  stone.animations.add('stay', ['stone_sit'], 12, true)
  stone.animations.add('carry', ['stone_roll_0'], 12, true)

  stone.myUpdate = function () {
  }

  stone.interact = function () {
  }

  stone.getDmg = function () {
    return stone.shootDmg
  }

  stone.onSuck = function () {
    stone.animations.play('onSuck')
  }

  stone.onShoot = function () {
    stone.animations.play('onSuck')
  }

  stone.onBreak = function () {
    var ani = stone.animations.play('explode')
    ani.onComplete.add(function () {
      stone.kill()
      stone.x = stone.y = -9999
    })
  }

  stone.stay = function () {
    stone.animations.play('stay')
  }
  stone.carry = function () {
    stone.animations.play('carry')
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

var HouseDoor = function (world, eventData) {
  var door = game.add.sprite(eventData.tileX * 8, eventData.tileY * 8 - 13, 'atlas', 'house_door_open_0', world.middleLayer)
  game.physics.ninja.enable(door, 1)
  door.isFix = true
  // door.body.setSize(8, 8)
  // door.anchor.set(0.5, 0.9)
  door.body.immovable = true
  addAnimation(door, 'open', 'house_door_open', 12, false)
  door.myUpdate = function () {
  }

  door.onCollide = function (self, collider) {
    door.animations.play('open')
    playSound('door_open')

    world.isInTransition = true
    SwipeFade(world, eventData.dest.walkIn, 'out', function () {
      world.startNextMap(eventData.dest.map, eventData.dest.tileX, eventData.dest.tileY, eventData.dest.walkIn)
    })
    door.onCollide = nothing
  }

  door.interact = nothing

  return door
}
