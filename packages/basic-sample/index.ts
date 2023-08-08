import { Application, Graphics } from 'pixi.js'
import * as C from './components'
import * as S from './systems'
import { createEntity, World } from '@benqy/ecs'

const world = new World()
const width = 800
const height = 600

const randomBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomPosition = () => {
  return {
    x: randomBetween(100, 700),
    y: randomBetween(100, 500),
  }
}

export class Game {
  constructor(public id: string) {
    const el: HTMLElement = document.querySelector(`#${id}`)!
    this.app = new Application<HTMLCanvasElement>({
      // backgroundAlpha: 0,
      backgroundColor: 0x1099bb,
      width,
      height,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    })
    this.app.ticker.maxFPS = 60
    this.graphics = new Graphics()
    el.appendChild(this.app.view)
    this.app.stage.addChild(this.graphics)
    this.setup()
  }

  //temp
  private graphics: Graphics
  private app: Application<HTMLCanvasElement>
  world = world

  private setup() {
    //TODO Spawn System
    const character = createEntity()
      .add(C.Position.create(randomPosition()))
      .add(C.Velocity.create({ x: 15, y: 10 }))
      .add(C.Name.create({ name: '玩家' }))
      .add(C.Size.create({ width: 80, height: 80 }))
      .add(C.Player.create())
    this.world.add(character)

    for (let i = 1; i < 6; i++) {
      const enemy = createEntity()
        .add(C.Position.create(randomPosition()))
        .add(
          C.Velocity.create({
            x: randomBetween(5, 25),
            y: randomBetween(10, 30),
          })
        )
        .add(C.Size.create({ width: 50, height: 50 }))
        .add(C.Name.create({ name: '敌人' }))
        .add(C.Enemy.create())
      this.world.add(enemy)
    }
  }

  start() {
    console.log(this.world)
    requestAnimationFrame(() => this.update())
  }

  private update() {
    S.renderSystem({
      world: this.world,
      graphics: this.graphics,
      deltaTime: 0.16,
    })
    S.moveSystem({ world: this.world, deltaTime: 0.16 })
    requestAnimationFrame(() => this.update())
  }
}
