import { RenderOpts, Tile } from '../types'
import { Container, Graphics, Sprite } from 'pixi.js'
import { TILESIZE } from '../constants'
import { createQuery } from '@benqy/ecs'
import * as C from '../components'
import { aStar } from './astar'
// import { Optional, createQuery } from '@benqy/ecs'

const cameraQuery = createQuery([
  C.Camera,
  C.Position,
  C.Tranform,
  C.Sprite,
  C.Player,
])
const enemyQuery = createQuery([C.Enemy, C.RenderAble, C.Position, C.Tranform])

let isFirst = true

const findClosedEnemy = (start: Tile, end: Tile, map: Tile[][]) => {
  const paths = aStar(start, end, map)
  return paths
}

export function cameraSys({ world, app }: RenderOpts, graphics: Graphics) {
  graphics.clear()

  const center = { x: app.view.width / 2, y: app.view.height / 2 }
  //TODO:Singleton Component, 镜头平滑移动
  const [camera, position, tranform, sprite] = cameraQuery.exec(world)[0]
  const enemys = enemyQuery.exec(world)
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
        let enemy: unknown
        for (const enemy2 of enemys) {
          const [, , positionEnemy] = enemy2
          if (tile.x === positionEnemy.x && tile.y === positionEnemy.y) {
            enemy = enemy2
          }
        }
        const renderX = center.x + (position.x - x) * TILESIZE + xOffset
        const renderY = center.y + (position.y - y) * TILESIZE + yOffset
        graphics.beginFill(tile.isBlock ? 0x000000 : 0xaaaaaa)
        graphics.drawRect(renderX, renderY, TILESIZE, TILESIZE)
        if (enemy) {
          graphics.beginFill(0xff1100)
          graphics.drawRect(renderX, renderY, TILESIZE, TILESIZE)
        }
      } else {
        graphics.beginFill(0x00000)
        graphics.drawRect(
          center.x + (position.x - x) * TILESIZE + xOffset,
          center.y + (position.y - y) * TILESIZE + yOffset,
          TILESIZE,
          TILESIZE
        )
      }
      //render enemys in camera radius
    }
  }
  const [, , positionEnemy] = enemys[0]
  const paths = findClosedEnemy(
    world.map[Math.floor(position.y)][Math.floor(position.x)],
    world.map[positionEnemy.y][positionEnemy.x],
    world.map
  )
  if (paths) {
    paths.shift()
    paths.pop()
    for (const path of paths) {
      graphics.beginFill(0x0000ff)
      graphics.drawRect(
        center.x + (position.x - path.x) * TILESIZE,
        center.y + (position.y - path.y) * TILESIZE,
        TILESIZE,
        TILESIZE
      )
    }
  }
  //temp player
  const container = new Container()
  // graphics.beginFill('#FF69B4')
  // graphics.drawRect(
  //   center.x,
  //   center.y,
  //   TILESIZE * tranform.width,
  //   TILESIZE * tranform.height
  // )
  console.log(`${world.opts.assetDir}${sprite.texture}`)
  const player = Sprite.from(`${world.opts.assetDir}${sprite.texture}`)
  player.width = TILESIZE * tranform.width
  player.height = TILESIZE * tranform.height
  player.anchor.set(sprite.anchor)
  player.x = center.x + TILESIZE * tranform.width/2
  player.y = center.y + TILESIZE * tranform.height/2
  container.x = center.x
  container.y = center.y
  container.addChild(player)
  app.stage.addChild(player)
  
}
