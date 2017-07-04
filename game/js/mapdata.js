var MAPDATA = {
  getMapIdFromCoords: function (x, y) { // 12x8
    var map = [
      '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '02', '01', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '02', '01', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--',
      '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--', '--'
    ]
    return map[y * 12 + x]
  },
  '01': {
    backgroundColor: 0x279cf9,
    chunkCoords: [[0, 0], [0, 1]],
    mapX: 5,
    mapY: 3,
    events: [
      {
        tileX: 43,
        tileY: 94,
        obj: HouseDoor,
        dest: {
          map: '01',
          tileX: 30,
          tileY: 121,
          walkIn: DOWN
        }
      },
      {
        tileX: 20,
        tileY: 112,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT02')
      },
      {
        tileX: 25,
        tileY: 112,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT05')
      },
      {
        tileX: 35,
        tileY: 112,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT06')
      },
      {
        tileX: 40,
        tileY: 112,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT07')
      },
      {
        tileX: 20,
        tileY: 106,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT08')
      },
      {
        tileX: 25,
        tileY: 106,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT09')
      },
      {
        tileX: 35,
        tileY: 106,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT10')
      },
      {
        tileX: 40,
        tileY: 106,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT11')
      },
      {
        tileX: 24,
        tileY: 26,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT03')
      },

      {
        tileX: 28,
        tileY: 26,
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT04')
      }
    ]
  },
  '02': {
    backgroundColor: 0x279cf9,
    chunkCoords: [[0, 0], [0, 1]],
    mapX: 4,
    mapY: 3,
    events: [
      {
        tileX: 43,
        tileY: 94,
        obj: HouseDoor,
        dest: {
          map: '01',
          tileX: 30,
          tileY: 117,
          walkIn: UP
        }
      }
    ]
  }
}
