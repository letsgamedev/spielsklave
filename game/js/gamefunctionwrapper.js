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
  }
}
