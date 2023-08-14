import { SysOpts, Tile } from '../types'
import { Container, Graphics, Sprite } from 'pixi.js'
import { PPU } from '../constants'
import { createQuery } from '@benqy/ecs'
import * as C from '../components'
import { aStar } from './astar'
import { MainWorld } from '../worlds'
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

export function cameraSys({ world }: SysOpts<MainWorld>) {
  const graphics = world.graphics
  const app = world.app
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
    circleMask.drawCircle(center.x, center.y, camera.width * PPU)
    circleMask.endFill()
    cameraContainer.mask = circleMask
    cameraContainer.addChild(graphics)
    app.stage.addChild(circleMask)
  }
  const renderWidth = camera.width + 2
  for (let x = position.x - renderWidth; x <= position.x + renderWidth; x++) {
    for (let y = position.y - renderWidth; y <= position.y + renderWidth; y++) {
      const tile = world.map[Math.floor(y)]?.[Math.floor(x)]
      const xOffset = (x % 1) * PPU
      const yOffset = (y % 1) * PPU
      if (tile) {
        let enemy: unknown
        for (const enemy2 of enemys) {
          const [, , positionEnemy] = enemy2
          if (tile.x === positionEnemy.x && tile.y === positionEnemy.y) {
            enemy = enemy2
          }
        }
        const renderX = center.x + (position.x - x) * PPU + xOffset
        const renderY = center.y + (position.y - y) * PPU + yOffset
        graphics.beginFill(tile.isBlock ? 0x000000 : 0xaaaaaa)
        graphics.drawRect(renderX, renderY, PPU, PPU)
        if (enemy) {
          graphics.beginFill(0xff1100)
          graphics.drawRect(renderX, renderY, PPU, PPU)
        }
      } else {
        graphics.beginFill(0x00000)
        graphics.drawRect(
          center.x + (position.x - x) * PPU + xOffset,
          center.y + (position.y - y) * PPU + yOffset,
          PPU,
          PPU
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
        center.x + (position.x - path.x) * PPU,
        center.y + (position.y - path.y) * PPU,
        3,
        3
      )
    }
  }
  //temp player
  const container = new Container()
  // graphics.beginFill('#FF69B4')
  // graphics.drawRect(
  //   center.x,
  //   center.y,
  //   PPU * tranform.width,
  //   PPU * tranform.height
  // )
  // console.log(`${world.opts.assetDir}${sprite.texture}`)
  const player = Sprite.from(`${world.opts.assetDir}${sprite.texture}`)
  player.width = PPU * tranform.width
  player.height = PPU * tranform.height
  player.anchor.set(tranform.anchor)
  player.x = center.x + PPU * tranform.width/2
  player.y = center.y + PPU * tranform.height/2
  container.x = center.x
  container.y = center.y
  container.addChild(player)
  app.stage.addChild(player)
  
}
