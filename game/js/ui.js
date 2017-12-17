var UI = function (world) {// eslint-disable-line
  var ui = game.add.group()
  ui.fixedToCamera = true
  ui.cameraOffset.x = 10
  ui.cameraOffset.y = 10

  var head = G.Sprite(0, 3, 'ui_head', ui)

  var health = []
  var x = 0
  var y = 0
  for (var i = 0; i < 10; i++) {
    var h = G.Sprite(17 + x * 14, y * 14, 'health_full', ui)
    x++
    if (x >= 5) {
      y++
      x = 0
    }
    health.push(h)
  };

  var visibleHearts = 0

  ui.updateHealth = function () {
    visibleHearts = 0
    for (var i = 1; i <= health.length; i++) {
      var h = health[i - 1]
      if (i * 2 <= world.player.maxHP) {
        h.visible = true
        visibleHearts++
        if (world.player.hp >= i * 2) h.frameName = 'health_full'
        else if (world.player.hp === i * 2 - 1) h.frameName = 'health_half'
        else h.frameName = 'health_empty'
      } else {
        h.visible = false
      }
    };

    head.y = visibleHearts > health.length / 2 ? 3 : -2
  }

  // items
  var btnOffsetX = -40
  ui.btnY = G.Sprite(game.width - 130 + btnOffsetX, -7, 'icon_id_0', ui)
  ui.btnB = G.Sprite(game.width - 100 + btnOffsetX, -7, 'icon_id_7', ui)
  ui.btnX = G.Sprite(game.width - 70 + btnOffsetX, -7, 'icon_id_1', ui)

  var map = MiniMap(game.width - 68, 0)
  ui.add(map)
  ui.miniMap = map
  ui.add(map.overlay)

  ui.hpLayer = game.add.group()

  var scytheBar = ScytheBar()
  ui.add(scytheBar)

  var setIcon = btn => id => { btn.frameName = 'icon_id_' + id }
  ui.setIconY = setIcon(ui.btnY)
  ui.setIconB = setIcon(ui.btnB)
  ui.setIconX = setIcon(ui.btnX)

  ui.update = function () {
    scytheBar.update()

    ui.hpLayer.forEach(bar => bar.update())

    var playerKoords = TB.convert2UIKoords(world.player)
    var semiTrans = playerKoords.y < 70 && playerKoords.x > 230
    ui.btnB.alpha = semiTrans ? 0.5 : 1
    ui.btnX.alpha = semiTrans ? 0.5 : 1
    ui.btnY.alpha = semiTrans ? 0.5 : 1
    ui.miniMap.alpha = semiTrans ? 0.5 : 1
    ui.miniMap.overlay.alpha = semiTrans ? 0.5 : 1
  }
  return ui
}

var WorldMap = function (x, y) {
  var map = game.add.group()
  map.x = x
  map.y = y

  var openMap = G.Sprite(0, 0, 'map_free')
  openMap.mask = game.add.graphics(0, 0)
  openMap.addChild(openMap.mask)
  openMap.mask.beginFill(0xffffff)
  openMap.mask.drawRect(0, 0, 1, 1)

  var mapImg = G.Sprite(0, 0, 'map_cloud')

  map.add(mapImg)
  map.add(openMap)

  map.clearField = function (tilePosition) {
    openMap.mask.beginFill(0x0)
    openMap.mask.drawRect(tilePosition.x * 16, tilePosition.y * 16, 16, 16)
  }

  return map
}

var MiniMap = function (x, y) {
  var map = WorldMap(x, y)
  var oPos = {x: x, y: y}

  var miniMapMask = null
  miniMapMask = game.add.graphics(0, 0)
  miniMapMask.beginFill(0x444444)
  miniMapMask.drawRoundedRect(0, 0, 16 * 3 + 1, 16 * 3 + 1, 14)

  map.addChild(miniMapMask)
  map.mask = miniMapMask

  var overlay = G.Sprite(x - 1, y - 1, 'mapoverlay2')
  map.overlay = overlay

  map.setCenterTile = function (tilePosition) {
    console.log('create hole ', tilePosition.x, tilePosition.y)
    map.clearField(tilePosition)
    var tx = game.math.clamp(tilePosition.x, 1, 10)
    var ty = game.math.clamp(tilePosition.y, 1, 6)
    miniMapMask.x = (tx - 1) * 16
    miniMapMask.y = (ty - 1) * 16
    map.x = -miniMapMask.x + oPos.x
    map.y = -miniMapMask.y + oPos.y
  }

  return map
}

var ScytheBar = function () {
  var container = G.Sprite(-5, 8, 'scythe_bar_container')
  var maxFill = G.Sprite(4, 11, 'scythe_bar_max_down')
  var currentFill = G.Sprite(4, 11, 'scythe_bar_max')

  function createFillMask (fill) {
    fill.mask = game.add.graphics(0, 0)
    fill.addChild(fill.mask)
    fill.mask.beginFill(0xffffff)
    fill.mask.drawRect(0, 0, 40, 60)
    container.addChild(fill)
  }

  createFillMask(maxFill)
  createFillMask(currentFill)

  container.update = function () {
    var max = PlayerData.scytheEnergyCurrentMax
    var current = PlayerData.scytheEnergyCurrent

    maxFill.mask.y = Math.floor(46 - (46 * max / 100))
    currentFill.mask.y = Math.floor(46 - (46 * current / 100))
  }
  return container
}

var DamageText = function (x, y, text) {// eslint-disable-line
  let bmp = game.add.bitmapText(x, y, 'fontDamage', text, 10, WORLD.uiLayer)

  function destroyText () {
    TB.destroyWrap(bmp)
  }

  G.Tween(bmp, { y: '-10' }, 350, destroyText).start()
  G.Tween(bmp, { alpha: 0 }, 150).delay(200).start()
}

var ScytheEnergyBubble = function (reference) {// eslint-disable-line
  var koords = TB.convert2UIKoords(reference)
  var bubble = G.Sprite(koords.x, koords.y, 'energy_bulb_4')
  bubble.anchor.set(0.5)
  bubble.fixedToCamera = true
  var bulbAnim = G.addAnimation(bubble, 'bulb', 'energy_bulb', 10, false)
  bulbAnim.play()
  bubble.scale.set(2)
  G.TweenCubic(bubble.cameraOffset, {
    y: 18,
    x: 18
  }, 1000, addEnergyToPlayer).start()

  function addEnergyToPlayer () {
    PlayerData.addScytheEnergy(reference.scytheEnergy)
    bubble.destroy()
  }
}

var ScytheEnergyBubbleVarB = function (reference) {// eslint-disable-line
  var bubble = G.Sprite(reference.x, reference.y, 'energy_bulb_4')
  bubble.anchor.set(0.5)
  var bulbAnim = G.addAnimation(bubble, 'bulb', 'energy_bulb', 16, false)
  bulbAnim.play()
  bubble.scale.set(1)
  var tween = G.TweenCubic(bubble.cameraOffset, {
  }, 700, addEnergyToPlayer).start()

  // This way, and not with StepTween cause player is moving while animation
  tween.onUpdateCallback(function (tween, ratio) {
    bubble.x = Phaser.Math.linearInterpolation([bubble.x, WORLD.player.x], ratio)
    bubble.y = Phaser.Math.linearInterpolation([bubble.y, WORLD.player.y], ratio)
  })

  function addEnergyToPlayer () {
    PlayerData.addScytheEnergy(reference.scytheEnergy)
    bubble.destroy()
  }
}

var HPBar = function (reference) {// eslint-disable-line
  var bar = G.Sprite(0, 0, 'lpbar_back', WORLD.ui.hpLayer)
  var full = G.Sprite(2, 1, 'lpbar_full', bar)
  var isVisible = false

  bar.update = function () {
    updatePosition()
    updateFullWidth()
    checkVisibility()
    checkIfHPBarShouldBeDestroyed()
  }

  function updatePosition () {
    bar.x = reference.left
    bar.y = reference.top - 5
  }

  function updateFullWidth () {
    full.width = Math.floor((reference.hp / reference.maxHp) * 17)
    full.width = Phaser.Math.clamp(full.width, 0, 17)
  }

  function checkVisibility () {
    if (isVisible) return
    bar.visible = reference.hp !== reference.maxHp
    if (bar.visible) isVisible = true
  }

  function checkIfHPBarShouldBeDestroyed () {
    if (full.width === 0) bar.destroy()
  }

  return bar
}
