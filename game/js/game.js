/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
Some SUPER EVEL GLOBAL variables!
*/
var DOWN = 'down'
var UP = 'up'
var LEFT = 'left'
var RIGHT = 'right'
var DEBUG = true
var STATES = {
  NORMAL: 0,
  STONE: 1,
  WALK: 2,
  STAND: 3,
  INUSE: 4,
  SIT: 5
}
var TEST = null
var TEST2 = null
var TEST3 = null

var WORLD = null

var firstStart = false

var globalMusicVolume = 0.5
var globalSoundVolume = 1

var MAP = {
  OBJECTS: 3,
  TOP: 2,
  GROUND_DETAIL: 1,
  GROUND: 0
}

var nextMapId = null
var LastMapInfo = null

var backgroundMusic = null

var flip = true

var isEvent = false
var currentEvent = null

/**
The Main state represants the "inGame" stuff.
That means, everything you can actually play.
*/
Game.Main = function () {
  // variable stuff
}

Game.Main.prototype = {
  init: function () {
    logInfo('init Main')
    game.renderer.renderSession.roundPixels = true
    // this.game.canvas.style.cursor = "none";
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    game.time.advancedTiming = true

    this.oldChunkDirection = null
    this.currentChunk = null
    this.oldChunk = null
    this.enemies = []
    this.objects = []
    this.events = []

    game.stage.backgroundColor = 0x000000
  },

  /**
  Time to render debug objecs or apply some canvas filters!
  */
  render: function () {
    if (!DEBUG) {
      game.debug.body(this.pig)
      game.debug.body(this.player)
      for (var i = 0; i < this.enemies.length; i++) {
        game.debug.body(this.enemies[i])
      };

      for (var i = 0; i < this.objects.length; i++) {
        game.debug.body(this.objects[i])
      };

      for (var i = 0; i < this.events.length; i++) {
        game.debug.body(this.events[i])
      };
      var pu = Pad.isDown(Pad.UP) ? 'U' : '-'
      var pd = Pad.isDown(Pad.DOWN) ? 'D' : '-'
      var pl = Pad.isDown(Pad.LEFT) ? 'L' : '-'
      var pr = Pad.isDown(Pad.RIGHT) ? 'R' : '-'
      var pj = Pad.isDown(Pad.X) ? 'X' : '-'
      var ps = Pad.isDown(Pad.A) ? 'A' : '-'
      game.debug.text(pu + pd + pl + pr + pj + ps, 5, 10)

      if (this.player.shell) game.debug.body(this.player.shell)
    }

        // if (TEST) game.debug.rectangle(TEST);
        // if (TEST2) game.debug.rectangle(TEST2.getHitBox());

    game.debug.text(game.time.fps || '--', game.width - 30, game.height - 20, '#00ff00', '14px Arial')
    game.debug.text(L('VERSION'), game.width - 23, 9, '#ffffff', '7px Arial')
  },

  preRender: function () {
    this.middleLayer.sort('y', Phaser.Group.SORT_ASCENDING)
  },

  swapLight: function () {
    var finAlpha = this.overlay.alpha == 0 ? 1 : 0

    var tween = game.add.tween(this.overlay).to({
      alpha: finAlpha
    }, 3000, Phaser.Easing.Cubic.InOut, true)
    timeEvent(60, this.swapLight, this)
  },

  /**
  Load all the additional assets we need to use.
  */
  preload: function () {
    this.load.tilemap('map', 'map_' + nextMapId + '.json', null, Phaser.Tilemap.TILED_JSON)
  },

  /**
  Initialise the game and prepare everything.
  */
  create: function () {
    // General setup
    // Pad.init();
    this.initPhysics()
    WORLD = this

    this.inputController = InputController(this)

    this.reflectionLayer = game.add.group()
    this.initMap()
    this.bottomLayer = game.add.group()
    this.middleLayer = game.add.group()
        // this.topLayerTiles = this.map.createLayer(MAP.TOP);
    this.topLayerTiles = this.createMapLayer(MAP.TOP)
    this.topLayer = game.add.group()

    if (LastMapInfo) {
      switch (LastMapInfo.mapEntryDirection) {
        case LEFT:
          this.player = Player(this, 0, LastMapInfo.player.y)
          this.pig = Pig(this, this.player.x, this.player.y - 9)
          timeY = LastMapInfo.player.y
          break
        case RIGHT:
          console.log('hui', LastMapInfo.player)
          this.player = Player(this, 400, LastMapInfo.player.y)
          this.pig = Pig(this, 512, LastMapInfo.player.y - 9)
          timeY = LastMapInfo.player.y
          break
      }
    } else {
      this.player = Player(this, 16 * 16, 16 * 50)
      this.pig = Pig(this, this.player.x, this.player.y)
    }

    this.reflectionLayer.add(ReflectionPlayer(this))
    this.reflectionLayer.add(ReflectionPig(this))

    this.cursor = Cursor(this)

    TEST = this.createMapLayer.bind(this)

    this.addClouds()

      // Day/Night Overlay
    this.addTimeOverlay()

      // Add UI
    this.uiLayer = game.add.group()
    this.ui = UI(this)
    this.uiLayer.add(this.ui)
    this.ui.updateHealth()

    this.prepareChunks()

    this.updateCamera(true)
    this.setCurrentChunk()

    this.isInTransition = false

      // Prepare the Fadein Effect
    if (LastMapInfo) {
      switch (LastMapInfo.mapEntryDirection) {
        case LEFT:
          this.player.body.y -= 32
          this.player.body.x = -16 * 3
          break
        case RIGHT:
          this.player.body.y -= 32
          this.player.body.x = 512 + 16 * 3
          break
      }
      var that = this
      setTimeout(function () {
        that.player.walkAuto(that.getOppositDirection(LastMapInfo.mapEntryDirection), 4)
      }, 0)
      SwipeFade(this, LastMapInfo.mapEntryDirection, 'in')
    } else {
      game.stage.backgroundColor = MAPDATA[nextMapId].backgroundColor
    }

    this.updateCamera(true)

      // Set Music
    if (backgroundMusic == null) {
      backgroundMusic = playMusic('world', 0.75, true)
    } else if (backgroundMusic.name != 'world') {
      backgroundMusic.fadeOut(1)
      backgroundMusic = playMusic('world', 0.75, true)
    }

    if (game.device.desktop == false) this.uiLayer.add(Pad.addVirtualButtons(game))

    if (firstStart == false) {
      firstStart = true
      timeEvent(0.1, function () {
        TextBoxBig(L('TEXT01'))
      })
    }
  },

  /**
  Initialise the general physics preferences.
  */
  initPhysics: function () {
    this.game.physics.startSystem(Phaser.Physics.NINJA)
    this.game.physics.ninja.gravity = 0
  },

  addTimeOverlay: function () {
    this.overlay = game.add.graphics(0, 0)
    this.overlay.fixedToCamera = true
    this.overlay.blendMode = 4// 2
    var night = 0x0000a0
    var dawn = 0xe04040
    this.overlay.alpha = LastMapInfo ? LastMapInfo.timeOverlay.alpha : 0
    this.overlay.tint = night
      /* this.overlay.update = function() {
        var proc = (Math.sin(game.time.time * 0.00001) + 1) / 2;
        this.alpha = 0//proc;
      } */
    timeEvent(30, this.swapLight, this) // TODO: make this more "real" cause by state swap this starts new so the game could be sunny all the time
    this.overlay.beginFill(0xffffff)
    this.overlay.drawRect(0, 0, game.width, game.height)
  },

  prepareChunks: function () {
    console.log(this.map)
    var chunksW = this.map.width / 64
    var chunksH = this.map.height / 64
    var chunkCount = chunksW * chunksH

    // So the chunks are adressed chunk[x][y]
    this.chunks = new Array(chunksW)
    for (var i = 0; i < this.chunks.length; i++) {
      this.chunks[i] = new Array(chunksH)
      for (var j = 0; j < this.chunks[i].length; j++) {
        var x = i * 512
        var y = j * 512
        this.chunks[i][j] = {
          events: [],
          startXTile: i * 8,
          startYTile: j * 8,
          x: x,
          y: y,
          width: 512,
          height: 512,
          left: x,
          top: y,
          right: x + 512,
          bottom: y + 512,
          collisitionTiles: null
        }

        this.chunks[i][j].collisitionTiles = this.getCollisitionTiles(this.chunks[i][j])
        this.chunks[i][j].events = this.getEvents(this.chunks[i][j])
      }
    }

    console.log('chunks count', this.chunks)
  },

  getCollisitionTiles: function (chunkBounds) {
    var tilesForChunk = []
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i]
      if (chunkBounds.left < t.origin.x && t.origin.x < chunkBounds.right) {
        if (chunkBounds.top < t.origin.y && t.origin.y < chunkBounds.bottom) {
          tilesForChunk.push(t)
        }
      }
    }
    console.log('tiles for chunk', tilesForChunk.length)

    return tilesForChunk
  },

  getEvents: function (bounds) {
    var result = []
    var events = MAPDATA[nextMapId].events
    for (var i = 0; i < events.length; i++) {
      var e = events[i]
      if (bounds.left <= e.tileX * 8 && e.tileX * 8 < bounds.right) {
        if (bounds.top <= e.tileY * 8 && e.tileY * 8 < bounds.bottom) {
          result.push(e)
        }
      }
    };
    return result
  },

  position2Chunk: function (x, y) {
    return this.chunks[Math.floor(x / 512)][Math.floor(y / 512)]
  },

  setCurrentChunk: function () {
    var isValidChunkCoord = false
    var nx = Math.floor(this.player.x / 512)
    var ny = Math.floor(this.player.y / 512)
    for (var i = 0; i < MAPDATA[nextMapId].chunkCoords.length; i++) {
      var d = MAPDATA[nextMapId].chunkCoords[i]
      if (d[0] == nx && d[1] == ny) isValidChunkCoord = true
    }

    if (isValidChunkCoord) {
      if (this.currentChunk) {
        this.currentChunk.enemies = this.enemies
        this.currentChunk.objects = this.objects
        this.currentChunk.events = this.events
        this.prepareNextChunk()

        this.isInTransition = true
        this.tweenToCurrentChunk()
      } else {
        this.prepareNextChunk()
        this.setWorldBoundsForCurrentChunk()
      }
    } else {
      this.goToNextMap()
    }
  },

  tweenToCurrentChunk: function () {
    this.pig.tweenToPlayer()
    var x = Math.min(this.oldChunk.left, this.currentChunk.left)
    var y = Math.min(this.oldChunk.top, this.currentChunk.top)
    var w = Math.max(this.oldChunk.left, this.currentChunk.left) + 512
    var h = Math.max(this.oldChunk.top, this.currentChunk.top) + 512
    game.world.setBounds(x, y, w, h)

    var cx = 0
    var cy = 0
    var offSet = 16 * 13.5

    switch (this.oldChunkDirection) {
      case UP: cy = offSet; break
      case DOWN: cy = -offSet; break
      case LEFT: cx = offSet; break
      case RIGHT: cx = -offSet; break
    }

    var tween = game.add.tween(this.camera).to({
      x: this.camera.x + cx,
      y: this.camera.y + cy
    }, 1000, Phaser.Easing.Cubic.InOut, true)

    tween.onComplete.add(function () {
      this.setWorldBoundsForCurrentChunk()
      this.isInTransition = false
      this.cleanOldChunk()
    }, this)
  },

  prepareNextChunk: function () {
    this.oldChunk = this.currentChunk
    this.currentChunk = this.position2Chunk(this.player.x, this.player.y)
    this.currentChunk.events = this.getEvents(this.currentChunk)
    this.addEnemies()
    this.addObjects()
    this.addEvents()
    console.log(MAPDATA[nextMapId].mapX, this.currentChunk.x, 512, MAPDATA[nextMapId].mapY, this.currentChunk.y, 512)
    this.ui.miniMap.setCenterTile(MAPDATA[nextMapId].mapX + this.currentChunk.x / 512, MAPDATA[nextMapId].mapY + this.currentChunk.y / 512)
  },

  setWorldBoundsForCurrentChunk: function () {
    game.world.setBounds(this.currentChunk.left, this.currentChunk.top, this.currentChunk.width, this.currentChunk.height)
  },

  cleanOldChunk: function () {
    for (var i = 0; i < this.oldChunk.enemies.length; i++) {
      this.oldChunk.enemies[i].destroy()
    }
    this.oldChunk.enemies = []

    for (var i = 0; i < this.oldChunk.events.length; i++) {
      this.oldChunk.events[i].destroy()
    }
    this.oldChunk.events = []

    for (var i = 0; i < this.oldChunk.objects.length; i++) {
      this.oldChunk.objects[i].destroy()
    }
    this.oldChunk.objects = []
  },

  /**
  Load and create/add the map layers.
  Also define which tiles have slopes.
  */
  initMap: function () {
    this.map = this.add.tilemap('map')

        // this.map.addTilesetImage("tiles", 'tiles'); //sets a image key to a json tileset name key
    this.layer = this.createMapLayer(MAP.GROUND)
    this.layerHelper = this.map.createLayer(MAP.GROUND)

    var slopeMap = [0, // first is ignored
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 3, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 4, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 4, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 0, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 0, 0, 15, 14, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 1, 18, 14, 15, 19, 3, 2, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0,
      5, 0, 0, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
      0, 3, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      3, 1, 1, 5, 0, 0, 4, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 3, 1, 1, 1, 1, 2, 0, 0, 1, 1,
      1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      1, 1, 1, 2, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 5, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 4, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 4, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]

    this.tiles = game.physics.ninja.convertTilemap(this.map, MAP.GROUND, slopeMap)

    this.layerHelper.resizeWorld()
    this.layerHelper.visible = false
  },

  addEnemies: function () {
    this.enemies = []
    var ids = [
      {tileId: 17, className: LittleEgg}
    ]

    var that = this

    for (var i = 0; i < ids.length; i++) {
      var enemyId = ids[i]
      var result = this.findTilesWithID(MAP.OBJECTS, enemyId.tileId, this.currentChunk)
      result.forEach(function addEnemy (tile) {
        var enemy = enemyId.className(that, tile.x * 8, tile.y * 8)
        that.enemies.push(enemy)
      })
    };

    console.log('enemies', this.enemies.length)
  },

  addObjects: function () {
    this.objects = []
    var ids = [
      {tileId: 38, className: Stone}
    ]

    var that = this

    for (var i = 0; i < ids.length; i++) {
      var objectId = ids[i]
      var result = this.findTilesWithID(MAP.OBJECTS, objectId.tileId, this.currentChunk)
      result.forEach(function addObject (tile) {
        var object = objectId.className(that, tile.x * 8, tile.y * 8)
        that.objects.push(object)
      })
    };

    console.log('objects', this.objects.length)
  },

  addEvents: function () {
    this.events = []
    var events = this.currentChunk.events
    for (var i = 0; i < events.length; i++) {
      var e = events[i]
      var obj = e.obj(this, e)
      this.events.push(obj)
    };
    console.log('event count: ' + this.events.length)
  },

  addClouds: function () {
    var world = this
    for (var i = 0; i < 4; i++) {
      var x = game.rnd.between(0, this.map.width * 8)
      var y = game.rnd.between(0, this.map.height * 8)
      let c = game.add.sprite(x, y, 'atlas', 'cloud0')
      c.blendMode = 8
      c.tint = 0x999999
      c.alpha = 0.5
      c.scale.set(2)
      c.xSpeed = game.rnd.between(3, 15)
      c.ySpeed = game.rnd.between(3, 15)
      console.log(c)
      c.update = function () {
        c.x += DT * c.xSpeed
        c.y += DT * c.xSpeed
        if (c.top > world.map.height * 8) c.y = -c.height
        if (c.left > world.map.width * 8) c.x = -c.width
      }
    };
  },

  moveCameraTo: function (x, y) {
    var tween = game.add.tween(game.camera).to({
      x: x,
      y: y
    }, 500, Phaser.Easing.Cubic.InOut, true)
  },

  updateCamera: function (isInstant) {
    if (this.isInTransition && isInstant != true) return
    var lookOffsetY = 0
    var lookOffsetX = 0
    var lookOffsetDistance = 0
    var follower = this.player.state == STATES.STONE ? this.pig : this.player
    switch (follower.lookDirection) {
      case UP: lookOffsetY = lookOffsetDistance; break
      case DOWN: lookOffsetY = -lookOffsetDistance; break
      case LEFT: lookOffsetX = lookOffsetDistance; break
      case RIGHT: lookOffsetX = -lookOffsetDistance; break
    }

    var xd = follower.body.x - (this.camera.x + Game.width / 2 - 8 + lookOffsetX)
    var yd = follower.body.y - (this.camera.y + Game.height / 2 + lookOffsetY)

    if (isInstant) {
      this.camera.x = Math.floor(this.camera.x + xd)
      this.camera.y = Math.floor(this.camera.y + yd)
    } else {
      this.camera.x = Math.floor(this.camera.x + (xd * 1.0))
      this.camera.y = Math.floor(this.camera.y + (yd * 1.0))
    }

    this.camera.x = follower.body.x - Game.width / 2
    this.camera.y = follower.body.y - Game.height / 2

    game.camera.x += game.camera._shake.xx
    game.camera.y += game.camera._shake.yy
  },

  findTilesWithID: function (layerNr, tileId, bounds) {
    bounds = bounds || {left: 0, top: 0, right: this.map.widthInPixels, bottom: this.map.heightInPixels}
    var result = []

    var data = this.map.layers[layerNr].data

    data.forEach(function (line) {
      result = result.concat(line.filter(function (tile) {
        return tile.index === tileId && (bounds.left / 8 <= tile.x && tile.x < bounds.right / 8) && (bounds.top / 8 <= tile.y && tile.y < bounds.bottom / 8)
      }))
    })
    return result
  },

  /**
  The update method will me called every frame.
  so time to get some input and update charakters and objects!
  */
  update: function () {
    DT = this.time.physicsElapsedMS * 0.001
    if (this.isInTransition) return
    Pad.checkJustDown()
    this.inputController.update()

    if (isEvent) {
      currentEvent.myUpdate()
    } else {
      // this.player.input();
      this.player.attachedEvent = null
      this.pig.update()
      // this.pig.input();
      this.myUpdateOn(this.enemies)
      this.myUpdateOn(this.objects)
      this.myUpdateOn(this.events)
    }

    this.cursor.update()
    this.collision()

    this.ui.updateHealth()
    PlayerData.regenerateScytheEnergy()
    this.checkForDeath()

    this.checkPlayerOutOfBounds()

    this.player.myPostUpdate()

    this.updateCamera()
  },

  myUpdateOn: function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i].myUpdate()
    };
  },

  checkForDeath: function () {
    if (this.player.hp <= 0) {
      game.state.start('Preloader')
    }
  },

  collision: function () {
    var r
    // Collision detection
    for (var i = 0; i < this.currentChunk.collisitionTiles.length; i++) {
      var tile = this.currentChunk.collisitionTiles[i].tile

      if (this.player.state == STATES.STONE) {
        this.player.shell.body.aabb.collideAABBVsTile(tile)
      }

      function check (e) {
        if (e.isFix) return
        r = e.body.aabb.collideAABBVsTile(tile)
        var isInWorldBounds = game.world.bounds.containsRect(e.body)
        if (e.hitTween && (r || isInWorldBounds == false)) {
          e.hitTween.stop()
          e.hitTween = undefined
        }
      }
      function checkArray (array) {
        var arrayLength = array.length
        for (var j = 0; j < arrayLength; j++) {
          check(array[j])
        };
      }
      checkArray(this.enemies)
      checkArray(this.objects)
      checkArray(this.events)
      check(this.player)
      check(this.pig)
    }

    // Dont do this in the for loop cause this would be super dumb!
    if (this.player.state == STATES.STONE) {
      game.physics.ninja.collide(this.player.shell, this.pig)
    }
      // Overlap with enemies

    for (var i = 0; i < this.enemies.length; i++) {
      if (this.player.state != STATES.STONE) game.physics.ninja.overlap(this.player, this.enemies[i], this.player.onHit)
      if (this.player.state == STATES.STONE || this.cursor.visible) game.physics.ninja.overlap(this.pig, this.enemies[i], this.pig.onHit)
      if (this.player.state == STATES.STONE) game.physics.ninja.collide(this.player.shell, this.enemies[i])
      for (var j = 0; j < this.events.length; j++) {
        game.physics.ninja.collide(this.events[j], this.enemies[i])
      };
      for (var j = 0; j < this.objects.length; j++) {
        game.physics.ninja.collide(this.events[j], this.enemies[i])
      };
    };

    for (var j = 0; j < this.events.length; j++) {
      if (this.player.state != STATES.STONE) game.physics.ninja.collide(this.events[j], this.player)
      if (this.player.state == STATES.STONE) game.physics.ninja.collide(this.player.shell, this.events[j])
      game.physics.ninja.collide(this.events[j], this.pig)
    };

    for (var j = 0; j < this.objects.length; j++) {
      if (this.player.state != STATES.STONE) game.physics.ninja.collide(this.objects[j], this.player)
      if (this.player.state == STATES.STONE) game.physics.ninja.collide(this.player.shell, this.objects[j])
      game.physics.ninja.collide(this.objects[j], this.pig)
    };
  },

  checkPlayerOutOfBounds: function () {
    if (this.player.state == STATES.STONE) return
    if (game.world.bounds.contains(this.player.x, this.player.y) == false) {
      if (this.player.x < game.world.bounds.left) this.onLeaveChunk(RIGHT)
      if (this.player.x > game.world.bounds.right) this.onLeaveChunk(LEFT)
      if (this.player.y < game.world.bounds.top) this.onLeaveChunk(DOWN)
      if (this.player.y > game.world.bounds.bottom) this.onLeaveChunk(UP)
    }
  },

  onLeaveChunk: function (from) {
    this.oldChunkDirection = from
    this.setCurrentChunk()
  },

  goToNextMap: function () {
    this.player.walkAuto(this.getOppositDirection(this.oldChunkDirection))
    SwipeFade(this, this.oldChunkDirection, 'out')
  },

  getOppositDirection: function (dir) {
    if (dir == UP) return DOWN
    if (dir == DOWN) return UP
    if (dir == LEFT) return RIGHT
    if (dir == RIGHT) return LEFT
  },

  startNextMap: function () {
    nextMapId = '01'
    LastMapInfo = {
      player: {
        x: this.player.x,
        y: this.player.y
      },
      mapEntryDirection: this.oldChunkDirection,
      timeOverlay: {
        alpha: this.overlay.alpha
      }
    }
    game.state.start('Main')
  },

  createMapLayer: function (id) {
    var name = 'map_' + id
    var layer = game.add.renderTexture(this.map.width * 8, this.map.height * 8, name, true)

    var tile = null
    var w = this.map.width
    var h = this.map.height
    var dx = 0
    var dy = 0
    var clearTexture = true
    var stamp = game.add.sprite(0, 0, 'tiless', 0)

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        tile = this.map.getTile(x, y, id)
        if (tile) {
          stamp.frame = tile.index - 1
          layer.renderXY(stamp, dx, dy, clearTexture)
          clearTexture = false
        }

        dx += 8
      }

      dx = 0
      dy += 8
    }

    stamp.destroy()
    return game.add.sprite(0, 0, layer)
  }

  /* renderMapToTexture: function(render) {
    console.log("taka a snap");
    var texture = game.add.renderTexture(512, 512, "mapFade", true);
    texture.render(this.layer);
    //texture.render(this.groundDetail);
    texture.render(this.topLayerTiles);
    //game.add.sprite(10,10, texture);
  } */
}

/**
This is the mouse pointer substitue for
a second player. The pig will follow
this cursor with a direkt line.

@param {object} world - The current state

@return {Phaser.Sprite} - The coursor/pointer object
*/
var Cursor = function (world) {
  var cursor = game.add.sprite(0, 0, 'atlas', 'cursor')
  cursor.anchor.set(0, 0)
  cursor.change = false
  cursor.update = function () {
    var nx = Math.floor(game.input.mousePointer.position.x) + game.camera.x
    var ny = Math.floor(game.input.mousePointer.position.y) + game.camera.y

    cursor.change = (nx != cursor.x || ny != cursor.y)

    cursor.x = nx
    cursor.y = ny

    var distance = game.math.distance(world.pig.x, world.pig.y, cursor.x, cursor.y)
    cursor.alpha = distance < 16 ? 0.5 : 1
  }

  cursor.visible = PlayerData.isKoop

  return cursor
}
