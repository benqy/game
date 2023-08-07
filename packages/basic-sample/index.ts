import {
  defineComponent,
  createEntity,
  createQuery,
  World,
  With,
  Without,
  Optional,
  System,
} from '@benqy/ecs'

const Position = defineComponent(() => {
  return {
    x: 0,
    y: 0,
  }
})

const Velocity = defineComponent(() => {
  return {
    x: 0,
    y: 0,
  }
})

const Name = defineComponent({
  name: 'name',
})

const Player = defineComponent({})

const Enemy = defineComponent({})

const VQuery = createQuery([Velocity])
const PQuery = createQuery([Position])

// const query = Query.exec(world)
// console.log(query)
// for (const [name, velocity, player] of query) {
//   console.log(name, velocity, player)
// }

export class Game {
  constructor(public id:string) {}

  world = new World()

  setup() {
    const character = createEntity()
      .add(Position.create({ x: 3 }))
      .add(Velocity.create({ x: 5 }))
      .add(Name.create({ name: '玩家' }))
      .add(Player.create())
    this.world.add(character)
    for (let i = 0; i < 10; i++) {
      const enemy = createEntity()
        .add(Position.create({ x: 10 * i, y: 10 * i }))
        .add(Velocity.create({ x: 0.1 * i, y: 0.2 * i }))
        .add(Name.create({ name: '敌人' }))
      this.world.add(enemy)
    }
  }

  start() {
    console.log(this.world)
  }
}
