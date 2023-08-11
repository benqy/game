import { defineComponent } from "@benqy/ecs";
import { TileTheme } from "../types";

export const Sprite = defineComponent({
  texture: '/enemy/bug.webp',
  rotation:0,
  alpha:1,
  state:'idle',
  frameIndex:0,
  frameTime:10,
})

//zIndex: 0 ~ 10
export const RenderAble = defineComponent({
  zIndex: 5,
})

export const Tile = defineComponent({
  isBlock: false,
  type: TileTheme.floor,
  isHolder:false,
  x:0,
  y:0,
})
