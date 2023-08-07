export type EntityId = number

export type TypeProto<T> = (new (...args: any[]) => T) & Function
export type ObjectProto = TypeProto<object>


interface GameLoop {
  start(): void
  stop(): void
}