/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/
Game.Preloader = function() {
  function init() {
    logInfo('init Preloader')
    game.renderer.renderSession.roundPixels = true
    // this.game.canvas.style.cursor = "none";
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    game.time.advancedTiming = true
  }

  function create() {
    Pad.init()
    nextMapId = '01'
    game.state.start('Main')
  }

  var loadSound = function (name, type, dir) {
    type = type || 'mp3'
    dir = dir || 'sounds/'

    game.load.audio(name, dir + name + '.' + type)
  }

  function preload() {
    game.plugins.add(Fabrique.Plugins.NineSlice)

    game.load.path = 'assets/'

    game.load.atlas('atlas')
    game.load.atlas('atlas_pad')
    game.load.image('tiles')
    game.load.spritesheet('tiless', 'tiles.png', 8, 8)

    // top is 10, left is 15, right is 20 and bottom is 30 pixels in size
    game.load.nineSlice('textBoxBig', 'textBoxBig.png', 9, 8, 8, 8)
    game.load.bitmapFont('font')
    game.load.bitmapFont('fontBig')
    game.load.bitmapFont('fontBigThin')
    game.load.bitmapFont('fontDamage')
    
    loadSound('player_hit', 'wav')
    loadSound('hit2', 'wav')
    loadSound('player_to_stone', 'wav')
    loadSound('player_from_stone', 'wav')
    loadSound('little_egg_hatch', 'wav')
    loadSound('explosion1', 'wav')
    loadSound('stone_push', 'wav')
    loadSound('scythe', 'wav')
    loadSound('door_open', 'wav')
    loadSound('world', 'ogg', 'music/')
  }
  
  return {
    init,
    create,
    preload
  }
}