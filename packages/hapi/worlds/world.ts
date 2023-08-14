import { Tile, HapiOptions, SystemType } from '../types'
import { Application, Graphics } from 'pixi.js'
import { mapSys, cameraSys, moveSys, spawnSys } from '../systems'
import { HapiWorld } from './hapi'

export class MainWorld extends HapiWorld<MainWorld> {
  mapSize = { x: 150, y: 150 }
  constructor(opts?: HapiOptions) {
    super()
    if (opts) this.opts = { ...this.opts, ...opts }
    const view = this.opts.view

    this.app = new Application<HTMLCanvasElement>({
      // backgroundAlpha: 0,
      backgroundColor: 0x000000,
      resizeTo: view,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })
    this.graphics = new Graphics()
    view.appendChild(this.app.view)

    this.addSys(mapSys, SystemType.firstUpdate)
    this.addSys(spawnSys, SystemType.firstUpdate)

    this.addSys(cameraSys, SystemType.update)
    this.addSys(moveSys, SystemType.update)

    this.setup()
  }

  opts = {
    view: document.body,
    assetDir: './assets',
  }
  public graphics: Graphics
  public app: Application<HTMLCanvasElement>
  map: Tile[][] = []

  protected setup() {
    this.callSysByType(SystemType.setup, 0)
  }

  public start() {
    this.app.start()
    this.callSysByType(SystemType.start, 0)
    this.app.ticker.add((deltaTime) => {
      if (this.firstUpdateFlag) {
        this.firstUpdate(deltaTime)
        this.firstUpdateFlag = false
      }
      this.update(deltaTime)
    })
  }

  protected firstUpdate(deltaTime: number) {
    this.callSysByType(SystemType.firstUpdate, deltaTime)
    // cameraSys({ world: this, app: this.app, deltaTime }, this.graphics)
    console.log(this)
  }

  protected update(deltaTime: number) {
    this.callSysByType(SystemType.update, deltaTime)
    // cameraSys({ world: this, app: this.app, deltaTime })
    // moveSys({ world: this, deltaTime })
  }

  protected afterUpdate(deltaTime: number): void {
    this.callSysByType(SystemType.afterUpdate, deltaTime)
  }
}
