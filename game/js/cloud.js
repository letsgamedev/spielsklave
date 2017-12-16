var Cloud = function(world, position, speed) {
  let cloud = G.Sprite(position.x, position.y, 'cloud0')
  cloud.blendMode = 8
  cloud.tint = 0x999999
  cloud.alpha = 0.5
  cloud.scale.set(2)
  cloud.xSpeed = game.rnd.between(speed.min, speed.max)
  cloud.ySpeed = game.rnd.between(speed.min, speed.max)
  cloud.update = function () {
    cloud.x += DT * cloud.xSpeed
    cloud.y += DT * cloud.xSpeed
    if (cloud.top > world.map.height * 8) cloud.y = -cloud.height
    if (cloud.left > world.map.width * 8) cloud.x = -cloud.width
  }
}