var PlayerShell = function (world, player) {
  shell = G.Sprite(player.body.x - 32, player.body.y - 32, 'player_to_stone_0', world.middleLayer)
  game.physics.ninja.enable(shell)
  shell.isBroked = false
  shell.body.bounce = 0
  shell.body.drag = 0
  shell.body.oldPos = {x: shell.body.x, y: shell.body.y}
  shell.body.setSize(12, 12)
  shell.anchor.set(0.5, 0.6)
  shell.sound = null

  player.inChange = true

  var shellPuffer = false
  var shellSoundPuffer = true

  shell.update = function () {
    var dx = Math.round(shell.body.x - shell.body.oldPos.x)
    var dy = Math.round(shell.body.y - shell.body.oldPos.y)

    if (dx != 0 || dy != 0) {
      if (shell.sound == null && shellSoundPuffer == false) {
        shell.sound = playSound('stone_push', 1, true)
      } else {
        shellSoundPuffer = false
      }
    } else if (dx == 0 && dy == 0) {
      if (shell.sound != null) {
        shellSoundPuffer = true
        shell.sound.stop()
        shell.sound.destroy()
        shell.sound = null
      }
    }

    shell.body.oldPos.x = shell.body.x
    shell.body.oldPos.y = shell.body.y

    if (shellPuffer) {
      player.body.x = shell.x
      player.body.y = shell.y
    } else {
      shellPuffer = true
    }
  }

  shell.fromStone = addAnimation(shell, 'from_stone', 'dengel_from_stone', 24)

  shell.shutter = function () {
    shell.body.y += 1
    shell.update = function () {}
    shell.fromStone.play()
    playSound('player_from_stone')
  }

  shell.fromStone.onComplete.add(function () {
    setTimeout(function () {
      if (shell.sound) shell.sound.destroy()
      player.inChange = false
      shell.destroy()
    }, 10)
  })
  shell.toStone = addAnimation(shell, 'to_stone', 'dengel_to_stone', 24, false, true)
  shell.toStone.onComplete.add(function () {
    player.inChange = false
  })
  shell.toStone.play()
  playSound('player_to_stone')
  return shell
}
