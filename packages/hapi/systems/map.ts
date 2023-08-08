import { SysOpts } from '../types'
import { CaveAutomaton } from '../map'
// import { Optional, createQuery } from '@benqy/ecs'

export function mapSys({ world }: SysOpts) {
  const automaton = new CaveAutomaton()
}
