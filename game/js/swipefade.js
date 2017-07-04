var SwipeFade = function (world, from, kind, callBack) {
  var container = game.add.group()
  container.fixedToCamera = true

  var addShape = function (x, y) {
    return game.add.sprite(x, y, 'atlas', 'raute', container)
  }

  var addBlack = function (x, y, anchorX, anchorY) {
    var black = game.add.sprite(x, y, 'atlas', 'black', container)
    black.width = game.width + 24
    black.height = game.height + 24
    black.anchor.set(anchorX, anchorY)
    return black
  }

  var tweenContainer = function (x, y) {
    var tween = game.add.tween(container.cameraOffset).to({
      x: x,
      y: y
    }, 800, Phaser.Easing.Cubic.InOut, true)

    tween.onComplete.add(function () {
      callBack()
      if (kind === 'in') container.destroy()
    }, this)
  }

  world.isInTransition = true
  if (kind == 'out') {
    console.log('KIND', kind, from)
    switch (from) {
      case LEFT:
        for (var i = 0; i < 9; i++) addShape(-24, 24 * i)
        addBlack(-24 + 12, 0, 1, 0)
        tweenContainer(game.width + 24, 0)
        break
      case RIGHT:
        for (var i = 0; i < 9; i++) addShape(game.width, 24 * i)
        addBlack(game.width + 12, 0, 0, 0)
        tweenContainer(-game.width - 12, 0)
        break
      case UP:
        for (var i = 0; i < 16; i++) addShape(24 * i, -24)
        addBlack(0, -12, 0, 1)
        tweenContainer(0, game.height + 24)
        break
      case DOWN:
        for (var i = 0; i < 16; i++) addShape(24 * i, game.height)
        addBlack(0, game.height + 12, 0, 0)
        tweenContainer(0, -game.height - 12)
        break
    }
  } else { // in
    switch (from) {
      case LEFT:
        for (var i = 0; i < 9; i++) addShape(-24, 24 * i)
        addBlack(-24 + 12, 0, 0, 0)
        tweenContainer(game.width + 24, 0)
        break
      case RIGHT:
        for (var i = 0; i < 9; i++) addShape(game.width, 24 * i)
        addBlack(game.width + 12, 0, 1, 0)
        tweenContainer(-game.width - 24, 0)
        break
      case UP:
        for (var i = 0; i < 16; i++) addShape(24 * i, -36)
        addBlack(0, game.height, 0, 1)
        tweenContainer(0, game.height + 36)
        break
      case DOWN:
        for (var i = 0; i < 16; i++) addShape(24 * i, game.height)
        addBlack(0, game.height + 12, 0, 1)
        tweenContainer(0, -game.height - 24)
        break
    }
    world.stage.backgroundColor = MAPDATA[nextMapId].backgroundColor
  }
}
