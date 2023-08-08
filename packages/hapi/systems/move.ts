import { createQuery } from '@benqy/ecs'
import * as C from '../components'
import { SysOpts } from '../types'

const moveQuery = createQuery([C.Velocity, C.Position, C.Tranform])

export const moveSys = ({ world, deltaTime }: SysOpts) => {
  const entities = moveQuery.exec(world)
  for (const [velocity, position, tranform] of entities) {
    velocity.x = Math.random() > 0.7 ? -velocity.x : velocity.x
    velocity.y = Math.random() > 0.6 ? -velocity.y : velocity.y
    position.x += velocity.x * deltaTime
    position.y += velocity.y * deltaTime
  }
}
