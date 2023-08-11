import { createQuery } from '@benqy/ecs'
import * as C from '../components'
import { SysOpts } from '../types'
import { PPU } from '../constants'

const moveQuery = createQuery([C.Velocity, C.Position, C.Tranform])

export const moveSys = ({ world, deltaTime }: SysOpts) => {
  const entities = moveQuery.exec(world)
  for (const [velocity, position] of entities) {
    // velocity.x = Math.random() > 0.8 ? -velocity.x : velocity.x
    // velocity.y = Math.random() > 0.7 ? -velocity.y : velocity.y
    if(position.x <2 || position.x > world.mapSize.x -2) {
      velocity.x = -velocity.x
    }
    if(position.y < 2 || position.y > world.mapSize.y -2) {
      velocity.y = -velocity.y
    }
    // let win:any = window
    // if(win.keyhold){
      position.x += (velocity.x/1000) * deltaTime * PPU
      position.y += (velocity.y/1000) * deltaTime * PPU
    // }  
  }
}
