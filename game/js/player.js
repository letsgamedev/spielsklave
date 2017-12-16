/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
This is the Player aka the demon contructor.

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The player object
*/
var Player = function (world, x, y) {
 // Private variables
  var speed = 80

  var player = G.Sprite(x, y, 'dengel_walk_down_1', world.middleLayer)
  // Configure physics
  game.physics.ninja.enable(player, 1)
  player.body.drag = 0.000
  player.body.bounce = 0.000
  player.body.friction = 0.000
  console.log(player)
  player.body.x -= 3 * 8
  player.body.y -= 4 * 8
  player.body.collideWorldBounds = false

  // Config body size and alignment
  player.body.setSize(12, 12)
  player.anchor.set(0.5, 0.6)

  player.state = STATES.NORMAL
  player.maxHP = 8
  player.hp = 8

  player.item1 = null
  player.item2 = null

  player.item1 = Scythe(player, world)

  // Prepare animations
  player.animations.add('stand_up', ['dengel_stand_up_0'], 12, true)
  player.animations.add('stand_down', ['dengel_stand_down_0'], 12, true)
  player.animations.add('stand_left', ['dengel_stand_left_0'], 12, true)
  player.animations.add('stand_right', ['dengel_stand_right_0'], 12, true)
  addAnimation(player, 'walk_down', 'dengel_walk_down', 20, true)
  addAnimation(player, 'walk_up', 'dengel_walk_up', 20, true)
  addAnimation(player, 'walk_left', 'dengel_walk_left', 20, true)
  addAnimation(player, 'walk_right', 'dengel_walk_right', 20, true)

  player.animations.play('stand_down')

  player.inChange = false
  player.damageSave = false
  player.humanInput = true
  player.lookDirection = DOWN

  player.update = function () {
    if (player.item1) player.item1.update()
    if (player.item2) player.item2.update()
  }

  function setMove (padKey, axis, multi, dirID) {
    if (Pad.isDown(padKey)) {
      player.body[axis] += DT * speed * 1 * multi
      player.state = STATES.WALK
      player.lookDirection = dirID
    }
  }

  /*
  Handels the input from Pad class. Has to be called every frame.
  */
  player.input = function () {
    player.state = STATES.STAND

    var diagonalFactor = Pad.isDiagonalInput() ? 0.707 : 1
    var isTwoSideKeyDown = Pad.isCounterDirektionInput()
    // Process movement and animation
    if (player.state !== STATES.STONE && player.state !== STATES.INUSE) {
      if (!isTwoSideKeyDown) {
        setMove(Pad.LEFT, 'x', -1, LEFT)
        setMove(Pad.RIGHT, 'x', 1, RIGHT)
        setMove(Pad.UP, 'y', -1, UP)
        setMove(Pad.DOWN, 'y', 1, DOWN)
      }

      if (player.state === STATES.WALK && (diagonalFactor === 1 || player.animations.currentAnim.name.indexOf('stand') !== -1)) {
        player.animations.play('walk_' + player.lookDirection)
      } else if (player.state === STATES.STAND) {
        player.animations.play('stand_' + player.lookDirection)
      }
    }
  }

  player.onHit = GenPool.onHit

  // Helper for turn on/off stone swap
  function setHumanInput (isOn) {
    player.humanInput = isOn
    if (isOn) {
      fromStone()
    } else {
      toStone()
    }
  }

  function swapStone () {
    if (player.inChange) return
    if (player.state == STATES.STONE) {
      fromStone()
      player.setUI()
      if (world.pig.state == STATES.NORMAL) world.pig.teleport()
    } else {
      toStone()
      world.pig.setUI()
    }
  }

  function setUI () {
    world.ui.setIconY(0)
    world.ui.setIconB(7)
    world.ui.setIconX(1)
  }

  // Creates a stone statue an replaces the demon char
  function toStone () {
    player.visible = false
    player.state = STATES.STONE
    player.animations.play('stand_' + player.lookDirection)
    player.shell = PlayerShell(world, player)
  }

  // shatters the stone statue and get back the demon char
  function fromStone () {
    if (player.state == STATES.STONE) {
      player.shell.shutter()
      player.state = STATES.NORMAL
      player.inChange = true
      player.visible = true
    }
  }

  /* usefull vor event stuff also used vor map transitions */
  function walkAuto (dir, tiles) {
    tiles = tiles || 1
    var x = 0
    var y = 0

    switch (dir) {
      case UP: y = -16 * tiles; break
      case DOWN: y = 16 * tiles; break
      case LEFT: x = -16 * tiles; break
      case RIGHT: x = 16 * tiles; break
    }

    var tween = G.Tween(player.body, {
      x: player.x + x,
      y: player.y + y
    }, 200 * tiles).start()

    player.animations.play('walk_' + dir)
    player.lookDirection = dir
  }

  function myPostUpdate () {
    if (player.attachedEvent == null) {
      player.headIcon.visible = false
      player.reflection.myUpdate()
    }
  }

  HeadIcon(player, 8, -25)

  player.fromStone = fromStone
  player.walkAuto = walkAuto
  player.myPostUpdate = myPostUpdate
  player.swapStone = swapStone
  player.setUI = setUI

  return player
}

var ReflectionPlayer = function (world) {
  var player = world.player

  var reflection = G.Sprite(0, 0, 'player_walk_down_1', world.reflectionLayer)
  reflection.scale.y = -1

  reflection.animations.add('stand_up', ['player_walk_up_1'], 12, true)
  reflection.animations.add('stand_down', ['player_walk_down_1'], 12, true)
  reflection.animations.add('stand_left', ['player_walk_left_1'], 12, true)
  reflection.animations.add('stand_right', ['player_walk_right_1'], 12, true)
  addAnimation(reflection, 'walk_down', 'player_walk_down', 10, true)
  addAnimation(reflection, 'walk_up', 'player_walk_up', 10, true)
  addAnimation(reflection, 'walk_left', 'player_walk_left', 10, true)
  addAnimation(reflection, 'walk_right', 'player_walk_right', 10, true)
  reflection.alpha = 0.75
  world.player.reflection = reflection

  reflection.myUpdate = function () {
    var follow = player.state == STATES.STONE ? player.shell : player
    reflection.x = follow.body.x - 32
    reflection.y = follow.body.y + 50

    reflection.animations.play(player.animations.currentAnim.name)
  }

  return reflection
}
