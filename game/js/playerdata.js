var PlayerData = {
  playerRef: null,
  getCalcAtk: function () {
    var p = this.playerRef
    return Math.floor(this.atk + this.atk * (this.scytheEnergyCurrent / 100))
  },
  addScytheEnergy: function (value) {
  	this.scytheEnergyMax = Phaser.Math.clamp(this.scytheEnergyMax + value, 0, 100)
  },
  subScytheEnergy: function (value) {
  	this.scytheEnergyCurrent = Phaser.Math.clamp(this.scytheEnergyCurrent - value, -1, 100)
  },
  regenerateScytheEnergy: function () {
  	this.scytheEnergyCurrent = Phaser.Math.clamp(this.scytheEnergyCurrent + DT * 30, 0, this.scytheEnergyMax)
  },
  scytheEnergyMax: 30,
  scytheEnergyCurrent: 0,
  atk: 10
}
