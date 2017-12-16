var setBasicFunctionallityToObject = function(object) {
  game.physics.ninja.enable(object, 1)
  object.isFix = true
  object.isCarry = false
  object.isShoot = false
  object.body.immovable = true

  object.myUpdate = nothing
  object.interact = nothing
  object.onCollide = nothing

}

var setObjectSuckable = function(object, dmg, onBreakCallback) {
  object.suckable = true
  object.shootDmg = dmg

  object.getDmg = function () {
    return object.shootDmg
  }

  object.onSuck = function () {
    object.animations.play('onSuck')
  }

  object.onShoot = function () {
    object.animations.play('onShoot')
  }

  object.onBreak = onBreakCallback

  object.drop = function () {
    object.animations.play('drop')
  }
}
