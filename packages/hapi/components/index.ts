import { defineComponent } from '@benqy/ecs'

export const Position = defineComponent({
  x: 0,
  y: 0,
})

export const Tranform = defineComponent({
  width: 0,
  height: 0,
  anchor:0.5,
})

export const Rigidbody = defineComponent({
  mass: 1,
})

export const Collider = defineComponent({
  width: 0,
  height: 0,
})

export const Player = defineComponent({})

export const Camera = defineComponent({
  width: 300,
})

export const Velocity = defineComponent(() => {
  return {
    x: 0,
    y: 0,
  }
})

export const Enemy = defineComponent({})


export * from './render'