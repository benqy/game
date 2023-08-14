import { HapiWorld } from "./worlds/hapi"

export type Tile = {
  //是否不可到达
  isBlock: boolean
  //地块上是否
  isHolder:boolean
  theme: TileTheme
  x:number
  y:number
}

export enum TileTheme {
  floor='floor',
  wall='wall',
  water='water',
  grass='grass',
}


export type HapiOptions = {
  view:HTMLElement,
  assetDir:string,
}

export type SysOpts<T extends HapiWorld = HapiWorld> = {
  world: T,
  deltaTime: number
}

export enum SystemType {
  setup,
  start,
  firstUpdate,
  update,
  afterUpdate,
}

export type System<T extends HapiWorld = HapiWorld> = ({ world, deltaTime }: SysOpts<T>) => void