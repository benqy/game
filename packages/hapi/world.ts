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
  mapSize = { x: 100, y: 100 }
  constructor(opts?: HapiOptions) {
    super()
    if (opts) this.opts = { ...this.opts, ...opts }
    const view = this.opts.view
    // console.log(view.offsetHeight, view.offsetWidth)
    // const xTileNum = Math.floor(view.offsetWidth / TILESIZE)
    // const yTileNum = Math.floor(view.offsetHeight / TILESIZE)
    // const width = xTileNum * TILESIZE
    // const height = yTileNum * TILESIZE

    this.app = new Application<HTMLCanvasElement>({
      // backgroundAlpha: 0,
      backgroundColor: 0x1099bb,
      resizeTo: view,
      antialias: false,
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
      .add(C.Position.create({ x: 50, y: 50 }))
      .add(C.Tranform.create({ width: 1, height: 1 }))
      .add(C.Player.create())
      .add(C.Velocity.create({ x: 0.2, y: 0.1 }))
      .add(C.Camera.create({ width: 18 }))
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
    mapSys({ world: this, deltaTime })
  }

  private update(deltaTime: number) {
    cameraSys({ world: this, app: this.app, deltaTime }, this.graphics)

    moveSys({ world: this, deltaTime })
  }
}
