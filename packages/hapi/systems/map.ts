import { RenderOpts } from '../types'
import { CaveAutomaton } from '../map'
import { Graphics } from 'pixi.js'
import { TILESIZE } from '../constants'
// import { Optional, createQuery } from '@benqy/ecs'


export function mapSys({ world, app }: RenderOpts, width:number, height:number) {
  const graphics = new Graphics()
  const automaton = new CaveAutomaton({
    width,
    height
  })
  automaton.generate()
  automaton.findRooms()
  for (let y = 0; y < automaton.map.length; y++) {
    for (let x = 0; x < automaton.map[y].length; x++) {
      if (automaton.map[y][x].isBlock) {
        graphics.beginFill(0x333333)
        graphics.drawRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
      } else {
        graphics.beginFill(0xaaaaaa)
        graphics.drawRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE)
      }
    }
  }
  app.stage.addChild(graphics)
  world.map = automaton.map
}
