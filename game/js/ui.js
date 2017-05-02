var UI = function (world) {
  var ui = game.add.group()
  ui.fixedToCamera = true
  ui.cameraOffset.x = 10
  ui.cameraOffset.y = 10

  var head = game.add.sprite(0, 3, 'atlas', 'ui_head', ui)

  var health = []
  var x = 0
  var y = 0
  for (var i = 0; i < 10; i++) {
    var h = game.add.sprite(17 + x * 14, y * 14, 'atlas', 'health_full', ui)
    x++
    if (x >= 5) {
      y++
      x = 0
    }
    health.push(h)
  };

  var visible = 0

  ui.updateHealth = function () {
    visible = 0
    for (var i = 1; i <= health.length; i++) {
      var h = health[i - 1]
      if (i * 2 <= world.player.maxHP) {
        h.visible = true
        visible++
        if (world.player.hp >= i * 2) h.frameName = 'health_full'
        else if (world.player.hp == i * 2 - 1) h.frameName = 'health_half'
        else h.frameName = 'health_empty'
      } else {
        h.visible = false
      }
    };

    head.y = visible > health.length / 2 ? 3 : -2
  }

  // items
  var btnOffsetX = -40
  ui.btnY = game.add.sprite(game.width - 130 + btnOffsetX, -7, 'atlas', 'icon_id_0', ui)
  ui.btnB = game.add.sprite(game.width - 100 + btnOffsetX, -7, 'atlas', 'icon_id_7', ui)
  ui.btnX = game.add.sprite(game.width - 70 + btnOffsetX, -7, 'atlas', 'icon_id_1', ui)
  var map = MiniMap(game.width - 68, 0)
  ui.add(map)
  ui.miniMap = map
  ui.add(map.overlay)

  var scytheBar = ScytheBar()
  ui.add(scytheBar)

  ui.setIconY = function (id) {
    setIcon(ui.btnY, id)
  }

  ui.setIconB = function (id) {
    setIcon(ui.btnB, id)
  }

  ui.setIconX = function (id) {
    setIcon(ui.btnX, id)
  }

  ui.update = function () {
    scytheBar.update()

    var playerKoords = TB.convert2UIKoords(world.player)
    var semiTrans = playerKoords.y < 70 && playerKoords.x > 230
    ui.btnB.alpha = semiTrans ? 0.5 : 1
    ui.btnX.alpha = semiTrans ? 0.5 : 1
    ui.btnY.alpha = semiTrans ? 0.5 : 1
    ui.miniMap.alpha = semiTrans ? 0.5 : 1
    ui.miniMap.overlay.alpha = semiTrans ? 0.5 : 1
  }

  function setIcon (btn, id) {
    btn.frameName = 'icon_id_' + id
  }
  return ui
}

var Map = function (x, y) {
  var map = game.add.group()
  map.x = x
  map.y = y
  var openMap = game.add.sprite(0, 0, 'atlas', 'map_free')
  openMap.mask = game.add.graphics(0, 0)
  openMap.addChild(openMap.mask)
  openMap.mask.beginFill(0xffffff)
  openMap.mask.drawRect(0, 0, 1, 1)

  var mapImg = game.add.sprite(0, 0, 'atlas', 'map_cloud')

  map.add(mapImg)
  map.add(openMap)

  map.clearField = function (tileX, tileY) {
    openMap.mask.beginFill(0x0)
    openMap.mask.drawRect(tileX * 16, tileY * 16, 16, 16)
  }

  return map
}

var MiniMap = function (x, y) {
  var oPos = {x: x, y: y}
  var map = Map(x, y)

  var miniMapMask = null
  miniMapMask = game.add.graphics(0, 0)
  miniMapMask.beginFill(0x444444)
  miniMapMask.drawRoundedRect(0, 0, 16 * 3 + 1, 16 * 3 + 1, 14)

  map.setCenterTile = function (tileX, tileY) {
    console.log('create hole ', tileX, tileY)
    map.clearField(tileX, tileY)
    var tx = game.math.clamp(tileX, 1, 10)
    var ty = game.math.clamp(tileY, 1, 6)
    miniMapMask.x = (tx - 1) * 16
    miniMapMask.y = (ty - 1) * 16
    map.x = -(tx - 1) * 16 + oPos.x
    map.y = -(ty - 1) * 16 + oPos.y
  }
  map.addChild(miniMapMask)
  map.mask = miniMapMask

  var overlay = game.add.sprite(x - 1, y - 1, 'atlas', 'mapoverlay2')
  map.overlay = overlay

  return map
}

var ScytheBar = function () {
  var container = game.add.sprite(-5, 8, 'atlas', 'scythe_bar_container')
  var maxFill = game.add.sprite(4, 11, 'atlas', 'scythe_bar_max_down')
  var currentFill = game.add.sprite(4, 11, 'atlas', 'scythe_bar_max')

  maxFill.mask = game.add.graphics(0, 0)
  maxFill.addChild(maxFill.mask)
  maxFill.mask.beginFill(0xffffff)
  maxFill.mask.drawRect(0, 0, 40, 60)

  currentFill.mask = game.add.graphics(0, 0)
  currentFill.addChild(currentFill.mask)
  currentFill.mask.beginFill(0xffffff)
  currentFill.mask.drawRect(0, 0, 40, 60)

  container.addChild(maxFill)
  container.addChild(currentFill)

  container.update = function () {
    var max = PlayerData.scytheEnergyCurrentMax
    var current = PlayerData.scytheEnergyCurrent

    maxFill.mask.y = Math.floor(46 - (46 * max / 100))
    currentFill.mask.y = Math.floor(46 - (46 * current / 100))
  }
  return container
}

var DamageText = function (x, y, text) {
  bmp = game.add.bitmapText(x, y, 'fontDamage', text, 10, WORLD.topLayer)
  var tween = game.add.tween(bmp).to({
    y: y - 10
  }, 350, Phaser.Easing.Default, true)
  tween.onComplete.add(function () {
    destroyWrap(bmp)
  })

  var tween2 = game.add.tween(bmp).to({
    alpha: 0
  }, 150, Phaser.Easing.Default, true, 200)
}

var ScytheEnergyBubble = function (reference) {
  var koords = TB.convert2UIKoords(reference)
  var bubble = game.add.sprite(koords.x, koords.y, 'atlas', 'energy_bulb_4')
  bubble.anchor.set(0.5)
  bubble.fixedToCamera = true
  var bulbAnim = addAnimation(bubble, 'bulb', 'energy_bulb', 16, 10, false)
  bulbAnim.play()
  bubble.scale.set(2)
  var tween = game.add.tween(bubble.cameraOffset).to({
    y: 18,
    x: 18
  }, 1000, Phaser.Easing.Cubic.InOut, true)
  tween.onComplete.add(function () {
    PlayerData.addScytheEnergy(reference.scytheEnergy)
    bubble.destroy()
  })
}

var ScytheEnergyBubbleVarB = function (reference) {
  var bubble = game.add.sprite(reference.x, reference.y, 'atlas', 'energy_bulb_4')
  bubble.anchor.set(0.5)
  var bulbAnim = addAnimation(bubble, 'bulb', 'energy_bulb', 16, 16, false)
  bulbAnim.play()
  bubble.scale.set(1)
  var tween = game.add.tween(bubble.cameraOffset).to({
  }, 700, Phaser.Easing.Cubic.InOut, true)
  tween.onUpdateCallback(function (tween, ratio) {
    bubble.x = Phaser.Math.linearInterpolation([bubble.x, WORLD.player.x], ratio)
    bubble.y = Phaser.Math.linearInterpolation([bubble.y, WORLD.player.y], ratio)
  })
  tween.onComplete.add(function () {
    PlayerData.addScytheEnergy(reference.scytheEnergy)
    bubble.destroy()
  })
}
