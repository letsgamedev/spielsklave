var TB = {
  convert2UIKoords: function (obj) {
    return {
      x: obj.world.x - game.camera.x,
      y: obj.world.y - game.camera.y
    }
  },

  loopClamp: function (value, min, max) {
    while (value < min) value += max
    value %= max + 1
    return value
  },

  stopAndClearTween: function (obj, tweenName) {
    if (obj[tweenName]) {
      obj[tweenName].stop(true)
      obj[tweenName] = undefined
    }
  },

  isInRange (lowestBorder, value, topBorder) {
    return lowestBorder <= value && value <= topBorder
  },

  getDistance (obj1, obj2) {
    return Phaser.Math.distance(obj1.x, obj1.y, obj2.x, obj2.y)
  },

  addProperty: function (obj, propName, getter, setter) {
    Object.defineProperty(obj, propName, {
      get: getter,
      set: setter || function () { console.error('Dont set: ', propName) }
    })
  },

  capitalise: function (word) {
    return word[0].toUpperCase() + word.slice(1)
  },

  getOppositDirection: function (dir) {
    if (dir == UP) return DOWN
    if (dir == DOWN) return UP
    if (dir == LEFT) return RIGHT
    if (dir == RIGHT) return LEFT
  },
}

setTimeout(() => {
  var Test = SimpleJSTest()

Test.test('loopClamp 1', TB.loopClamp(30, 0, 20) === 9)
Test.test('loopClamp 2', TB.loopClamp(64, 0, 63) === 0)
Test.test('isInRange 1', TB.isInRange(-10, -10, 10) === true)
Test.test('isInRange 2', TB.isInRange(-10, 10, 10) === true)
Test.test('isInRange 3', TB.isInRange(-10, 20, 10) === false)
Test.test('getDistance 1', TB.getDistance({x: 0, y: 0}, {x: 0, y: 0}) === 0)
Test.test('getDistance 2', TB.getDistance({x: 1, y: 0}, {x: -1, y: 0}) === 2)
Test.test('getDistance 3', TB.getDistance({x: 0, y: 10}, {x: 0, y: 20}) === 10)
Test.test('capitalise 1', TB.capitalise('test') === 'Test')
Test.test('capitalise 2', TB.capitalise('Test') === 'Test')
Test.test('capitalise 3', TB.capitalise('test') !== 'test')
Test.test('getOppositDirection 1', TB.getOppositDirection(UP) === DOWN)
Test.test('getOppositDirection 2', TB.getOppositDirection(DOWN) === UP)
Test.test('getOppositDirection 3', TB.getOppositDirection(LEFT) === RIGHT)
Test.test('getOppositDirection 4', TB.getOppositDirection(RIGHT) === LEFT)

Test.logResults()
}, 0)

