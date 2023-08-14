import { HapiOptions } from "./types"
import { MainWorld } from "./worlds"


export class MainSence {
  constructor(opts?:HapiOptions) {
    if (opts) this.opts = { ...this.opts, ...opts }
    this.world = new MainWorld(this.opts)
  }

  opts = {
    view:document.body,
    assetDir: './assets',
  }

  world:MainWorld

  start(){
    this.world.start()
  }
}
