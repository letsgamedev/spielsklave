var InfoTalk = function (world, eventData) {
  var it = G.Sprite(eventData.tile.x * 8, eventData.tile.y * 8 - 4, eventData.img, world.middleLayer)
  game.physics.ninja.enable(it, 1)
  it.isFix = true
  it.anchor.set(0.5, 0.75)
  it.body.immovable = true
  it.body.setSize(16, 8)
  it.body.y += 9
  it.myUpdate = function () {
    var dist = TB.getDistance(world.player, it)

    if (dist < 14 && world.player.attachedEvent == null) {
      if (world.player.lookDirection == UP && world.player.y > it.y) {
        world.player.attachedEvent = it
        world.player.setIcon('icon_eye')
        world.player.headIcon.visible = true
      }
    }
  }

  it.interact = function () {
    TextBoxBig(eventData.text)
  }

  return it
}
