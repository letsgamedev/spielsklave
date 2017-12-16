var TextBoxBig = function (text, name) {
  var bmpTextName = null
  var bmpText = null
  var words = text.split(' ')
  var hold = false
  var nextWordTimer = 0.03

  isEvent = true

  var charName = CharacterNameBox(62, 150, name)

  // Main TextBox
  var tb = game.add.nineSlice(game.width / 2, game.height - 20, 'textBoxBig', null, 20, 20, WORLD.uiLayer)
  tb.fixedToCamera = true
  tb.anchor.set(0.5)
  tb.myUpdate = nothing

  var buttonNext = NextPageButton(117, 20, tb)

  var tweenHelper = {
    width: tb.width,
    height: tb.height,
    y: tb.cameraOffset.y
  }

  function openTextBox () {
    var tween = G.Tween(tweenHelper, {
      width: 262,
      height: 66,
      y: game.height - 40
    }, 200, showText).easing(Phaser.Easing.Circular.Out).start()
    tween.onUpdateCallback(setBoxPositionWhileAnimating, tween)

    tween.chain(charName.getTween())
  }

  function setBoxPositionWhileAnimating (tween, ratio) {
    tb.resize(tweenHelper.width, tweenHelper.height)
    tb.cameraOffset.y = tweenHelper.y
  }

  function showText () {
    if (name != undefined) charName.visible = true
    addText()
  }

  function addText () {
    charName.showName()

    bmpText = game.add.bitmapText(-120, -22, 'fontBig', '', 13, WORLD.uiLayer)
    tb.addChild(bmpText)

    bmpText.maxWidth = 225
    tb.timer = nextWordTimer

    tb.myUpdate = function () {
      buttonNext.update()

      tb.timer -= DT

      if (hold == false && tb.timer < 0) {
        resetTimer()
        var newWord = addNextWord()

        if (isTextInValidHeight() === false) {
          hold = true
          putLastWordBack(newWord)
          bmpText.setText(removeLastWord(bmpText._text))
        } else {
          hold = words.length === 0
        }

        if (hold) buttonNext.show()
      } else {
        checkInput()
      }
    }
  }

  function addNextWord () {
    var newWord = getNextWord()
    var oldText = bmpText._text
    bmpText.setText(oldText + ' ' + newWord)
    return newWord
  }

  function removeLastWord (text) {
    var lastIndex = text.lastIndexOf(' ')
    return text.substring(0, lastIndex)
  }

  function getNextWord () {
    return words.length > 0 ? words.shift() : ''
  }

  function putLastWordBack (lastWord) {
    words.unshift(lastWord)
  }

  function isTextInValidHeight () {
    return bmpText.textHeight / 18 <= 3
  }

  function resetTimer () {
    tb.timer = nextWordTimer
  }

  function checkInput () {
    if (Pad.justDown(Pad.A)) {
      if (hold === true) {
        nextTextPage()
      } else {
        showCompletePage()
      }
    }
  }

  function nextTextPage () {
    bmpText.setText('')
    hold = false
    buttonNext.hide()

    if (words.length == 0) {
      removeTextBox()
    }
  }

  function showCompletePage () {
    let lastWordAdded
    while (words.length > 0 && isTextInValidHeight()) {
      lastWordAdded = addNextWord()
    }

    if (isTextInValidHeight() === false) {
      putLastWordBack(lastWordAdded)
      bmpText.setText(removeLastWord(bmpText._text))
    }
  }

  function removeTextBox () {
    tb.destroy()
    charName.destroy()
    currentEvent = null
    isEvent = false
  }

  currentEvent = tb
  openTextBox()
}

var NextPageButton = function (x, y, parent) {
  var buttonNext = G.Sprite(117, 20, 'textboxbutton0', parent)
  buttonNext.swapTime = 0.5
  buttonNext.visible = false

  buttonNext.update = function () {
    buttonNext.swapTime -= DT
    if (buttonNext.swapTime < 0) {
      buttonNext.swapTime = 0.5
      buttonNext.frameName = (buttonNext.frameName == 'textboxbutton0' ? 'textboxbutton1' : 'textboxbutton0')
    }
  }

  buttonNext.show = function () {
    buttonNext.visible = true
  }

  buttonNext.hide = function () {
    buttonNext.visible = false
  }

  return buttonNext
}

var CharacterNameBox = function (x, y, name) {
  var charName = game.add.nineSlice(x, y, 'textBoxBig', null, 84, 50, WORLD.uiLayer)
  charName.fixedToCamera = true
  charName.visible = false

  var bmpTextName = game.add.bitmapText(10, 5, 'fontBig', name, 13, WORLD.uiLayer)
  charName.addChild(bmpTextName)
  bmpTextName.visible = false

  charName.getTween = function () {
    var tweenCN = G.Tween(charName.cameraOffset, {
      y: 130
    }, 200).easing(Phaser.Easing.Circular.Out)
    return tweenCN
  }

  charName.showName = function () {
    bmpTextName.visible = true
  }

  return charName
}

var HeadIcon = function (reference, offsetX, offsetY) {
  var icon = G.Sprite(offsetX, offsetY, 'icon_eye')
  reference.setIcon = function (id) {
    icon.frameName = id
  }
  reference.addChild(icon)

  icon.visible = false

  reference.headIcon = icon
}
