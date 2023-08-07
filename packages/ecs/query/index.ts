import { Component } from '../component'
import { Entity } from '../entity'
import { World } from '../world'

export const enum Modifier {
  With,
  Without,
}

export const OptionalSym = Symbol('optional')

type QueryComponents = Component | string | OptionalModifier
export type QueryComponentsTuple = [QueryComponents, ...QueryComponents[]]

export type QueryModifier = {
  type: Modifier
  components: Component[]
}

export type OptionalModifier<T = Component> = {
  type: typeof OptionalSym
  value: T
}

export function With(...components: Component[]): QueryModifier {
  return {
    type: Modifier.With,
    components,
  }
}

export function Without(...components: Component[]): QueryModifier {
  return {
    type: Modifier.Without,
    components,
  }
}

export function Optional<C extends Component>(
  component: C
): OptionalModifier<C> {
  return {
    type: OptionalSym,
    value: component,
  }
}

type GetDefaultData<T> = T extends Component<infer Data>
  ? Data
  : T extends string
  ? string
  : T extends OptionalModifier<infer C>
  ? GetDefaultData<C> | undefined
  : never

export type MapQueryReturn<T extends unknown[]> = T extends [
  infer First,
  ...infer Rest
]
  ? [GetDefaultData<First>, ...MapQueryReturn<Rest>]
  : []

export class Query<T extends QueryComponentsTuple> {
  private _withComponents = new Set<Component>()

  private _withoutComponents = new Set<Component>()

  constructor(private _components: T, ...modifiers: QueryModifier[]) {
    modifiers.forEach((modifier) => {
      const modifierComponentSet =
        modifier.type === Modifier.With
          ? this._withComponents
          : this._withoutComponents
      modifier.components.forEach((component) => {
        modifierComponentSet.add(component)
      })
    })
  }

  public exec(world: World): MapQueryReturn<T>[] {
    const matchingEntities = [] as Entity[]
    const queryComponents = this._components.filter(
      (component): component is Component => component instanceof Component
    )
    for (const entity of world.entities.values()) {
      if (
        [...this._withoutComponents].some((component) =>
          entity.has(component)
        ) ||
        ![...this._withComponents].every((component) =>
          entity.has(component)
        ) ||
        !queryComponents.every((component) => {
          return entity.has(component)
        })
      ) {
        continue
      }

      matchingEntities.push(entity)
    }
    return matchingEntities.map((entity) => {
      return this._components.map((component) => {
        if (typeof component === 'string') return entity.id
        if (component instanceof Component) return entity.find(component)
        if (component.type === OptionalSym) {
          return entity.find(component.value)
        }
        return undefined
      })
    }) as MapQueryReturn<T>[]
  }
}

export function createQuery<T extends QueryComponentsTuple>(
  components: T,
  ...modifiers: QueryModifier[]
) {
  return new Query(components, ...modifiers)
}
