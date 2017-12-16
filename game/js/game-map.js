var GameMap = function(world) {
	var map = world.add.tilemap('map')

	var slopeMap = [0, // first is ignored
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
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
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]

  var layer = createMapLayer(MAP.GROUND)
  var layerHelper = map.createLayer(MAP.GROUND)

  var tiles = game.physics.ninja.convertTilemap(map, MAP.GROUND, slopeMap)

  layerHelper.resizeWorld()
  layerHelper.visible = false

	function createMapLayer(id) {
    var name = 'map_' + id
    var layer = game.add.renderTexture(map.width * 8, map.height * 8, name, true)

    var tile = null
    var w = map.width
    var h = map.height
    var dx = 0
    var dy = 0
    var clearTexture = true
    var stamp = game.add.sprite(0, 0, 'tiless', 0)

    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        tile = map.getTile(x, y, id)
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

  map.getTiles = function() {
  	return tiles
  }

  map.createTopLayer  = function() {
  	return createMapLayer(MAP.TOP)
  }

  map.getCollisitionTiles = function (chunkBounds) {
    var tilesForChunk = tiles.filter((tile) =>
      TB.isInRange(chunkBounds.left, tile.origin.x, chunkBounds.right) &&
      TB.isInRange(chunkBounds.top, tile.origin.y, chunkBounds.bottom)
    )
    console.log('tiles for chunk', tilesForChunk.length)

    return tilesForChunk
  }

  map.findTilesWithID = function (layerNr, tileId, bounds) {
    bounds = bounds || {left: 0, top: 0, right: map.widthInPixels, bottom: map.heightInPixels}
    var result = []

    var data = map.layers[layerNr].data

    data.forEach(function (line) {
      result = result.concat(line.filter(function (tile) {
        return tile.index === tileId && (bounds.left / 8 <= tile.x && tile.x < bounds.right / 8) && (bounds.top / 8 <= tile.y && tile.y < bounds.bottom / 8)
      }))
    })
    return result
  }

  return map
}