var DayNightOverlay = function (swapInterval) {// eslint-disable-line
  var overlay = game.add.graphics(0, 0)
  overlay.fixedToCamera = true
  overlay.blendMode = 4// 2
  overlay.swapInterval = swapInterval

  var timer = GameData.gamePlayTimeInSeconds % overlay.swapInterval

  overlay.beginFill(0xffffff)
  overlay.drawRect(0, 0, game.width, game.height)

  var NIGHT_COLOR = 0x0000a0
  // var DAWN_COLOR = 0xe04040

  overlay.alpha = LastMapInfo ? LastMapInfo.timeOverlay.alpha : 0
  overlay.tint = NIGHT_COLOR

  overlay.update = function () {
    timer += DT
    if (timer >= overlay.swapInterval) {
      timer = 0
      swapLight()
    }
  }

  function swapLight () {
    var finAlpha = overlay.alpha === 0 ? 1 : 0
    G.Tween(overlay, {
      alpha: finAlpha
    }, 3000).easing(Phaser.Easing.Cubic.InOut).start()
    G.timeEvent(overlay.swapInterval, swapLight, this)
  }

  return overlay
}
