import { Tile, TileTheme } from '../types'
import { randomByRatio } from '../utils'

type OnProgress = (map: Tile[][]) => void

type Options = {
  blockRatio?: number
  iterations?: number
  aliveThreshold?: number
  width?: number
  height?: number
  roomMinSize?: number
}
//TODO:优化生成性能,优化连通算法
export class CaveAutomaton {
  constructor(opts?: Options) {
    if (opts) this.opts = { ...this.opts, ...opts }
  }

  opts = {
    blockRatio: 0.48,
    iterations: 15,
    aliveThreshold: 5,
    //宽度表示X轴瓦片数量,不是实际尺寸
    width: 50,
    //高度Y轴表示瓦片数量,不是实际尺寸
    height: 50,
    //房间最小尺寸,小于这个尺寸的房间会被墙体瓦片填充
    roomMinSize: 10,
  }

  map: Tile[][] = []
  rooms: Tile[][] = []

  clear() {
    this.map = []
    this.rooms = []
  }

  private isBoundary(x: number, y: number) {
    return (
      x === 0 ||
      y === 0 ||
      x === this.opts.width - 1 ||
      y === this.opts.height - 1
    )
  }

  private initMap() {
    for (let y = 0; y < this.opts.height; y++) {
      const row: Tile[] = []
      for (let x = 0; x < this.opts.width; x++) {
        const isBlock =
          randomByRatio(this.opts.blockRatio) || this.isBoundary(x, y)
        const tile = {
          isBlock,
          theme: isBlock ? TileTheme.wall : TileTheme.floor,
          x,
          y,
        }
        row.push(tile)
      }
      this.map.push(row)
    }
  }

  private generalBoundary() {
    for (let y = 0; y < this.opts.height; y++) {
      this.map[y][0].isBlock = true
      this.map[y][this.opts.width - 1].isBlock = true
    }
    for (var x = 0; x < this.opts.width; x++) {
      this.map[0][x].isBlock = true
      this.map[this.opts.height - 1][x].isBlock = true
    }
  }

  private getSurroundingCoords(
    x: number,
    width: number,
    y: number,
    height: number
  ) {
    const minX = Math.max(x - 1, 0),
      maxX = Math.min(x + 1, width - 1),
      minY = Math.max(y - 1, 0),
      maxY = Math.min(y + 1, height - 1)
    return { minY, maxY, minX, maxX }
  }

  cellularEvolution() {
    const { width, height } = this.opts
    const tGrid: Tile[][] = []
    for (let y = 0; y < height; y++) {
      const tRow: Tile[] = []
      for (let x = 0; x < width; x++) {
        const { minY, maxY, minX, maxX } = this.getSurroundingCoords(
          x,
          width,
          y,
          height
        )

        let wCount = 0
        for (var ty = minY; ty <= maxY; ty++) {
          for (var tx = minX; tx <= maxX; tx++) {
            if (this.map[ty][tx].isBlock) wCount++
          }
        }
        if (wCount >= this.opts.aliveThreshold)
          tRow.push({
            isBlock: true,
            theme: TileTheme.wall,
            x,
            y,
          })
        else
          tRow.push({
            isBlock: false,
            theme: TileTheme.floor,
            x,
            y,
          })
      }
      tGrid.push(tRow)
    }
    this.map = tGrid
  }

  //这里宽高指的是地图的网格数量，不是真实的尺寸
  generate(onProgress?: OnProgress) {
    this.initMap()

    for (var i = 0; i < this.opts.iterations; i++) {
      this.cellularEvolution()
      if (onProgress) {
        // new Promise((resolve) => setTimeout(resolve, 100))
        onProgress(this.map)
      }
    }
    this.generalBoundary()
    if (onProgress) onProgress(this.map)
  }

  findRooms() {
    const rooms: Tile[][] = []
    const visited: boolean[][] = []

    for (let y = 0; y < this.opts.height; y++) {
      visited[y] = []
      for (let x = 0; x < this.opts.width; x++) {
        visited[y][x] = false
      }
    }

    for (let y = 0; y < this.opts.height; y++) {
      for (let x = 0; x < this.opts.width; x++) {
        if (!visited[y][x] && !this.map[y][x].isBlock) {
          const room: Tile[] = []
          this.bfs(x, y, visited, room)
          rooms.push(room)
        }
      }
    }
    this.rooms = rooms
    this.removeSmallRooms()
  }

  bfs(x: number, y: number, visited: boolean[][], room: Tile[]) {
    const queue: [number, number][] = [[x, y]]

    while (queue.length > 0) {
      const [x, y] = queue.shift()!
      if (x < 0 || x >= this.opts.width || y < 0 || y >= this.opts.height) {
        continue
      }

      if (visited[y][x] || this.map[y][x].isBlock) {
        continue
      }

      visited[y][x] = true
      room.push(this.map[y][x])

      queue.push([x - 1, y])
      queue.push([x + 1, y])
      queue.push([x, y - 1])
      queue.push([x, y + 1])
    }
  }

  removeSmallRooms(): Tile[][] {
    const smallRooms: Tile[][] = []

    for (const room of this.rooms) {
      if (room.length < this.opts.roomMinSize) {
        for (const tile of room) {
          tile.isBlock = true
        }

        smallRooms.push(room)
      }
    }

    this.rooms = this.rooms.filter((room) => room.length >= this.opts.roomMinSize)

    return this.rooms
  }

  connectRooms() {
    const rooms = this.rooms.slice()
    const connectedRooms: Tile[][] = []

    const startRoom = rooms.shift()!
    connectedRooms.push(startRoom)

    while (rooms.length > 0) {
      const room = rooms.shift()!
      const connectedRoom = this.getClosestRoom(room, connectedRooms)

      if (connectedRoom) {
        this.connectTwoRooms(room, connectedRoom)
        connectedRooms.push(room)
      }
    }
  }

  
  connectTwoRooms(roomA: Tile[], roomB: Tile[]) {
    const pointA = this.getRandomPoint(roomA)
    const pointB = this.getRandomPoint(roomB)

    const [x1, y1] = pointA
    const [x2, y2] = pointB

    let x = x1
    let y = y1

    while (x !== x2 || y !== y2) {
      if (x !== x2) {
        x += x1 < x2 ? 1 : -1
      } else if (y !== y2) {
        y += y1 < y2 ? 1 : -1
      }

      this.map[y][x].isBlock = false
    }
  }

  getRandomPoint(room: Tile[]) {
    const index = Math.floor(Math.random() * room.length)
    const { x, y } = room[index]

    return [x, y]
  }

  getClosestRoom(room: Tile[], connectedRooms: Tile[][]) {
    let closestRoom: Tile[] | undefined
    let closestDistance = Infinity

    for (const connectedRoom of connectedRooms) {
      const distance = this.getDistance(room, connectedRoom)

      if (distance < closestDistance) {
        closestDistance = distance
        closestRoom = connectedRoom
      }
    }

    return closestRoom
  }

  getDistance(roomA: Tile[], roomB: Tile[]) {
    let closestDistance = Infinity

    for (const tileA of roomA) {
      for (const tileB of roomB) {
        const distance = Math.hypot(tileA.x - tileB.x,tileA.y - tileB.y)

        if (distance < closestDistance) {
          closestDistance = distance
        }
      }
    }

    return closestDistance
  }
}
