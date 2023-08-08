import { Application, Graphics } from 'pixi.js'
import {
  defineComponent,
  createEntity,
  createQuery,
  World,
  Optional,
  SystemOptions,
} from '@benqy/ecs'

type RenderSystemOption = SystemOptions & {
  graphics: Graphics
}

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

const VQuery = createQuery([Velocity,Position])
const PQuery = createQuery([Position, Optional(Enemy), Optional(Player)])

const moveSystem = ({world,deltaTime}: SystemOptions) => {
  for (const [velocity,position] of VQuery.exec(world)) {
    position.x += velocity.x * deltaTime
    position.y += velocity.y * deltaTime
  }
}

const renderSystem = ({ world, graphics }: RenderSystemOption) => {
  graphics.clear()
  for (const [position, , player] of PQuery.exec(world)) {
    const color = player ? '#FFA500' : '#FF1493'
    graphics.beginFill(color)
    graphics.drawRect(position.x, position.y, 50, 50)
  }
}

const world = new World()

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
    this.graphics = new Graphics()
    el.appendChild(this.app.view)
    this.app.stage.addChild(this.graphics)
  }

  //temp
  private graphics: Graphics
  private app: Application<HTMLCanvasElement>
  world = world

  setup() {
    const character = createEntity()
      .add(Position.create({ x: 300, y: 200 }))
      .add(Velocity.create({ x: 2,y:1 }))
      .add(Name.create({ name: '玩家' }))
      .add(Player.create())
    this.world.add(character)

    for (let i = 0; i < 10; i++) {
      const enemy = createEntity()
        .add(Position.create({ x: 50 * i, y: 50 * i }))
        .add(Velocity.create({ x: 0.1 * i, y: 0.2 * i }))
        .add(Name.create({ name: '敌人' }))
        .add(Enemy.create())
      this.world.add(enemy)
    }
  }

  start() {
    console.log(this.world)
    requestAnimationFrame(() => this.update())
  }

  private update() {
    renderSystem({ world: this.world, graphics: this.graphics, deltaTime: 0.16 })
    moveSystem({ world: this.world, deltaTime: 0.16 })
    requestAnimationFrame(()=>this.update())
  }
}
