import { Component, ComponentData, ComponentInstance } from '../component'
import { getId } from '../util'

export class Entity {
  public components: ComponentInstance[] = []

  public id = getId()

  private _findIndex(obj: ComponentInstance | Component) {
    if (obj instanceof Component) {
      return this.components.findIndex((instance) => obj.id === instance.typeId)
    }
    return this.components.findIndex((t) => obj.id === t.id)
  }

  public add(instance: ComponentInstance) {
    const index = this.components.findIndex((c) => c.typeId === instance.typeId)
    if (index >= 0) {
      this.components[index] = instance
    } else {
      this.components.push(instance)
    }

    return this
  }

  public remove(obj: Component | ComponentInstance) {
    const index = this._findIndex(obj)

    if (index >= 0) {
      this.components.splice(index, 1)
    }

    return this
  }

  public find<Data extends ComponentData = ComponentData>(
    obj: Component<Data> | ComponentInstance
  ): ComponentInstance | undefined {
    const index = this._findIndex(obj)

    if (index >= 0) return this.components[index] as ComponentInstance
    return undefined
  }

  public has(obj: Component | ComponentInstance): boolean {
    return this._findIndex(obj) >= 0
  }
}

export const createEntity = () => new Entity()
