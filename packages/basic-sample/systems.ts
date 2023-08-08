import { Optional, SystemOptions, createQuery } from '@benqy/ecs'
import * as C from './components'
import { Graphics } from 'pixi.js'

type RenderSystemOption = SystemOptions & {
  graphics: Graphics
}

const moveQuery = createQuery([C.Velocity, C.Position, C.Size])

const enemyQuery = createQuery(['id', C.Collider, C.Position, C.Size, C.Enemy])
const playerQuery = createQuery([C.Collider, C.Position, C.Size, C.Player])

const renderQuery = createQuery([
  C.Position,
  C.Size,
  Optional(C.Enemy),
  Optional(C.Player),
])

export const moveSystem = ({ world, deltaTime }: SystemOptions) => {
  const entities = moveQuery.exec(world)
  for (const [velocity, position, size] of entities) {
    if (position.x < 0 || position.x > 800 - size.width) {
      velocity.x = -velocity.x
    }
    if (position.y < 0 || position.y > 600 - size.height) {
      velocity.y = -velocity.y
    }
    position.x += velocity.x * deltaTime
    position.y += velocity.y * deltaTime
  }
}

export const collisionSystem = ({ world }: SystemOptions) => {
  const players = playerQuery.exec(world)
  const entities = enemyQuery.exec(world)
  for (let i = 0; i < players.length; i++) {
    const [collider1, position1, size1] = players[i]
    if (collider1) {
      for (let j = i + 1; j < entities.length; j++) {
        const [id, collider2, position2, size2] = entities[j]
        if (collider2) {
          const collidesX =
            position1.x < position2.x + size2.width &&
            position1.x + size1.width > position2.x
          const collidesY =
            position1.y < position2.y + size2.height &&
            position1.y + size1.height > position2.y
          if (collidesX && collidesY) {
            world.remove(id)
          }
        }
      }
    }
  }
}

export const renderSystem = ({ world, graphics }: RenderSystemOption) => {
  graphics.clear()
  for (const [position, size, , player] of renderQuery.exec(world)) {
    const color = player ? '#FFA500' : '#FF1493'
    graphics.beginFill(color)
    graphics.drawRect(position.x, position.y, size.width, size.height)
  }
}
