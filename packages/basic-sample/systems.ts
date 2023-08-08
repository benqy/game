import { Optional, SystemOptions, createQuery } from '@benqy/ecs'
import * as C from './components'
import { Graphics } from 'pixi.js'

type RenderSystemOption = SystemOptions & {
  graphics: Graphics
}

const moveQuery = createQuery([
  C.Velocity,
  Optional(C.Collider),
  C.Position,
  C.Size,
])
const renderQuery = createQuery([
  C.Position,
  C.Size,
  Optional(C.Enemy),
  Optional(C.Player),
])


export const moveSystem = ({ world, deltaTime }: SystemOptions) => {
  const entities = moveQuery.exec(world)
  for (let i = 0; i < entities.length; i++) {
    const [velocity1, collider1, position1, size1] = entities[i]
    if (collider1) {
      for (let j = i + 1; j < entities.length; j++) {
        const [velocity2, collider2, position2, size2] = entities[j]
        if (collider2) {
          const collidesX = position1.x < position2.x + size2.width && position1.x + size1.width > position2.x
          const collidesY = position1.y < position2.y + size2.height && position1.y + size1.height > position2.y
          if (collidesX && collidesY) {
            velocity1.x = -velocity1.x
            velocity1.y = -velocity1.y
            velocity2.x = -velocity2.x
            velocity2.y = -velocity2.y
          }
        }
      }
      if (position1.x < 0 || position1.x > 800 - size1.width) {
        velocity1.x = -velocity1.x
      }
      if (position1.y < 0 || position1.y > 600 - size1.height) {
        velocity1.y = -velocity1.y
      }
      position1.x += velocity1.x * deltaTime
      position1.y += velocity1.y * deltaTime
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
