export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  public divide(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  public magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector2(0, 0);
    }
    return this.divide(mag);
  }

  public distance(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public directionTo(other: Vector2): Vector2 {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return new Vector2(dx, dy).normalize();
  }

  public angleTo(other: Vector2): number {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.atan2(dy, dx);
  }
}