import { Application, Graphics } from 'pixi.js'
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

// const MoveSystem: System = (world, deltaTime) => {
//   for (const [velocity] of VQuery.exec(world)) {
//     velocity.x += velocity.x * deltaTime
//     velocity.y += velocity.y * deltaTime
//   }
// }

export class Game {
  constructor(public id: string) {
    const el: HTMLElement = document.querySelector(`#${id}`)!
    this.app = new Application<HTMLCanvasElement>({
      // backgroundAlpha: 0,
      backgroundColor: 0x1099bb,
      resizeTo: el,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })
    this.app.ticker.maxFPS = 60
    el.appendChild(this.app.view)
  }

  //temp
  positionSystem: System = (world, deltaTime) => {
    const graphics = new Graphics()
    for (const [entity] of PQuery.exec(world)) {
      graphics.beginFill(0xff0000)
      graphics.drawRect(entity.x, entity.y, 50, 50)
    }
    this.app.stage.addChild(graphics)
  }

  private app: Application<HTMLCanvasElement>
  world = new World()

  setup() {
    const character = createEntity()
      .add(Position.create({ x: 300, y: 200 }))
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
    requestAnimationFrame(() => this.update())
  }

  private update() {
    this.positionSystem(this.world, 0.16)
    // requestAnimationFrame(()=>this.update())
  }
}
