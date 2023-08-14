import { World } from '@benqy/ecs'
import { SystemType, System } from '../types'

type SysMap<T extends HapiWorld = HapiWorld> = {
  [key in SystemType]: System<T>[]
}

export abstract class HapiWorld<T extends HapiWorld<any> = any> extends World {
  protected firstUpdateFlag = true

  protected sysMap: SysMap<T> = {
    [SystemType.setup]: [],
    [SystemType.start]: [],
    [SystemType.firstUpdate]: [],
    [SystemType.update]: [],
    [SystemType.afterUpdate]: [],
  }

  protected callSysByType(this: T, type: SystemType, deltaTime: number) {
    this.sysMap[type].forEach((fn) => fn({ world: this, deltaTime }))
  }

  constructor() {
    super()
    this.setup()
  }

  addSys(fn: System<T>, type = SystemType.update) {
    this.sysMap[type].push(fn)
  }

  protected abstract setup(): void

  protected abstract start(): void

  protected abstract firstUpdate(deltaTime: number): void

  protected abstract update(deltaTime: number): void

  protected abstract afterUpdate(deltaTime: number): void
}
