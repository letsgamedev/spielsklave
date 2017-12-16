/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
LittleEgg is one of the first enemies in game

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The little egg enemy object
*/
var LittleEgg = function (world, x, y) {
  var egg = G.Sprite(x, y, 'little_egg_hatch_0', world.middleLayer)

  egg.strength = 1
  egg.maxHp = 30
  egg.hp = 30
  egg.scytheEnergy = 10

  egg.originPos = {x: x, y: y}
  addAnimation(egg, 'stand_down', 'little_egg_stand_down', 3, true)
  addAnimation(egg, 'stand_up', 'little_egg_stand_up', 3, true)
  addAnimation(egg, 'stand_left', 'little_egg_stand_left', 3, true)
  addAnimation(egg, 'stand_right', 'little_egg_stand_right', 3, true)
  addAnimation(egg, 'walk_down', 'little_egg_walk_down', 12, true)
  addAnimation(egg, 'walk_up', 'little_egg_walk_up', 12, true)
  addAnimation(egg, 'walk_left', 'little_egg_walk_left', 12, true)
  addAnimation(egg, 'walk_right', 'little_egg_walk_right', 12, true)
  addAnimation(egg, 'hatch', 'little_egg_hatch', 24, false)

  egg.hpbar = HPBar(egg)

  var EGG = 0
  var HATCHING = 1
  var HATCHED = 2

  egg.status = EGG

  // Configure physics
  game.physics.ninja.enable(egg, 1)
  egg.body.drag = 0.1
  var lookDirection = DOWN

  // Config body size and alignment
  egg.body.setSize(12, 12)
  egg.anchor.set(0.5, 0.6)

  egg.hitBox = new Phaser.Rectangle(-10, -10, 20, 20)

  var xDir = 0
  var yDir = 0
  var moveTime = 0
  var speed = 40
  var isBushSet = false

  var hitSaveTime = 0.15

  egg.getHitBox = GenPool.getHitBoxFunction(egg)

  egg.onHit = function (self, other) {
    if (hitSaveTime > 0) return
    hitSaveTime = 0.15
    egg.tint = 0x62B3F5
    playSound('hit2', 0.25)
    var dmg = self
    DamageText(egg.x, egg.y - 15, dmg)
    GenPool.throwBack(egg, world.player, 20, 100)
    egg.hp -= dmg
    if (egg.hp <= 0) {
      if (other.isEnergyDrain) {
        if (Game.variant == 1)ScytheEnergyBubbleVarB(egg)
        else ScytheEnergyBubble(egg)
      }
      egg.die()
    } else {
      if (egg.status === EGG) hatch()
    }
  }

  egg.die = function () {
    timeEvent(0.1, function () {
      PigSmoke(egg, world)
      playSound('explosion1')
      egg.kill()
    })
  }

  /**
  if the player is near the egg, it will hatch and
  walk in random directions
  */
  egg.myUpdate = function () {
    moveTime -= DT
    hitSaveTime -= DT
    if (hitSaveTime <= 0) egg.tint = 0xffffff
    switch (egg.status) {
      case EGG:
        if (hatchCheck()) hatch()
        break
      case HATCHING:
        if (egg.frameName == 'little_egg_hatch_4' && isBushSet == false && egg.hp == egg.maxHp) {
          isBushSet = true
          Bush(world, egg.originPos.x, egg.originPos.y)
          playSound('little_egg_hatch')
          egg.body.y++
        }
        break
      case HATCHED:
        if (moveTime <= 0) setNewMove()
        egg.body.x += DT * speed * xDir
        egg.body.y += DT * speed * yDir
        break
    }
  }

  /**
  checks if the player is near enough and inits the hatching if so.
  */
  function hatchCheck (forced) {
    var distancePlayer = TB.getDistance(world.player, egg.body)
    var distancePig = TB.getDistance(world.player, egg.body)
    var dist = Math.min(distancePlayer, distancePig)
    return dist < 40 || forced
  }

  function hatch () {
    var anim = egg.animations.play('hatch')
    egg.status = HATCHING
    anim.onComplete.add(function () {
      egg.status = HATCHED
    })
  }

  /**
  chooses a random direction to walk. There is a 50% chance the
  egg will stand in place.
  */
  function setNewMove () {
    switch (game.rnd.between(0, 7)) {
      case 0: xDir = 1; yDir = 0; lookDirection = RIGHT; break
      case 1: xDir = -1; yDir = 0; lookDirection = LEFT; break
      case 2: xDir = 0; yDir = 1; lookDirection = DOWN; break
      case 3: xDir = 0; yDir = -1; lookDirection = UP; break
      default: xDir = 0; yDir = 0
    }

    moveTime = 0.25 + Math.random() * 1
    setAnimation()
  }

  function setAnimation () {
    var kind = (xDir == 0 && yDir == 0) ? 'stand_' : 'walk_'
    egg.animations.play(kind + lookDirection)
  }

  return egg
}

var Bush = function (world, x, y) {
  var bush = G.Sprite(x, y + 4, 'little_egg_shell_0', world.middleLayer)
  game.physics.ninja.enable(bush, 1)
  bush.body.drag = 0.1
  bush.body.immovable = true

  bush.hitBox = new Phaser.Rectangle(-10, -10, 20, 20)

  bush.getHitBox = GenPool.getHitBoxFunction(bush)

  bush.onHit = function () {
    bush.kill()
  }
  bush.myUpdate = nothing
  bush.isFix = true
  bush.harmless = true
  bush.ySortOffset = -5
  bush.body.setSize(14, 10)
  bush.anchor.set(0.5, 0.8)
  world.enemies.push(bush)
}
