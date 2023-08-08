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
  for (const [velocity, collider, position, size] of moveQuery.exec(world)) {
    //如果有碰撞组件,直接用Size作为碰撞体积,实际应用中碰撞体积与渲染体积不一定一致
    if (collider) {
      if (position.x < 0 || position.x > 800 - size.width) {
        velocity.x = -velocity.x
      }
      if (position.y < 0 || position.y > 600 - size.height) {
        velocity.y = -velocity.y
      }
    }
    position.x += velocity.x * deltaTime
    position.y += velocity.y * deltaTime
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
