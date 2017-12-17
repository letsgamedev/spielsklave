var FenceMaker = function (id) {// eslint-disable-line
  return function Fance (world, x, y) {
    var fence = G.Sprite(x, y - 16, 'graveyard_fence_' + id, world.middleLayer)
    G.setBasicFunctionallityToObject(fence)
    fence.body.setSize(8, 8)
    fence.anchor.set(0.5, 0.9)
    return fence
  }
}
