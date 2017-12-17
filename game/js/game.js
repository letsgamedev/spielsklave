/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
Some SUPER EVEL GLOBAL letiables!
*/

let STATES = {
  NORMAL: 0,
  STONE: 1,
  WALK: 2,
  STAND: 3,
  INUSE: 4,
  SIT: 5,
  SUCK: 6,
  SHOOT: 7
}
let TEST = null

let WORLD = null// eslint-disable-line

let isFirstStart = true

let MAP = {
  OBJECTS: 3,
  TOP: 2,
  GROUND_DETAIL: 1,
  GROUND: 0
}

let LastMapInfo = null

let backgroundMusic = null

/**
The Main state represants the "inGame" stuff.
That means, everything you can actually play.
*/
Game.Main = function () {
  // letiable stuff
}

Game.Main.prototype = {
  init: function () {
    logInfo('init Main')

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
    if (Game.config.enableDebug === false) return

    game.debug.body(this.pig)
    game.debug.body(this.player)

    this.enemies.forEach((e) => game.debug.body(e))
    this.objects.forEach((e) => game.debug.body(e))
    this.events.forEach((e) => game.debug.body(e))

    let pu = Pad.isDown(Pad.UP) ? 'U' : '-'
    let pd = Pad.isDown(Pad.DOWN) ? 'D' : '-'
    let pl = Pad.isDown(Pad.LEFT) ? 'L' : '-'
    let pr = Pad.isDown(Pad.RIGHT) ? 'R' : '-'
    let pj = Pad.isDown(Pad.X) ? 'X' : '-'
    let ps = Pad.isDown(Pad.A) ? 'A' : '-'
    game.debug.text(pu + pd + pl + pr + pj + ps, 5, 10)

    if (this.player.shell) game.debug.body(this.player.shell)

    game.debug.geom(TEST, 'rgba(255,0,0,0.5)')
        // if (TEST) game.debug.rectangle(TEST);
        // if (TEST2) game.debug.rectangle(TEST2.getHitBox());

    game.debug.text(game.time.fps || '--', game.width - 30, game.height - 20, '#00ff00', '14px Arial')
    game.debug.text(L('VERSION'), game.width - 23, 9, '#ffffff', '7px Arial')
  },

  preRender: function () {
    this.middleLayer.sort('y', Phaser.Group.SORT_ASCENDING)
  },

  /**
  Load all the additional assets we need to use.
  */
  preload: function () {
    this.load.tilemap('map', 'map_' + GameData.nextMapId + '.json', null, Phaser.Tilemap.TILED_JSON)
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
    this.middleLayer = game.add.group()
    this.topLayerTiles = this.map.createTopLayer()

    if (LastMapInfo) {
      console.log('playertiles', LastMapInfo.player.x, LastMapInfo.player.y)
      this.player = Player(this, LastMapInfo.player.x * 8, LastMapInfo.player.y * 8)
    } else {
      this.player = Player(this, 23 * 8, 93 * 8)
    }
    this.pig = Pig(this, this.player.x, this.player.y)

    this.addClouds()

    this.addTimeOverlay()

    this.addUI()

    this.camera = GameCamera(this)

    this.reflectionLayer.add(ReflectionPlayer(this))
    this.reflectionLayer.add(ReflectionPig(this))

    this.cursor = Cursor(this)

    this.prepareChunks()

    this.camera.updatePosition(true)
    this.setCurrentChunk()

    this.isInTransition = false

      // Prepare the Fadein Effect
    this.camera.updatePosition(true)
    if (LastMapInfo) {
      switch (LastMapInfo.mapEntryDirection) {
        case C.LEFT:
          this.player.body.x += -16 * 2
          break
        case C.RIGHT:
          this.player.body.x += 16 * 2
          break
      }
      let that = this
      let oppositDirection = TB.getOppositDirection(LastMapInfo.mapEntryDirection)

      setTimeout(function () {
        that.player.walkAuto(oppositDirection, 2)
      }, 400)

      SwipeFade.in(oppositDirection, function () {
        that.isInTransition = false
      })
    } else {
      game.stage.backgroundColor = MAPDATA[GameData.nextMapId].backgroundColor
    }
    this.currentMapId = GameData.nextMapId

      // Set Music
    if (backgroundMusic == null) {
      backgroundMusic = G.playMusic('world', 0.75, true)
    } else if (backgroundMusic.name !== 'world') {
      backgroundMusic.fadeOut(1)
      backgroundMusic = G.playMusic('world', 0.75, true)
    }

    if (game.device.desktop === false) this.uiLayer.add(Pad.addVirtualButtons(game))

    if (isFirstStart) {
      isFirstStart = false
      G.timeEvent(0.1, function () {
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

  addUI: function () {
    this.uiLayer = game.add.group()
    this.ui = UI(this)
    this.uiLayer.add(this.ui)
    this.ui.updateHealth()
  },

  addTimeOverlay: function () {
    this.overlay = DayNightOverlay(30)
  },

  prepareChunks: function () {
    console.log(this.map)
    let chunksW = this.map.width / 64
    let chunksH = this.map.height / 64

    // So the chunks are adressed chunk[x][y]
    this.chunks = new Array(chunksW)
    for (let i = 0; i < this.chunks.length; i++) {
      this.chunks[i] = new Array(chunksH)
      for (let j = 0; j < this.chunks[i].length; j++) {
        let x = i * 512
        let y = j * 512
        this.chunks[i][j] = {
          events: [],
          x: x,
          y: y,
          width: 512,
          height: 512,
          bounds: {
            left: x,
            top: y,
            right: x + 512,
            bottom: y + 512
          },
          collisitionTiles: null
        }

        this.chunks[i][j].collisitionTiles = this.map.getCollisitionTiles(this.chunks[i][j].bounds)
        this.chunks[i][j].events = this.getEvents(this.chunks[i][j].bounds)
      }
    }

    console.log('chunks count', this.chunks)
  },

  getEvents: function (bounds) {
    let eventsInChunk = MAPDATA[GameData.nextMapId].events.filter((event) =>
      TB.isInRange(bounds.left, event.tile.x * 8, bounds.right) &&
      TB.isInRange(bounds.top, event.tile.y * 8, bounds.bottom)
    )
    console.log('events found:', eventsInChunk.length)
    return eventsInChunk
  },

  setCurrentChunk: function () {
    let nx = Math.floor(this.player.x / 512)
    let ny = Math.floor(this.player.y / 512)
    let isValidChunkCoord = MAPDATA[GameData.nextMapId].chunkCoords.some(
      chunkCoord => chunkCoord[0] === nx && chunkCoord[1] === ny)

    function initNewChunk () {
      this.setWorldBoundsForCurrentChunk()
      this.cleanOldChunk()
    }

    if (isValidChunkCoord) {
      if (this.currentChunk) {
        this.currentChunk.enemies = this.enemies
        this.currentChunk.objects = this.objects
        this.currentChunk.events = this.events
        this.prepareNextChunk()

        this.isInTransition = true
        this.pig.tweenToPlayer()

        this.camera.tweenToCurrentChunk(this.oldChunk.bounds, this.currentChunk.bounds, this.oldChunkDirection, initNewChunk.bind(this))
      } else {
        this.prepareNextChunk()
        this.setWorldBoundsForCurrentChunk()
      }
    } else {
      this.goToNextMap()
    }
  },

  prepareNextChunk: function () {
    this.oldChunk = this.currentChunk
    this.currentChunk = this.position2Chunk(this.player.x, this.player.y)
    this.currentChunk.events = this.getEvents(this.currentChunk.bounds)
    this.addEnemies()
    this.addObjects()
    this.addEvents()

    let tilePosition = {
      x: MAPDATA[GameData.nextMapId].mapPos.x + this.currentChunk.x / 512,
      y: MAPDATA[GameData.nextMapId].mapPos.y + this.currentChunk.y / 512
    }
    this.ui.miniMap.setCenterTile(tilePosition)
  },

  position2Chunk: function (x, y) {
    return this.chunks[Math.floor(x / 512)][Math.floor(y / 512)]
  },

  setWorldBoundsForCurrentChunk: function () {
    game.world.setBounds(this.currentChunk.bounds.left, this.currentChunk.bounds.top, this.currentChunk.width, this.currentChunk.height)
  },

  cleanOldChunk: function () {
    function destroyAllInArray (array) {
      array.forEach(element => element.destroy())
      return []
    }
    this.oldChunk.enemies = destroyAllInArray(this.oldChunk.enemies)
    this.oldChunk.events = destroyAllInArray(this.oldChunk.events)
    this.oldChunk.objects = destroyAllInArray(this.oldChunk.objects)
  },

  /**
  Load and create/add the map layers.
  Also define which tiles have slopes.
  */
  initMap: function () {
    this.map = GameMap(this)
    this.tiles = this.map.getTiles()
  },

  addEnemies: function () {
    this.enemies = []
    let ids = [
      {tileId: 17, className: LittleEgg},
      {tileId: 801, className: LittleEgg}// why tom?
    ]

    ids.forEach(enemyId => {
      let tiles = this.map.findTilesWithID(MAP.OBJECTS, enemyId.tileId, this.currentChunk.bounds)
      tiles.forEach(tile => {
        let enemy = enemyId.className(this, tile.x * 8, tile.y * 8)
        this.enemies.push(enemy)
      })
    })
    console.log('enemies', this.enemies.length)
  },

  addObjects: function () {
    this.objects = []
    let ids = [// tiled id + 1
      {tileId: 38, className: Stone},
      {tileId: 503, className: FenceMaker(0)},
      {tileId: 505, className: FenceMaker(1)},
      {tileId: 504, className: FenceMaker(2)},
      {tileId: 486, className: FenceMaker(1)},
      {tileId: 506, className: FenceMaker(3)},
      {tileId: 483, className: FenceMaker(0)},
      {tileId: 485, className: FenceMaker(3)},
      {tileId: 484, className: FenceMaker(2)}
    ]

    ids.forEach(objectId => {
      let tiles = this.map.findTilesWithID(MAP.OBJECTS, objectId.tileId, this.currentChunk.bounds)
      tiles.forEach(tile => {
        let object = objectId.className(this, tile.x * 8, tile.y * 8)
        this.objects.push(object)
      })
    })

    console.log('objects', this.objects.length)
  },

  addEvents: function () {
    this.events = this.currentChunk.events.map(event => event.obj(this, event))
    console.log('event count: ' + this.events.length)
  },

  addClouds: function () {
    for (let i = 0; i < 4; i++) {
      let position = {
        x: game.rnd.between(0, this.map.width * 8),
        y: game.rnd.between(0, this.map.height * 8)
      }

      let speed = { min: 3, max: 15 }
      Cloud(this, position, speed)
    };
  },

  /**
  The update method will me called every frame.
  so time to get some input and update charakters and objects!
  */
  update: function () {
    window.DT = this.time.physicsElapsedMS * 0.001
    GameData.gamePlayTimeInSeconds += DT

    if (this.isInTransition) return

    Pad.checkJustDown()
    this.inputController.update()

    if (GameData.currentEvent) {
      GameData.currentEvent.myUpdate()
    } else {
      this.player.attachedEvent = null
      this.pig.update()
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

    this.camera.updatePosition()
  },

  myUpdateOn: function (array) {
    for (let i = 0; i < array.length; i++) {
      array[i].myUpdate()
    };
  },

  checkForDeath: function () {
    if (this.player.hp <= 0) {
      game.state.start('Preloader')
    }
  },

  collision: function () {
    let r
    let collisitionTilesLength = this.currentChunk.collisitionTiles.length
    let isPlayerStone = this.player.state === STATES.STONE

    function check (e, tile) {
      if ((e.isFix || e.isCarry) && !e.isShoot) return

      r = e.body.aabb.collideAABBVsTile(tile)
      let isInWorldBounds = game.world.bounds.containsRect(e.body)
      if (r || isInWorldBounds === false) {
        TB.stopAndClearTween(e, 'hitTween')
        TB.stopAndClearTween(e, 'shootTween')
      }
    }

    function checkArray (array, tile) {
      let arrayLength = array.length
      for (let j = 0; j < arrayLength; j++) {
        check(array[j], tile)
      };
    }

    // Collision detection

    // Test collision between entities and tiles
    for (let tileIndex = 0; tileIndex < collisitionTilesLength; tileIndex++) {
      let tile = this.currentChunk.collisitionTiles[tileIndex].tile

      if (isPlayerStone) {
        this.player.shell.body.aabb.collideAABBVsTile(tile)
      }

      checkArray(this.enemies, tile)
      checkArray(this.objects, tile)
      checkArray(this.events, tile)
      check(this.player, tile)
      check(this.pig, tile)
    }

    // Collision Shell and Pig
    if (isPlayerStone) {
      game.physics.ninja.collide(this.player.shell, this.pig)
    }

    // Overlap with enemies
    let enemiesLength = this.enemies.length
    for (let i = 0; i < enemiesLength; i++) {
      let enemy = this.enemies[i]
      if (!isPlayerStone) game.physics.ninja.overlap(this.player, enemy, this.player.onHit)
      if (isPlayerStone || this.cursor.visible) game.physics.ninja.overlap(this.pig, enemy, this.pig.onHit)
      if (isPlayerStone) game.physics.ninja.collide(this.player.shell, enemy)

      // enemy with events
      let eventsLength = this.events.length
      for (let j = 0; j < eventsLength; j++) {
        game.physics.ninja.collide(this.events[j], enemy)
      };

      // enemy with objects
      let objectsLength = this.objects.length
      for (let j = 0; j < objectsLength; j++) {
        let obj = this.objects[j]
        if (obj.isCarry) continue
        game.physics.ninja.collide(obj, enemy, this.onObjectEnemyCollision)
      };
    };

    // Events with player and pig
    let eventsLength = this.events.length
    for (let j = 0; j < eventsLength; j++) {
      let event = this.events[j]
      if (!isPlayerStone) game.physics.ninja.collide(event, this.player, event.onCollide)
      if (isPlayerStone) game.physics.ninja.collide(this.player.shell, event)
      game.physics.ninja.collide(event, this.pig)
    };

    // Objects with player and pig
    let objectsLength = this.objects.length
    for (let j = 0; j < objectsLength; j++) {
      let obj = this.objects[j]
      if (obj.isCarry) continue
      if (!isPlayerStone) game.physics.ninja.collide(obj, this.player, this.onObjectsPlayerCollision)
      if (isPlayerStone) game.physics.ninja.collide(this.player.shell, obj)
      if (obj.isShoot) {
        for (let k = 0; k < objectsLength; k++) {
          let objK = this.objects[k]
          if (obj === objK) continue
          game.physics.ninja.collide(obj, objK, function (obj, other) {
            TB.stopAndClearTween(obj, 'shootTween')
          })
        }
      } else {
        game.physics.ninja.collide(obj, this.pig)
      }
    };
  },

  onObjectsPlayerCollision: function (object, player) {
    TB.stopAndClearTween(player, 'hitTween')
  },

  checkPlayerOutOfBounds: function () {
    if (this.player.state === STATES.STONE) return
    if (game.world.bounds.contains(this.player.x, this.player.y) === false) {
      if (this.player.x < game.world.bounds.left) this.onLeaveChunk(C.RIGHT)
      if (this.player.x > game.world.bounds.right) this.onLeaveChunk(C.LEFT)
      if (this.player.y < game.world.bounds.top) this.onLeaveChunk(C.DOWN)
      if (this.player.y > game.world.bounds.bottom) this.onLeaveChunk(C.UP)
    }
  },

  onObjectEnemyCollision: function (object, enemy) {
    TB.stopAndClearTween(enemy, 'hitTween')

    if (object.isShoot) {
      TB.stopAndClearTween(object, 'shootTween')
      enemy.onHit(object.getDmg(), object)
      object.onBreak()
    }
  },

  onLeaveChunk: function (from) {
    this.oldChunkDirection = from
    this.setCurrentChunk()
  },

  goToNextMap: function () {
    this.onLeavePlayerPos = {
      x: this.player.x,
      y: this.player.y
    }
    this.player.walkAuto(TB.getOppositDirection(this.oldChunkDirection))
    SwipeFade.out(this.oldChunkDirection, function () {
      game.stage.backgroundColor = 0x000000
      this.goToNextArea()
    }.bind(this))
  },

  setLastMapInfoAndRunNextMap: function (playerPos, direction) {
    LastMapInfo = {
      player: playerPos,
      mapEntryDirection: direction,
      timeOverlay: {
        alpha: this.overlay.alpha
      }
    }
    game.state.start('Main')
  },

  teleportToNewMap: function (mapId, tile, walkInFrom) {
    GameData.nextMapId = mapId
    this.setLastMapInfoAndRunNextMap(tile, walkInFrom)
  },

  goToNextArea: function () {
    let newMapCoords = {
      x: MAPDATA[this.currentMapId].mapPos.x + Math.floor(this.onLeavePlayerPos.x / 512),
      y: MAPDATA[this.currentMapId].mapPos.y + Math.floor(this.onLeavePlayerPos.y / 512)
    }
    GameData.nextMapId = MAPDATA.getMapIdFromCoords(newMapCoords.x, newMapCoords.y)

    let newMap = MAPDATA[GameData.nextMapId]

    let chunkOffSet = {
      x: newMapCoords.x - newMap.mapPos.x,
      y: newMapCoords.y - newMap.mapPos.y
    }

    let startTile = {
      x: TB.loopClamp(Math.floor(this.onLeavePlayerPos.x / 8), 0, 63) + chunkOffSet.x * 64,
      y: TB.loopClamp(Math.floor(this.onLeavePlayerPos.y / 8), 0, 63) + chunkOffSet.y * 64
    }

    this.setLastMapInfoAndRunNextMap(startTile, this.oldChunkDirection)
  }
}
