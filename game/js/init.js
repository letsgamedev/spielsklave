/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

// Lufia 13 Zeilen -> 208px
// Zelda nes 10 - 11 Zeilen -> 160px
// zelda snes 13 Zeilen -> 208px
// zelda gb 8 -> 128px
// alwa pc 14 -> 224px

// 8, 12, 24
// 8, 12, 24

function init () {// eslint-disable-line
  logInfo('init init')

  var Size = {
    normal: {w: 256, h: 144}, // Zelda NES,GB (9 Zeilen)
    big: {w: 384, h: 216},  // Lufia, Zelda SNES, Alwa (13.5 Zeilen)
    max: {w: 512, h: 288} // (18 Zeilen)
  }

  var s = Size.big

  var params = getParams()
  Game.variant = 0
  if (params.var) {
    switch (params.var) {
      case 'varb': Game.variant = 1; break
    }
  }
  Game.width = s.w
  Game.height = s.h

  Game.config = {
    width: Game.width,
    height: Game.height,
    renderer: Phaser.CANVAS,
    enableDebug: false,
    globalMusicVolume: 0.5,
    globalSoundVolume: 1
  }

  window.game = new Phaser.Game(Game.config)

  game.state.add('Preloader', Game.Preloader)
  game.state.add('Main', Game.Main)
  game.state.add('BlendModeTest', Game.BlendModeTest)

  game.state.start('Preloader')
};

function logInfo (text) {
  console.log('%c' + text, 'color: #A8009D')
};

function nothing () {}// eslint-disable-line

function getParams () {
  let qs = document.location.search.split('+').join(' ')

  let params = {}
  let tokens
  let re = /[?&]?([^=]+)=([^&]*)/g
  tokens = re.exec(qs)
  while (tokens) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
    tokens = re.exec(qs)
  }

  return params
};
