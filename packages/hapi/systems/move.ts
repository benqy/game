import { createQuery } from '@benqy/ecs'
import * as C from '../components'
import { SysOpts, Tile } from '../types'
import { PPU } from '../constants'
import { aStar } from './astar'
import { MainWorld } from '../worlds'

const findClosedEnemy = (start: Tile, end: Tile, map: Tile[][]) => {
  const paths = aStar(start, end, map)
  return paths
}

const moveQuery = createQuery([C.Velocity, C.Position, C.Player, C.Tranform])
const enemyQuery = createQuery([C.Enemy, C.RenderAble, C.Position, C.Tranform])

export const moveSys = ({ world, deltaTime }: SysOpts<MainWorld>) => {
  const entities = moveQuery.exec(world)
  for (const [velocity, position] of entities) {
    // velocity.x = Math.random() > 0.8 ? -velocity.x : velocity.x
    // velocity.y = Math.random() > 0.7 ? -velocity.y : velocity.y
    if (position.x < 2 || position.x > world.mapSize.x - 2) {
      velocity.x = -velocity.x
    }
    if (position.y < 2 || position.y > world.mapSize.y - 2) {
      velocity.y = -velocity.y
    }
    const enemys = enemyQuery.exec(world)
    const [, , positionEnemy] = enemys[0]
    const paths = findClosedEnemy(
      world.map[Math.floor(position.y)][Math.floor(position.x)],
      world.map[positionEnemy.y][positionEnemy.x],
      world.map
    )
    if (paths?.length) {
      paths.shift()
      const next = paths[1]
      // console.log(next.x, next.y, position.x, position.y)
      if (next) {
        velocity.x = next.x - position.x
        velocity.y = next.y - position.y
        // const p1 = new Vector2(position.x, position.y)
        // const p2 = new Vector2(next.x, next.y)
        // const angle = p1.directionTo(p2)
        // console.log(p1.directionTo(p2),p1.angleTo(p2))
        position.x += (velocity.x / 1000) * deltaTime * PPU
        position.y += (velocity.y / 1000) * deltaTime * PPU
      }
    }
  }
}
