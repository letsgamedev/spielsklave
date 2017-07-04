var PlayerData = {
  isKoop: false,
  playerRef: null,
  calcedAtk: 0,
  getCalcAtk: function () {
    return this.calcedAtk
  },

  calcAtk: function () {
    this.calcedAtk = Math.floor(this.atk + this.atk * (this.scytheEnergyCurrent / 100))
  },
  addScytheEnergy: function (value) {
    this.scytheEnergyMax = Phaser.Math.clamp(this.scytheEnergyMax + value, 0, 100)
  },
  subScytheEnergy: function (value) {
    this.scytheEnergyCurrent = Phaser.Math.clamp(this.scytheEnergyCurrent - value, -1, 100)
  },
  regenerateScytheEnergy: function () {
    this.scytheEnergyCurrentMax = Phaser.Math.clamp(this.scytheEnergyCurrentMax + DT * 90, 0, this.scytheEnergyMax)
    this.scytheEnergyCurrent = Phaser.Math.clamp(this.scytheEnergyCurrent + DT * 30, 0, this.scytheEnergyCurrentMax)
  },
  scytheEnergyMax: 30,
  scytheEnergyCurrentMax: 0,
  scytheEnergyCurrent: 0,
  atk: 1
}
