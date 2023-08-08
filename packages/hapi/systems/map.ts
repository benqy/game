import { RenderOpts } from '../types'
import { CaveAutomaton } from '../map'
// import { Optional, createQuery } from '@benqy/ecs'


export function mapSys({ world, app }: RenderOpts, width:number, height:number) {
  const automaton = new CaveAutomaton({
    width,
    height,
    roomMinSize:50,
  })
  automaton.generate()
  automaton.findRooms()
  automaton.connectRooms()
  world.map = automaton.map
}
