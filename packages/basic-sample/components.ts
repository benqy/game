import { defineComponent } from '@benqy/ecs'

export const Position = defineComponent(() => {
  return {
    x: 0,
    y: 0,
  }
})

export const Size = defineComponent({
  width: 0,
  height: 0,
})

export const Velocity = defineComponent(() => {
  return {
    x: 0,
    y: 0,
  }
})

export const Name = defineComponent({
  name: 'name',
})

export const Player = defineComponent({})

export const Enemy = defineComponent({})
