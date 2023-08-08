import { HapiWorld } from "./world"

export type Tile = {
  //是否不可到达
  isBlock: boolean
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
}

export type SysOpts = {
  world: HapiWorld,
  deltaTime: number
}