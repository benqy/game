import { SysOpts } from '../types'
import { MainWorld } from '../worlds'
import { createEntity, createQuery } from '@benqy/ecs'
import { defineComponent } from '@benqy/ecs'
import * as C from '../components'
import { Random } from '../utils'
import { Quadtree, Rectangle } from '../plugins/collision'

const BULLET_NUM = 100

const CircleC = defineComponent({ radius: 2 })

const moveQuery = createQuery([C.Velocity, C.Position, CircleC])

const collides = (
  a: { x: number; y: number; width: number; height: number },
  b:  { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.height + a.y > b.y
  )
 
}

export const sampleSpawnSys = ({ world }: SysOpts<MainWorld>) => {
  const w = world.app.view.width
  const h = world.app.view.height
  for (let i = 0; i < BULLET_NUM; i++) {
    const bullet = createEntity()
      .add(
        C.Position.create({ x: Random.between(0, w), y: Random.between(0, h) })
      )
      .add(CircleC.create({ radius: 10 })) // Random.between(3, 16) }))
      .add(
        C.Velocity.create({
          x: Random.between(-5, 5),
          y: Random.between(-5, 5),
        })
      )
    world.add(bullet)
  }
}

const drawQuadRect = (world: MainWorld, quadtree: Quadtree): void => {
  const graphics = world.graphics
  graphics.lineStyle(2, 0xff0000, 1)
  graphics.drawRect(
    quadtree.boundary.x,
    quadtree.boundary.y,
    quadtree.boundary.width,
    quadtree.boundary.height
  )
  if (quadtree.nw) drawQuadRect(world, quadtree.nw)
  if (quadtree.ne) drawQuadRect(world, quadtree.ne)
  if (quadtree.sw) drawQuadRect(world, quadtree.sw)
  if (quadtree.se) drawQuadRect(world, quadtree.se)
}

export const sampleMoveSys = ({ world }: SysOpts<MainWorld>) => {
  const entities = moveQuery.exec(world)
  const quadtree = new Quadtree(
    new Rectangle(0, 1, world.app.view.width, world.app.view.height),
    4
  )
  world.graphics.clear()
  for (const entity of entities) {
    const [velocity, position, circleC] = entity
    quadtree.insert({ x: position.x, y: position.y })
  }
  drawQuadRect(world, quadtree)
  // console.log(quadtree)

  for (const entity of entities) {
    const [velocity, position, circleC] = entity
    // console.log(quadtree)
    const collisions = []
    const nearbyEntities = quadtree.query(
      new Rectangle(
        position.x,
        position.y,
        circleC.radius * 2,
        circleC.radius * 2
      )
    )

    world.graphics.lineStyle(0, 0xff0000, 1)
    for (const nearbyPoint of nearbyEntities) {
      if (
        nearbyPoint !== position &&
        collides(
          { x: position.x, y: position.y, width:circleC.radius*2,height:circleC.radius*2 },
          { x: nearbyPoint.x, y: nearbyPoint.y, width:circleC.radius*2,height:circleC.radius*2 }
        )
      ) {
        collisions.push([entity, nearbyPoint])
        world.graphics.beginFill(0x00ff00)
        world.graphics.drawCircle(position.x, position.y, circleC.radius)
      } else {
        world.graphics.beginFill(0xffffff)
        world.graphics.drawCircle(position.x, position.y, circleC.radius)
      }
    }
    if (position.x >= world.app.view.width || position.x <= 0) {
      velocity.x = -velocity.x
    }
    if (position.y >= world.app.view.height || position.y <= 0) {
      velocity.y = -velocity.y
    }
    position.x += velocity.x
    position.y += velocity.y
  }
}

export const sampleRenderSys = ({ world }: SysOpts<MainWorld>) => {
  // const entities = moveQuery.exec(world)
  // // world.graphics.clear()
  // world.graphics.beginFill(0xffffff)
  // world.graphics.lineStyle(0, 0xff0000, 1)
  // for (const [velocity, position, circleC] of entities) {
  //   // console.log(position.x, position.y, circleC.radius)
  //   world.graphics.drawCircle(position.x, position.y, circleC.radius)
  // }
}
