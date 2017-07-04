/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
This is the pig charakter.
The player can take over the controll of
this or even a second player can handle
this character with the mouse.player

In single player the pig is controled
like the demon.

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The pig object
*/
var Pig = function (world, x, y) {
  var pig = game.add.sprite(x, y, 'atlas', 'pig_walk_down_1', world.middleLayer)

  // Configure physics
  game.physics.ninja.enable(pig, 1, 0, 4)
  pig.body.drag = 0.001
  pig.damageSave = true

    // Config body size and alignment
  pig.anchor.set(0.5, 0.8)
  pig.body.setSize(8, 8)
  pig.ySortOffset = -5

  // Prepare animations
  pig.animations.add('stand_up', ['pig_walk_up_1'], 24, true)
  pig.animations.add('stand_down', ['pig_walk_down_1'], 12, true)
  pig.animations.add('stand_left', ['pig_walk_left_1'], 12, true)
  pig.animations.add('stand_right', ['pig_walk_right_1'], 12, true)
  pig.animations.add('stand_fat1_up', ['pig_walk_fat1_up_1'], 24, true)
  pig.animations.add('stand_fat1_down', ['pig_walk_fat1_down_1'], 12, true)
  pig.animations.add('stand_fat1_left', ['pig_walk_fat1_left_1'], 12, true)
  pig.animations.add('stand_fat1_right', ['pig_walk_fat1_right_1'], 12, true)
  pig.animations.add('sit', ['pig_sit_0'], 12, true)

  function addSuckAnimation (direction) {
    var ani = pig.animations.add('suck_' + direction + '_init', ['pig_suck_' + direction + '_0'], 12, false)
    ani.onComplete.add(function () { pig.animations.play('suck_' + direction) })
    pig.animations.add('suck_' + direction, ['pig_suck_' + direction + '_1', 'pig_suck_' + direction + '_2', 'pig_suck_' + direction + '_3', 'pig_suck_' + direction + '_2'], 12, true)
  }
  addSuckAnimation('up')
  addSuckAnimation('down')
  addSuckAnimation('left')
  addSuckAnimation('right')

  function addShootAnimation (direction) {
    var ani = pig.animations.add('shoot_' + direction, ['pig_suck_' + direction + '_2', 'pig_suck_' + direction + '_1', 'pig_suck_' + direction + '_0'], 30, false)
    ani.onComplete.add(function () {
      console.log('SHOOT COMPET')
      pig.state = STATES.NORMAL
      doStandAnimation(lookDirection)
    })
  }

  addShootAnimation('up')
  addShootAnimation('down')
  addShootAnimation('left')
  addShootAnimation('right')

  addAnimation(pig, 'walk_down', 'pig_walk_down', 12, true)
  addAnimation(pig, 'walk_up', 'pig_walk_up', 12, true)
  addAnimation(pig, 'walk_left', 'pig_walk_left', 12, true)
  addAnimation(pig, 'walk_right', 'pig_walk_right', 12, true)
  addAnimation(pig, 'walk_fat1_down', 'pig_walk_fat1_down', 12, true)
  addAnimation(pig, 'walk_fat1_up', 'pig_walk_fat1_up', 12, true)
  addAnimation(pig, 'walk_fat1_left', 'pig_walk_fat1_left', 12, true)
  addAnimation(pig, 'walk_fat1_right', 'pig_walk_fat1_right', 12, true)
  pig.animations.play('stand_down')

  // Private variables
  var speed = 110
  var minDis = 30
  var teleportDistance = 90
  var lookDirection = DOWN
  var showedLookDirection = DOWN
  var walkSave = 0
  var sameDirectionCount = 0
  var lastDirection = 0
  var currentTween = null

  pig.state = STATES.NORMAL

  /**
  The pig will follow the player if its not controlled by a human.
  May be some pathfinding will be added later.
  */
  pig.update = function () {
    // Yes, this function is a bit messi
    pig.damageSave = world.player.state != STATES.STONE && pig.state == STATES.NORMAL
    if (pig.carryedItem) pig.updateCarryedItem()

    if (world.player.state == STATES.STONE && world.cursor.visible == false) return
    if (pig.state == STATES.SIT) return

    var follow = world.cursor.visible ? world.cursor : world.player.body
    minDis = world.cursor.visible ? 2 : 30
    var distance = game.math.distance(follow.x, follow.y, pig.body.x, pig.body.y)

    var dirKey = Math.round(game.math.angleBetweenPoints(pig, follow) / Math.PI * 2)

    switch (dirKey) {
      case 0: lookDirection = RIGHT; break
      case 1: lookDirection = DOWN; break
      case -2:
      case 2: lookDirection = LEFT; break
      case -1: lookDirection = UP; break
    }

    if (distance > teleportDistance && world.cursor.visible == false && currentTween == null) {
      pig.teleport()
    }

    if (distance > minDis) {
      var direction = {
        x: (follow.x - pig.body.x) / distance,
        y: (follow.y - pig.body.y) / distance
      }

      var speedIntern = speed * 0.49

      pig.body.x += direction.x * speedIntern * DT
      pig.body.y += direction.y * speedIntern * DT

      if (lastDirection == dirKey) sameDirectionCount++
      else sameDirectionCount = 0

      if (sameDirectionCount > 5) {
        doWalkAnimation(lookDirection)
        showedLookDirection = lookDirection
      }

      lastDirection = dirKey
      walkSave = 0
    } else {
      if (walkSave < 6) {
        walkSave++
      } else {
        doStandAnimation(lookDirection)
        showedLookDirection = lookDirection
      }
    }
  }

  function doWalkAnimation (dir) {
    var fatLevel = ''
    if (pig.carryedItem) fatLevel = 'fat1_'
    pig.animations.play('walk_' + fatLevel + lookDirection)
  }

  function doStandAnimation (dir) {
    var fatLevel = ''
    if (pig.carryedItem) fatLevel = 'fat1_'
    pig.animations.play('stand_' + fatLevel + lookDirection)
  }

  pig.sitDown = function () {
    if (pig.carryedItem) {
      var item = pig.releaseCarryedItem()
    }
    pig.state = STATES.SIT
    pig.setUI()
    pig.animations.play('sit')
  }

  pig.standUp = function () {
    pig.state = STATES.NORMAL
    pig.setUI()
    doStandAnimation(lookDirection)
    showedLookDirection = lookDirection
  }

  pig.suck = function () {
    /*
      suche alle objekte die in der entsprechenden
      richtung rumliegen und nimmt das, welches
      am nahesten dran ist. dieses objekt soll zum
      schwein getweent werden. wenn das schwein
      dabei getroffen wird, wird der vorgang
      abgebrochen. man kann sich erst dann
      wieder wieder bewegen, wenn der tween
      abgeschlossen ist.
    */

    pig.animations.play('suck_' + showedLookDirection + '_init')

    var dist = 60
    var width = 32

    var objects = world.objects.filter(function (o) {
      var rect = null
      switch (showedLookDirection) {
        case UP:
          rect = new Phaser.Rectangle(pig.x - width / 2, pig.y - dist, width, dist)
          break
        case DOWN:
          rect = new Phaser.Rectangle(pig.x - width / 2, pig.y, width, dist)
          break
        case LEFT:
          rect = new Phaser.Rectangle(pig.x - dist, pig.y - width / 2, dist, width)
          break
        case RIGHT:
          rect = new Phaser.Rectangle(pig.x, pig.y - width / 2, dist, width)
          break
      }

      if (rect !== null && o.suckable === true) {
        return rect.intersects(o)
      }
      return false
    })

    var object = null

    if (objects.length > 0) {
      var nearestObj = objects[0]
      var min = Phaser.Math.distance(nearestObj.x, nearestObj.y, pig.x, pig.y)
      for (var i = 0; i < objects.length; i++) {
        var newValue = Phaser.Math.distance(objects[i].x, objects[i].y, pig.x, pig.y)
        if (newValue < min) {
          nearestObj = objects[i]
          min = newValue
        }
      }

      if (nearestObj.shootTween) {
        nearestObj.shootTween.stop(true)
        nearestObj.shootTween = null
      }

      nearestObj.onSuck()
      nearestObj.body.immovable = false
      pig.state = STATES.SUCK
      nearestObj.isCarry = true

      var tween = game.add.tween(nearestObj.body).to({
        x: pig.x,
        y: pig.y
      }, 8 * min, Phaser.Easing.Quadratic.In, true)
      tween.onComplete.add(function () {
        nearestObj.carry()
        pig.carryItem(nearestObj)

        pig.state = STATES.NORMAL
        doStandAnimation(lookDirection)
      })
    } else {
      // no suckable objects
      pig.state = STATES.SUCK
      timeEvent(0.5, function () {
        pig.state = STATES.NORMAL
        doStandAnimation(lookDirection)
      })
    }

    console.log(objects.length)
  }

  pig.carryItem = function (item) {
    pig.carryedItem = item
    item.visible = false
    // pig.addChild(item)
    console.log(item.body)
  }

  pig.updateCarryedItem = function () {
    var xOffSet = 0
    var yOffSet = 0
    var body = {x: 0, y: 0}
    var dist = 10
      /* switch (showedLookDirection) {
        case UP: xOffSet = 0; yOffSet = -dist; body = {x:2, y:22}
        break
        case DOWN: xOffSet = 0; yOffSet = dist; body = {x:2, y:22}
        break
        case LEFT: xOffSet = -dist; yOffSet = 0; body = {x:22, y:2}
        break
        case RIGHT: xOffSet = dist; yOffSet = 0; body = {x:22, y:2}
        break
      } */
      // pig.body.setSize(8 + body.x, 8 + body.y)
    pig.carryedItem.body.x = pig.body.x + xOffSet
    pig.carryedItem.body.y = pig.body.y + yOffSet
  }

  pig.shoot = function () {
    if (pig.carryedItem) {
      var item = pig.releaseCarryedItem()
      item.isShoot = true
      item.body.immovable = false

      pig.animations.play('shoot_' + showedLookDirection)
      pig.state = STATES.SHOOT

      var dist = 16 * 3
      var throwBack = {x: 0, y: 0}

      switch (showedLookDirection) {
        case UP: dist = {x: 0, y: -dist}; throwBack.y = 5
          break
        case DOWN: dist = {x: 0, y: dist}; throwBack.y = -5
          break
        case LEFT: dist = {x: -dist, y: 0}; throwBack.x = 5
          break
        case RIGHT: dist = {x: dist, y: 0}; throwBack.x = -5
          break
      }

      item.onShoot()

      item.shootTween = game.add.tween(item.body).to({
        x: pig.x + dist.x,
        y: pig.y + dist.y
      }, 200, Phaser.Easing.Default, true)
      item.shootTween.onComplete.add(function () {
        item.body.origin.x = item.body.x
        item.body.origin.y = item.body.y
        item.body.immovable = true
        item.isShoot = false
        item.stay()
      })

      pig.body.x += throwBack.x
      pig.body.y += throwBack.y
    }
  }

  pig.releaseCarryedItem = function () {
    pig.body.setSize(8, 8)
    var item = pig.carryedItem
    item.visible = true
    pig.carryedItem = null
    world.middleLayer.add(item)
    item.isCarry = false
    item.body.origin.x = item.body.x
    item.body.origin.y = item.body.y
    item.body.immovable = true
    return item
  }

  pig.onHit = function (self, enemy) {
    // GenPool.onHit;
    console.log(enemy.harmless)
    if (!enemy.harmless) {
      if (pig.carryedItem) {
        var item = pig.releaseCarryedItem()
      }
      world.player.fromStone()
      world.player.setUI()
    }
  }

  /*
  Handels the input from Pad class. Has to be called every frame.
  */
  pig.input = function () {
    if (pig.state == STATES.SIT) return
    if (world.player.state == STATES.STONE && world.cursor.visible == false) {
      var stand = true
      var newAnimation = 'stand'

      var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1
      var fatFaktor = pig.carryedItem ? 0.5 : 1
      // Process movement and animation
      if (!(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
        function setMove (padKey, axis, multi, dirID) {
          if (Pad.isDown(padKey)) {
            pig.body[axis] += DT * speed * fatFaktor * diagonalFactor * multi
            stand = false
            lookDirection = dirID
          }
        }
        setMove(Pad.LEFT, 'x', -1, LEFT)
        setMove(Pad.RIGHT, 'x', 1, RIGHT)
        setMove(Pad.UP, 'y', -1, UP)
        setMove(Pad.DOWN, 'y', 1, DOWN)

        if (pig.animations.currentAnim.name.includes('stand') || diagonalFactor == 1) {
          doWalkAnimation(lookDirection)
          showedLookDirection = lookDirection
        }
      }

      if (stand) {
        doStandAnimation(lookDirection)
        showedLookDirection = lookDirection
      }
    }
  }

  pig.setUI = function () {
    world.ui.setIconY(6)
    switch (pig.state) {
      case STATES.NORMAL: world.ui.setIconB(3); break
      case STATES.SIT: world.ui.setIconB(4); break
    }

    world.ui.setIconX(2)
  }

  pig.teleport = function () {
    // puff!
    if (pig.carryedItem) {
      var item = pig.releaseCarryedItem()
    }
    var dis = 16
    var xOff = 0
    var yOff = 0
    pig.state = STATES.NORMAL
    switch (world.player.lookDirection) {
      case UP: yOff = dis; break
      case DOWN: yOff = -dis; break
      case LEFT: xOff = dis; break
      case RIGHT: xOff = -dis; break
    }

    PigSmoke(pig, world)

    pig.body.x = world.player.body.x + xOff
    pig.body.y = world.player.body.y + yOff

    PigSmoke(pig.body, world)
  }

  pig.tweenToPlayer = function () {
    if (pig.state == STATES.SIT) pig.standUp()
    world.player.setUI()
    var tween = game.add.tween(pig.body).to({
      x: world.player.x,
      y: world.player.y
    }, 500, Phaser.Easing.Default, true)
    tween.onComplete.add(function () {
      currentTween = null
    })
    currentTween = tween
  }

  return pig
}

var ReflectionPig = function (world) {
  var pig = world.pig

  var reflection = game.add.sprite(0, 0, 'atlas', 'pig_walk_down_1', world.reflectionLayer)
  reflection.scale.y = -1

  reflection.animations.add('stand_up', ['pig_walk_up_1'], 12, true)
  reflection.animations.add('stand_down', ['pig_walk_down_1'], 12, true)
  reflection.animations.add('stand_left', ['pig_walk_left_1'], 12, true)
  reflection.animations.add('stand_right', ['pig_walk_right_1'], 12, true)
  addAnimation(reflection, 'walk_down', 'pig_walk_down', 10, true)
  addAnimation(reflection, 'walk_up', 'pig_walk_up', 10, true)
  addAnimation(reflection, 'walk_left', 'pig_walk_left', 10, true)
  addAnimation(reflection, 'walk_right', 'pig_walk_right', 10, true)
  reflection.animations.add('sit', ['pig_sit_0'], 12, true)
  reflection.alpha = 0.75

  reflection.update = function () {
    reflection.x = pig.body.x - 10
    reflection.y = pig.body.y + 24

    reflection.animations.play(pig.animations.currentAnim.name)
  }

  return reflection
}

var PigSmoke = function (xy, world) {
  var smoke = game.add.sprite(xy.x, xy.y, 'atlas', 'pig_smoke_0', world.middleLayer)
  smoke.anchor.set(0.6)
  smoke.ySortOffset = 5
  smoke.anim = addAnimation(smoke, 'play', 'pig_smoke', 12, false)
  smoke.anim.onComplete.add(destroyWrap(smoke))
  smoke.animations.play('play')
}
