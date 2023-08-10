import { Application } from "pixi.js"
import { HapiWorld } from "./world"

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

export type SysOpts = {
  world: HapiWorld,
  deltaTime: number
}

export type RenderOpts = SysOpts & {
  app: Application
}