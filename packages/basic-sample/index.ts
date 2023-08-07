import {
  defineComponent,
  createEntity,
  createQuery,
  World,
  With,
  Without,
  Optional,
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

const Player = defineComponent({ a: 1 })

const Query = createQuery([Name, Velocity, Optional(Player)])

const p1 = Position.create({ x: 3 })
const v1 = Velocity.create({ x: 5 })

const character = createEntity()
  .add(p1)
  .add(v1)
  .add(Name.create({ name: '玩家' }))
  .add(Player.create())

const world = new World()
world.add(character)
for (let i = 0; i < 10; i++) {
  const enemy = createEntity()
    .add(Position.create({ x: 10, y: 10 }))
    .add(Velocity.create({ x: 1, y: 2 }))
    .add(Name.create({ name: '敌人' }))
  world.add(enemy)
}
const query = Query.exec(world)
console.log(query)
for (const [name, velocity, player] of query) {
  console.log(name, velocity, player)
}
