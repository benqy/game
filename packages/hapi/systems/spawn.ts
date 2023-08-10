import { createEntity, createQuery } from '@benqy/ecs'
import * as C from '../components'
import { SysOpts, Tile } from '../types'

const moveQuery = createQuery([C.Velocity, C.Position, C.Tranform])

const addEnemy = (tile: Tile) => {
  const enemy = createEntity()
    .add(C.Position.create({ x: tile.x, y: tile.y }))
    .add(C.Tranform.create({ width: 1, height: 1 }))
    .add(C.Render.create())
    .add(C.Enemy.create())
  return enemy
}

const randomTile = (map: Tile[][], n = 1) => {
  const tiles: Tile[] = []
  const rows = map.length
  const cols = map[0].length

  // Find all non-blocked and non-holder tiles
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const tile = map[i][j]
      if (!tile.isBlock && !tile.isHolder) {
        tiles.push(tile)
      }
    }
  }

  // Pick n random tiles from the list
  const result: Tile[] = []
  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * tiles.length)
    result.push(tiles[index])
    tiles.splice(index, 1)
  }
  return result
}

export const spawnSys = ({ world, deltaTime }: SysOpts) => {
  const tiles = randomTile(world.map, 2)
  const tile = tiles.shift()

  const character = createEntity()
  .add(C.Position.create({ x: tile!.x, y: tile!.y }))
    .add(C.Tranform.create({ width: 1, height: 1 }))
    .add(C.Player.create())
    .add(C.Velocity.create({ x: 1.5, y: 1.5 }))
    .add(C.Camera.create({ width: 10 }))
  world.add(character)
  for (const tile of tiles) world.add(addEnemy(tile))
}
