import { RenderOpts } from '../types'
import { Graphics } from 'pixi.js'
import { TILESIZE } from '../constants'
import { createQuery } from '@benqy/ecs'
import * as C from '../components'
// import { Optional, createQuery } from '@benqy/ecs'

const cameraQuery = createQuery([C.Camera, C.Position])

export function cameraSys({ world, app }: RenderOpts,graphics:Graphics) {
  graphics.clear()
  //TODO:Singleton Component
  const [camera, position] = cameraQuery.exec(world)[0]
  for (let y = 0; y < world.map.length; y++) {
    for (let x = 0; x < world.map[y].length; x++) {
      const tileLeft = x * TILESIZE
      const tileRight = (x + 1) * TILESIZE
      const tileTop = y * TILESIZE
      const tileBottom = (y + 1) * TILESIZE
      const cameraLeft = position.x - camera.width
      const cameraRight = position.x + camera.width
      const cameraTop = position.y - camera.width
      const cameraBottom = position.y + camera.width
      if (
        tileBottom < cameraTop ||
        tileTop > cameraBottom ||
        tileRight < cameraLeft ||
        tileLeft > cameraRight
      ) {
        continue
      }
      if (world.map[y][x].isBlock) {
        graphics.beginFill(0x333333)
        graphics.drawRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
      } else {
        graphics.beginFill(0xaaaaaa)
        graphics.drawRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
      }
    }
  }
  //temp player
  graphics.beginFill('#FF69B4')
        graphics.drawRect(position.x, position.y, TILESIZE, TILESIZE)
  app.stage.addChild(graphics)
}
