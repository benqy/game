import { RenderOpts } from '../types'
import { Graphics } from 'pixi.js'
import { TILESIZE } from '../constants'
import { createQuery } from '@benqy/ecs'
import * as C from '../components'
// import { Optional, createQuery } from '@benqy/ecs'

const cameraQuery = createQuery([C.Camera, C.Position, C.Tranform])

export function cameraSys({ world, app }: RenderOpts, graphics: Graphics) {
  graphics.clear()
  const center = { x: app.view.width / 2, y: app.view.height / 2 }
  //TODO:Singleton Component, 镜头平滑移动
  const [camera, position, tranform] = cameraQuery.exec(world)[0]
  for (let x = position.x - camera.width; x <= position.x + camera.width; x++) {
    for (
      let y = position.y - camera.width;
      y <= position.y + camera.width;
      y++
    ) {
      const tile = world.map[Math.floor(y)]?.[Math.floor(x)]
      if (tile) {
        graphics.beginFill(tile.isBlock ? 0x333333 : 0xaaaaaa)
        graphics.drawRect(
          center.x + (position.x - x) * TILESIZE,
          center.y + (position.y - y) * TILESIZE,
          TILESIZE,
          TILESIZE
        )
      }
    }
  }
  // for (let y = 0; y < world.map.length; y++) {
  //   for (let x = 0; x < world.map[y].length; x++) {
  //     const tileLeft = x
  //     const tileRight = (x + 1)
  //     const tileTop = y
  //     const tileBottom = (y + 1)
  //     const cameraLeft = position.x - camera.width
  //     const cameraRight = position.x + camera.width
  //     const cameraTop = position.y - camera.width
  //     const cameraBottom = position.y + camera.width
  //     if (
  //       tileBottom < cameraTop ||
  //       tileTop > cameraBottom ||
  //       tileRight < cameraLeft ||
  //       tileLeft > cameraRight
  //     ) {
  //       continue
  //     }
  //     if (world.map[y][x].isBlock) {
  //       graphics.beginFill(0x333333)
  //       graphics.drawRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
  //     } else {
  //       graphics.beginFill(0xaaaaaa)
  //       graphics.drawRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
  //     }
  //   }
  // }
  //temp player
  graphics.beginFill('#FF69B4')
  graphics.drawRect(
    center.x,
    center.y,
    TILESIZE * tranform.width,
    TILESIZE * tranform.height
  )
  app.stage.addChild(graphics)
}
