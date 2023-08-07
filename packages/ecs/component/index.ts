import { getId } from '../util'

export type ComponentData = Record<PropertyKey, unknown>

export type ComponentInstance = ComponentData & {
  id: string
  typeId: string
}

//每个Component实例表示一种组件类型, ComponentInstance才是组件的实例)
export class Component<Data extends ComponentData = ComponentData> {
  private _data = {} as ComponentData

  public id = getId()

  constructor(defaultData: (() => Data) | Data) {
    let data = {} as Data
    if (typeof defaultData === 'function') {
      data = defaultData()
    } else {
      data = defaultData
    }
    this._data = Object.preventExtensions(data)
  }

  public create(data: Partial<Data> = {}) {
    return Object.preventExtensions<ComponentInstance>({
      ...this._data,
      ...data,
      id: getId(),
      //所属组件类型id
      typeId: this.id
    })
  }
}

export function defineComponent<Data extends ComponentData = ComponentData>(
  defaultData: (() => Data) | Data
) {
  return new Component(defaultData)
}
