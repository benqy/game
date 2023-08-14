export type Point = {
  //   readonly x: number
  //   readonly y: number

  //   constructor(x: number, y: number) {
  //     this.x = x
  //     this.y = y
  //   }
  x: number
  y: number
}

export class Rectangle {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  intersects(other: Rectangle): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    )
  }

  contains(point: Point) {
    return (
      point.x >= this.x &&
      point.x < this.x + this.width &&
      point.y >= this.y &&
      point.y < this.y + this.height
    )
  }
}

export class Quadtree {
  boundary: Rectangle
  capacity: number
  points: Point[]
  divided: boolean
  nw: Quadtree | null
  ne: Quadtree | null
  sw: Quadtree | null
  se: Quadtree | null

  constructor(boundary: Rectangle, capacity: number) {
    this.boundary = boundary
    this.capacity = capacity
    this.points = []
    this.divided = false
    this.nw = null
    this.ne = null
    this.sw = null
    this.se = null
  }

  insert(point: Point): boolean {
    if (!this.boundary.contains(point)) {
      return false
    }

    if (this.points.length < this.capacity) {
      this.points.push(point)
      return true
    }

    if (!this.divided) {
      this.subdivide()
    }

    return (
      this.nw!.insert(point) ||
      this.ne!.insert(point) ||
      this.sw!.insert(point) ||
      this.se!.insert(point)
    )
  }

  subdivide(): void {
    const x = this.boundary.x
    const y = this.boundary.y
    const w = this.boundary.width / 2
    const h = this.boundary.height / 2

    const nwBoundary = new Rectangle(x - w, y - h, w, h)
    this.nw = new Quadtree(nwBoundary, this.capacity)

    const neBoundary = new Rectangle(x + w, y - h, w, h)
    this.ne = new Quadtree(neBoundary, this.capacity)

    const swBoundary = new Rectangle(x - w, y + h, w, h)
    this.sw = new Quadtree(swBoundary, this.capacity)

    const seBoundary = new Rectangle(x + w, y + h, w, h)
    this.se = new Quadtree(seBoundary, this.capacity)

    this.divided = true
  }

  query(range: Rectangle): Point[] {
    const found: Point[] = []

    if (!this.boundary.intersects(range)) {
      return found
    }

    for (const p of this.points) {
      if (range.contains(p)) {
        found.push(p)
      }
    }

    if (this.divided) {
      found.push(...this.nw!.query(range))
      found.push(...this.ne!.query(range))
      found.push(...this.sw!.query(range))
      found.push(...this.se!.query(range))
    }

    return found
  }
}
