// Define the Tile type
type Tile = {
  x: number
  y: number
  isBlock: boolean
}

// Define the heuristic function
const heuristic = (a: Tile, b: Tile) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const exchangeMap = (map: Tile[][]) => {
  const rows = map.length
  const cols = map[0].length
  const result: Tile[][] = []

  for (let j = 0; j < cols; j++) {
    const row: Tile[] = []
    for (let i = 0; i < rows; i++) {
      row.push(map[i][j])
    }
    result.push(row)
  }

  return result
}

// Define the A* algorithm function
export const aStar = (start: Tile, end: Tile, map: Tile[][]) => {
  const openSet: Tile[] = [start]
  const cameFrom = new Map<Tile, Tile>()
  const gScore = new Map<Tile, number>()
  const fScore = new Map<Tile, number>()
  map = exchangeMap(map)

  gScore.set(start, 0)
  fScore.set(start, heuristic(start, end))

  while (openSet.length > 0) {
    // Find the tile with the lowest fScore in the open set
    let current = openSet[0]
    let currentIndex = 0
    for (let i = 1; i < openSet.length; i++) {
      if (fScore.get(openSet[i])! < fScore.get(current)!) {
        current = openSet[i]
        currentIndex = i
      }
    }

    if (current === end) {
      const path = [current]
      let node = current
      while (cameFrom.has(node)) {
        node = cameFrom.get(node)!
        path.unshift(node)
      }
      return path
    }

    openSet.splice(currentIndex, 1)
    for (const neighbor of getNeighbors(current, map)) {
      if (neighbor.isBlock) {
        continue
      }

      const tentativeGScore = gScore.get(current)! + 1

      if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)!) {
        cameFrom.set(neighbor, current)
        gScore.set(neighbor, tentativeGScore)
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end))
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor)
        }
      }
    }
  }

  return null
}

// Define the function to get the neighbors of a tile
const getNeighbors = (tile: Tile, map: Tile[][]) => {
  const neighbors = []
  const { x, y } = tile

  if (x > 0) {
    neighbors.push(map[x - 1][y])
  }
  if (x < map.length - 1) {
    neighbors.push(map[x + 1][y])
  }
  if (y > 0) {
    neighbors.push(map[x][y - 1])
  }
  if (y < map[0].length - 1) {
    neighbors.push(map[x][y + 1])
  }

  return neighbors
}

// Example usage
// const map: Tile[][] = [
//   [{ x: 0, y: 0, isBlock: false }, { x: 0, y: 1, isBlock: false }, { x: 0, y: 2, isBlock: false }],
//   [{ x: 1, y: 0, isBlock: false }, { x: 1, y: 1, isBlock: true }, { x: 1, y: 2, isBlock: false }],
//   [{ x: 2, y: 0, isBlock: false }, { x: 2, y: 1, isBlock: false }, { x: 2, y: 2, isBlock: false }],
// ]

// const start = map[0][0]
// const end = map[2][2]
// const path = aStar(start, end, map)

// console.log(path) // Output: [{ x: 0, y: 0, isBlock: false }, { x: 0, y: 1, isBlock: false }, { x: 1, y: 1, isBlock: true }, { x: 2, y: 1, isBlock: false }, { x: 2, y: 2, isBlock: false }]

export function findpath(){
  const map: Tile[][] = [
    [{ x: 0, y: 0, isBlock: false }, { x: 0, y: 1, isBlock: false }, { x: 0, y: 2, isBlock: false }],
    [{ x: 1, y: 0, isBlock: false }, { x: 1, y: 1, isBlock: true }, { x: 1, y: 2, isBlock: false }],
    [{ x: 2, y: 0, isBlock: false }, { x: 2, y: 1, isBlock: false }, { x: 2, y: 2, isBlock: false }],
  ]
  
  const start = map[0][0]
  const end = map[2][2]
  const path = aStar(start, end, map)
  
  console.log(path) 
}