var MAPDATA = {// eslint-disable-line
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
    mapPos: {x: 5, y: 3},
    events: [
      {
        tile: {x: 43, y: 94},
        obj: HouseDoor,
        dest: {
          map: '01',
          tile: {x: 30, y: 121},
          walkIn: C.DOWN
        }
      },
      {
        tile: {x: 20, y: 112},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT02')
      },
      {
        tile: {x: 25, y: 112},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT05')
      },
      {
        tile: {x: 35, y: 112},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT06')
      },
      {
        tile: {x: 40, y: 112},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT07')
      },
      {
        tile: {x: 20, y: 106},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT08')
      },
      {
        tile: {x: 25, y: 106},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT09')
      },
      {
        tile: {x: 35, y: 106},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT10')
      },
      {
        tile: {x: 40, y: 106},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT11')
      },
      {
        tile: {x: 24, y: 26},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT03')
      },

      {
        tile: {x: 28, y: 26},
        obj: InfoTalk,
        img: 'tomb',
        text: L('TEXT04')
      }
    ]
  },
  '02': {
    backgroundColor: 0x279cf9,
    chunkCoords: [[0, 0], [0, 1]],
    mapPos: {x: 4, y: 3},
    events: [
      {
        tile: {x: 43, y: 94},
        obj: HouseDoor,
        dest: {
          map: '01',
          tile: {x: 30, y: 117},
          walkIn: C.UP
        }
      }
    ]
  }
}
