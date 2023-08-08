import { World, createEntity } from '@benqy/ecs'
import { Tile, HapiOptions } from './types'
import { Application, Graphics } from 'pixi.js'
import { TILESIZE } from './constants'
import { mapSys } from './systems/map'
import * as C from './components'
import { cameraSys } from './systems/camera'
import { moveSys } from './systems/move'

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
    this.graphics = new Graphics()
    this.app.stage.addChild(this.graphics)
    view.appendChild(this.app.view)
    this.setup()
  }

  opts = {
    view: document.body,
  }
  private graphics: Graphics
  private app: Application<HTMLCanvasElement>
  map: Tile[][] = []

  private setup() {
    const character = createEntity()
      .add(C.Position.create({ x: 900, y: 500 }))
      .add(C.Tranform.create({ width: 50, height: 50 }))
      .add(C.Player.create())
      .add(C.Velocity.create({ x: 2, y: 6 }))
      .add(C.Camera.create({ width: 300 }))
    this.add(character)
  }

  start() {
    this.app.start()
    this.app.ticker.add((deltaTime) => {
      if (this.firstUpdateFlag) {
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
    mapSys({ world: this, app: this.app, deltaTime: 0 }, xTileNum, yTileNum)
    console.log(this.map)
  }

  private update(deltaTime: number) {
    
    cameraSys({ world: this, app: this.app, deltaTime },this.graphics)
    moveSys({ world: this, deltaTime })
  }
}
