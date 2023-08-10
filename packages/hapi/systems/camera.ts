import { RenderOpts } from '../types'
import { Container, Graphics } from 'pixi.js'
import { TILESIZE } from '../constants'
import { createQuery } from '@benqy/ecs'
import * as C from '../components'
// import { Optional, createQuery } from '@benqy/ecs'

const cameraQuery = createQuery([C.Camera, C.Position, C.Tranform])

let isFirst = true

export function cameraSys({ world, app }: RenderOpts, graphics: Graphics) {
  graphics.clear()

  const center = { x: app.view.width / 2, y: app.view.height / 2 }
  //TODO:Singleton Component, 镜头平滑移动
  const [camera, position, tranform] = cameraQuery.exec(world)[0]
  let cameraContainer
  if (isFirst) {
    isFirst = false
    cameraContainer = new Container()
    app.stage.addChild(cameraContainer)

    const circleMask = new Graphics()
    circleMask.beginFill(0x000000)
    circleMask.drawCircle(center.x, center.y, camera.width * TILESIZE)
    circleMask.endFill()
    cameraContainer.mask = circleMask
    cameraContainer.addChild(graphics)
    app.stage.addChild(circleMask)
  }
  const renderWidth = camera.width + 2
  for (let x = position.x - renderWidth; x <= position.x + renderWidth; x++) {
    for (let y = position.y - renderWidth; y <= position.y + renderWidth; y++) {
      const tile = world.map[Math.floor(y)]?.[Math.floor(x)]
      const xOffset = (x % 1) * TILESIZE
      const yOffset = (y % 1) * TILESIZE
      if (tile) {
        graphics.beginFill(tile.isBlock ? 0x333333 : 0xaaaaaa)
        graphics.drawRect(
          center.x + (position.x - x) * TILESIZE + xOffset,
          center.y + (position.y - y) * TILESIZE + yOffset,
          TILESIZE,
          TILESIZE
        )
      } else {
        graphics.beginFill(0x00000)
        graphics.drawRect(
          center.x + (position.x - x) * TILESIZE + xOffset,
          center.y + (position.y - y) * TILESIZE + yOffset,
          TILESIZE,
          TILESIZE
        )
      }
    }
  }

  //temp player
  graphics.beginFill('#FF69B4')
  graphics.drawRect(
    center.x,
    center.y,
    TILESIZE * tranform.width,
    TILESIZE * tranform.height
  )
}
