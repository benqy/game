import { sampleMoveSys, sampleRenderSys, sampleSpawnSys } from './sample'
import { cameraSys, mapSys, moveSys, spawnSys } from './systems'
import { HapiOptions, SystemType } from './types'
import { MainWorld } from './worlds'

export class MainSence {
  constructor(opts?: HapiOptions) {
    if (opts) this.opts = { ...this.opts, ...opts }
    this.world = new MainWorld(this.opts)
    this.world.addSys(mapSys, SystemType.firstUpdate)
    this.world.addSys(spawnSys, SystemType.firstUpdate)

    this.world.addSys(cameraSys, SystemType.update)
    this.world.addSys(moveSys, SystemType.update)
    this.world.setup()
  }

  opts = {
    view: document.body,
    assetDir: './assets',
  }

  world: MainWorld

  start() {
    this.world.start()
  }
}

export class QuadSence {
  constructor(opts?: HapiOptions) {
    if (opts) this.opts = { ...this.opts, ...opts }
    this.world = new MainWorld(this.opts)
    this.world.addSys(sampleSpawnSys,SystemType.firstUpdate)
    this.world.addSys(sampleMoveSys,SystemType.update)
    this.world.addSys(sampleRenderSys,SystemType.firstUpdate)
    this.world.setup()
  }

  opts = {
    view: document.body,
    assetDir: './assets',
  }

  world: MainWorld

  start(){
    this.world.app.stage.addChild(this.world.graphics)
    this.world.start()
  }
}
