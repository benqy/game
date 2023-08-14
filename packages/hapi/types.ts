import { Application } from "pixi.js"
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

export type RenderOpts = SysOpts<HapiWorld> & {
  app: Application
}

export enum SystemType {
  // (opts: SysOpts): void
  // (opts: RenderOpts, graphics: PIXI.Graphics): void
  setup,
  start,
  firstUpdate,
  update,
  afterUpdate,
}

export type System<T extends HapiWorld = HapiWorld> = ({ world, deltaTime }: SysOpts<T>) => void