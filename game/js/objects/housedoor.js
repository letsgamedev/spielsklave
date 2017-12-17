var HouseDoor = function (world, eventData) {// eslint-disable-line
  var door = G.Sprite(eventData.tile.x * 8, eventData.tile.y * 8 - 13, 'house_door_open_0', world.middleLayer)
  G.setBasicFunctionallityToObject(door)

  G.addAnimation(door, 'open', 'house_door_open', 12, false)

  door.onCollide = function (self, collider) {
    door.animations.play('open')
    G.playSound('door_open')

    SwipeFade.out(eventData.dest.walkIn, teleportToMap)
    door.onCollide = nothing
  }

  function teleportToMap () {
    world.teleportToNewMap(eventData.dest.map, eventData.dest.tile, eventData.dest.walkIn)
  }
  return door
}
