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
  a: { x: number; y: number; radius: number },
  b: { x: number; y: number; radius: number }
): boolean => {
  return (
    a.x < b.x + b.radius &&
    a.x + a.radius > b.x &&
    a.y < b.y + b.radius &&
    a.y + a.radius > b.y
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

export const sampleMoveSys = ({ world }: SysOpts<MainWorld>) => {
  const entities = moveQuery.exec(world)
  const quadtree = new Quadtree(
    new Rectangle(0, 0, world.app.view.width, 600),
    4
  )

  for (const entity of entities) {
    const [velocity, position, circleC] = entity
    quadtree.insert({ x: position.x, y: position.y })
  }

  for (const entity of entities) {
    const [velocity, position, circleC] = entity
    // console.log(quadtree)
    const collisions = []
    for (const entity of entities) {
      const nearbyEntities = quadtree.query(
        new Rectangle(position.x, position.y, circleC.radius, circleC.radius)
      )
      for (const nearbyPoint of nearbyEntities) {
        if (
          nearbyPoint !== position &&
          collides(
            { x: position.x, y: position.y, radius: circleC.radius },
            { x: nearbyPoint.x, y: nearbyPoint.y, radius: circleC.radius }
          )
        ) {
          collisions.push([entity, nearbyPoint])
        }
      }
    }
    console.log(collisions)
    // if (position.x >= world.app.view.width || position.x <= 0) {
    //   velocity.x = -velocity.x
    // }
    // if (position.y >= world.app.view.height || position.y <= 0) {
    //   velocity.y = -velocity.y
    // }
    // position.x += velocity.x
    // position.y += velocity.y
  }
}

export const sampleRenderSys = ({ world }: SysOpts<MainWorld>) => {
  const entities = moveQuery.exec(world)
  world.graphics.clear()
  world.graphics.beginFill(0xffffff)
  for (const [velocity, position, circleC] of entities) {
    // console.log(position.x, position.y, circleC.radius)
    world.graphics.drawCircle(position.x, position.y, circleC.radius)
  }
}
