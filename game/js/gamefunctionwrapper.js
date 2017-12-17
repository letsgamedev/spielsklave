const G = {
  Sprite: function (x, y, name, group) {
    let sprite = game.add.sprite(x, y, 'atlas', name)
    if (group) {
      if (typeof group.add === 'function') group.add(sprite)
      else if (typeof group.addChild === 'function') group.addChild(sprite)
      else throw new Error('Cannot add ' + name + ' sprite. ' + group + ' is nor compatible.')
    }

    return sprite
  },

  Tween: function (object, config, timeInMilliSeconds, onComplete) {
    var tween = game.add.tween(object).to(config, timeInMilliSeconds, Phaser.Easing.Default, false)
    if (onComplete) {
      tween.onComplete.add(onComplete)
    }
    return tween
  },

  TweenCubic: function (object, config, timeInMilliSeconds, onComplete) {
    return G.Tween(object, config, timeInMilliSeconds, onComplete).easing(Phaser.Easing.Cubic.InOut)
  },

  StepUpdateTween: function (object, config, timeInMilliSeconds, onComplete) {
    var tween = G.Tween(object, {}, timeInMilliSeconds, onComplete)

    var lastProgess = 0
    tween.onUpdateCallback(function (tween, progress) {
      for (var property in config) {
        if (config.hasOwnProperty(property)) {
          object[property] += config[property] * (progress - lastProgess)
        }
      }
      lastProgess = progress
    })

    return tween
  },

  timeEvent: function (seconds, func, scope) {
    game.time.events.add(Phaser.Timer.SECOND * seconds, func, scope)
  },

  playMusic: function (name, volume, loop, pitch) {
    volume = (volume === null || volume === undefined) ? 1 : volume
    return G.sound(name, volume * Game.config.globalMusicVolume, loop, pitch)
  },

  playSound: function (name, volume, loop, pitch) {
    volume = (volume === null || volume === undefined) ? 1 : volume
    return G.sound(name, volume * Game.config.globalSoundVolume, loop, pitch)
  },

  sound: function (name, volume, loop, pitch) {
    console.log('sound', name, volume)
    var sound = game.add.audio(name, volume, loop)
    sound.play()
    if (sound._sound) sound._sound.playbackRate.value = pitch || 1
    return sound
  },

  addAnimation: function (obj, name, assetsName, fps, loop, isNumericIndex) {
    var animNames = []
    for (var i = 0; i < 30; i++) {
      animNames.push(assetsName + '_' + i)
    };
    return obj.animations.add(name, animNames, fps, loop, isNumericIndex)
  },

  sleep: function (millisec) {
    game.paused = true
    setTimeout(function () {
      game.paused = false
    }, millisec)
  },

  setBasicFunctionallityToObject: function (object) {
    game.physics.ninja.enable(object, 1)
    object.isFix = true
    object.isCarry = false
    object.isShoot = false
    object.body.immovable = true

    object.myUpdate = nothing
    object.interact = nothing
    object.onCollide = nothing
  },

  setObjectSuckable: function (object, dmg, onBreakCallback) {
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
}
