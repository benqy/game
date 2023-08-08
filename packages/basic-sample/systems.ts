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
      for (let j = i; j < entities.length; j++) {
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
            // size1.height += 1
            // size1.width += 1
          }
        }
      }
    }
  }
}

const brightColors = [
  '#FFA500',
  '#FFFF00',
  '#00FF00',
  '#00FFFF',
  '#0000FF',
  '#FF00FF',
  '#FF1493',
  '#FF69B4',
  '#ADFF2F',
  '#00FF7F',
  '#1E90FF',
  '#8A2BE2',
  '#FFC0CB',
  '#FF8C00',
]

export const renderSystem = ({ world, graphics }: RenderSystemOption) => {
  graphics.clear()
  for (const [position, size, , player] of renderQuery.exec(world)) {
    const color = player
      ? '#000000'
      : brightColors[Math.floor(Math.random() * brightColors.length)]
    graphics.beginFill(color)
    graphics.drawRect(position.x, position.y, size.width, size.height)
  }
}
