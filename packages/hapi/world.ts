import { World } from '@benqy/ecs'
import { Tile, HapiOptions } from './types'
import { Application, Graphics } from 'pixi.js'
import { mapSys } from './systems/map'
import { cameraSys } from './systems/camera'
import { moveSys } from './systems/move'
import { spawnSys } from './systems/spawn'

export class HapiWorld extends World {
  private firstUpdateFlag = true
  mapSize = { x: 150, y: 150 }
  constructor(opts?: HapiOptions) {
    super()
    if (opts) this.opts = { ...this.opts, ...opts }
    console.log(this.opts,4)
    const view = this.opts.view

    this.app = new Application<HTMLCanvasElement>({
      // backgroundAlpha: 0,
      backgroundColor: 0x000000,
      resizeTo: view,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })
    this.graphics = new Graphics()
    // this.app.stage.addChild(this.graphics)
    view.appendChild(this.app.view)
    this.setup()
  }

  opts = {
    view: document.body,
    assetDir: './assets',
  }
  private graphics: Graphics
  private app: Application<HTMLCanvasElement>
  map: Tile[][] = []

  private setup() {
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
    spawnSys({ world: this, deltaTime })
    // cameraSys({ world: this, app: this.app, deltaTime }, this.graphics)
    console.log(this)
  }

  private update(deltaTime: number) {
    cameraSys({ world: this, app: this.app, deltaTime }, this.graphics)
    moveSys({ world: this, deltaTime })
  }
}
