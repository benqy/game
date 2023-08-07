import { Entity } from '../entity'



export class World {
  public entities: Map<string, Entity> = new Map()

  public add(entity: Entity) {
    this.entities.set(entity.id, entity)
    return this
  }

  public remove(id: string): World {
    this.entities.delete(id)
    return this
  }

  public clear() {
    this.entities.clear()
    return this
  }

  public findEntity(id: string): Entity | undefined {
    return this.entities.has(id) ? this.entities.get(id) : undefined
  }
}

export const createWorld = () => new World()
