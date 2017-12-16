var PlayerData = function() {
  var calcedAtk = 0
  var scytheEnergyMax = 30
  var atk = 10

  var playerData = {
    isKoop: false,
    scytheEnergyCurrentMax: 0,
    scytheEnergyCurrent: 0,

    getCalcAtk: function () {
      return calcedAtk
    },

    calcAtk: function () {
      calcedAtk = Math.floor(atk + atk * (playerData.scytheEnergyCurrent / 100))
    },

    addScytheEnergy: function (value) {
      scytheEnergyMax = Phaser.Math.clamp(scytheEnergyMax + value, 0, 100)
    },

    subScytheEnergy: function (value) {
      playerData.scytheEnergyCurrent = Phaser.Math.clamp(playerData.scytheEnergyCurrent - value, -1, 100)
    },

    regenerateScytheEnergy: function () {
      playerData.scytheEnergyCurrentMax = Phaser.Math.clamp(playerData.scytheEnergyCurrentMax + DT * 90, 0, scytheEnergyMax)
      playerData.scytheEnergyCurrent = Phaser.Math.clamp(playerData.scytheEnergyCurrent + DT * 30, 0, playerData.scytheEnergyCurrentMax)
    },
  }

  return playerData
}()
