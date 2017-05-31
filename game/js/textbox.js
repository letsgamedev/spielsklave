var TextBoxBig = function (text, name) { // x, y, key, frame, width, height, group
  var bmpTextName = null
  var bmpText = null
  var buttonNext = null

  // Char TextBox
  var charName = game.add.nineSlice(62, 150, 'textBoxBig', null, 84, 50, WORLD.topLayer)
  charName.fixedToCamera = true
  charName.visible = false
  var tweenCN = game.add.tween(charName.cameraOffset).to({
    y: 130
  }, 200, Phaser.Easing.Circular.Out)

  // Main TextBox
  var tb = game.add.nineSlice(game.width / 2, game.height - 20, 'textBoxBig', null, 20, 20, WORLD.topLayer)
  tb.fixedToCamera = true
  tb.anchor.set(0.5)

  var tweenHelper = {
    width: tb.width,
    height: tb.height,
    x: tb.cameraOffset.x,
    y: tb.cameraOffset.y
  }

  // Animate In
  var tween = game.add.tween(tweenHelper).to({
    width: 262,
    height: 66,
    y: game.height - 40
  }, 200, Phaser.Easing.Circular.Out, true)
  tween.chain(tweenCN)

  tween.onUpdateCallback(function (tween, ratio) {
    tb.resize(tweenHelper.width, tweenHelper.height)
    tb.cameraOffset.y = tweenHelper.y
  }, tween)

  tween.onComplete.add(function () {
    if (name != undefined) charName.visible = true
    addText()
  })

  isEvent = true

  function addText () {
    // Char name text
    bmpTextName = game.add.bitmapText(10, -35, 'fontBig', name, 10, WORLD.topLayer)
    charName.addChild(bmpTextName)
    // BigText
    bmpText = game.add.bitmapText(-120, -22, 'fontBig', '', 13, WORLD.topLayer)
    tb.addChild(bmpText)
    bmpText.maxWidth = 225
    var hold = false
    tb.timer = 0.03
    tb.myUpdate = function () {
      buttonNext.update()
      tb.timer -= DT
      if (text.length > 0 && hold == false && tb.timer < 0) {
        tb.timer = 0.03
        var index = text.indexOf(' ')
        var newWord = (index != -1) ? text.substr(0, index + 1) : text
        var oldText = bmpText._text
        bmpText.setText(oldText + newWord)
        if (bmpText.textHeight / 18 > 3) {
          hold = true
          bmpText.setText(oldText)
        } else {
          text = index != -1 ? text.substr(index + 1) : ''
        }

        if (text.length == 0) {
          hold = true
        }
      } else {
        if (Pad.justDown(Pad.A)) {
          bmpText.setText('')
          hold = false
          if (text.length == 0) {
            removeTextBox()
          }
        }
      }
    }

    var buttonNext = game.add.sprite(117, 20, 'atlas', 'textboxbutton0', WORLD.topLayer)
    buttonNext.swapTime = 0.5
    buttonNext.visible = false
    buttonNext.update = function () {
      buttonNext.swapTime -= DT
      buttonNext.visible = hold
      if (buttonNext.swapTime < 0) {
        buttonNext.swapTime = 0.5
        buttonNext.frameName = (buttonNext.frameName == 'textboxbutton0' ? 'textboxbutton1' : 'textboxbutton0')
      }
    }
    tb.addChild(buttonNext)
  }

  function removeTextBox () {
    tb.destroy()
    charName.destroy()
    currentEvent = null
    isEvent = false
  }

  tb.myUpdate = function () {}

  currentEvent = tb
}

var HeadIcon = function (reference, offsetX, offsetY) {
  console.log(reference)
  var icon = game.add.sprite(offsetX, offsetY, 'atlas', 'icon_eye')
  reference.setIcon = function (id) {
    icon.frameName = id
  }
  reference.addChild(icon)
  icon.visible = false

  reference.headIcon = icon
}
