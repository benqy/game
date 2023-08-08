import { World } from '@benqy/ecs'
import { Tile, HapiOptions } from './types'
import { Application } from 'pixi.js'
import { TILESIZE } from './constants'
import { mapSys } from './systems/map'

export class HapiWorld extends World {
  private firstUpdateFlag = true
  constructor(opts?: HapiOptions) {
    super()
    if (opts) this.opts = { ...this.opts, ...opts }
    const view = this.opts.view
    // console.log(view.offsetHeight, view.offsetWidth)
    const xTileNum = Math.floor(view.offsetWidth / TILESIZE)
    const yTileNum = Math.floor(view.offsetHeight / TILESIZE)
    const width = xTileNum * TILESIZE
    const height = yTileNum * TILESIZE
    view.style.width = `${width}px`
    view.style.height = `${height}px`

    this.app = new Application<HTMLCanvasElement>({
      // backgroundAlpha: 0,
      backgroundColor: 0x1099bb,
      width,
      height,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })
    view.appendChild(this.app.view)
    this.setup()
  }

  opts = {
    view: document.body,
  }
  private app: Application<HTMLCanvasElement>
  map: Tile[][] = []

  private setup() {
  }

  start() {
    this.app.ticker.add((deltaTime) => {
      if(this.firstUpdateFlag){
        this.firstUpdate(deltaTime)
        this.firstUpdateFlag = false
      }
      this.update(deltaTime)
    })
  }

  private firstUpdate(deltaTime: number) {
    console.log(deltaTime)
    const xTileNum = Math.floor(this.opts.view.offsetWidth / TILESIZE)
    const yTileNum = Math.floor(this.opts.view.offsetHeight / TILESIZE)
    mapSys({ world: this, app: this.app, deltaTime: 0 },xTileNum,yTileNum)
    console.log(this.map)
  }

  private update(deltaTime: number) {}
}
