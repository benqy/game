import { HapiOptions } from "./types"
import { HapiWorld } from "./world"


export class Hapi {
  constructor(opts?:HapiOptions) {
    if (opts) this.opts = { ...this.opts, ...opts }
    this.world = new HapiWorld(this.opts)
  }

  opts = {
    view:document.body,
  }

  world:HapiWorld

  start(){
    this.world.start()
  }
}
