import { SysOpts } from '../types'
import { CaveAutomaton } from '../plugins/map'
// import { Optional, createQuery } from '@benqy/ecs'


export function mapSys({ world }: SysOpts) {
  const automaton = new CaveAutomaton({
    width: world.mapSize.x,
    height: world.mapSize.y,
    roomMinSize:50,
  })
  automaton.generate()
  automaton.findRooms()
  automaton.connectRooms()
  world.map = automaton.map
}

