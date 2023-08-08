import { Optional, SystemOptions, createQuery } from "@benqy/ecs"
import * as C from "./components"
import { Graphics } from "pixi.js"

type RenderSystemOption = SystemOptions & {
  graphics: Graphics
}

const moveQuery = createQuery([C.Velocity,C.Position])
const renderQuery = createQuery([C.Position,C.Size, Optional(C.Enemy), Optional(C.Player)])



export const moveSystem = ({world,deltaTime}: SystemOptions) => {
  for (const [velocity,position] of moveQuery.exec(world)) {
    position.x += velocity.x * deltaTime
    position.y += velocity.y * deltaTime
  }
}

export const renderSystem = ({ world, graphics }: RenderSystemOption) => {
  graphics.clear()
  for (const [position,size, , player] of renderQuery.exec(world)) {
    const color = player ? '#FFA500' : '#FF1493'
    graphics.beginFill(color)
    graphics.drawRect(position.x, position.y, size.width, size.height)
  }
}
