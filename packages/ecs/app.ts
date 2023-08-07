import { System } from './system'
import { World } from './world'

interface GameLoop {
  start(): void
  stop(): void
}

export class BasicGameLoop implements GameLoop {
  private running = false
  private lastTime = 0
  private readonly systems: System[] = []

  constructor(
    private readonly world: World,
    private readonly targetFPS: number
  ) {}

  registerSystem(system: System) {
    this.systems.push(system)
  }

  unregisterSystem(system: System) {
    const index = this.systems.indexOf(system)
    if (index !== -1) {
      this.systems.splice(index, 1)
    }
  }

  start() {
    this.running = true
    this.lastTime = performance.now()
    this.loop()
  }

  stop() {
    this.running = false
  }

  private loop() {
    if (!this.running) {
      return
    }

    requestAnimationFrame(() => this.loop())

    const now = performance.now()
    const deltaTime = (now - this.lastTime) / 1000
    const targetDeltaTime = 1 / this.targetFPS

    if (deltaTime >= targetDeltaTime) {
      this.lastTime = now - (deltaTime - targetDeltaTime) * 1000
      this.update(deltaTime)
    }
  }

  private update(deltaTime: number) {
    for (const system of this.systems) {
      system(this.world, deltaTime)
    }
  }
}
