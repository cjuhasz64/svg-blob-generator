


// get a randow point betwenn the coord and the middle
    // max bloom is a percentage, meaning the maximum from the 
    // coord. i.e, 0.1 would be within 10% of distance between
    // coord and center
    // const centerX = 50;
    // const centerY = 50;
    // const x = parseInt(coord.split(',')[0]);
    // const y = parseInt(coord.split(',')[1]);

    // const xDiff = centerX - x;
    // const yDiff = centerY - y;

    // const randomBloomPercetage = Math.round(Math.random() * (maxBloom) * 100) / 100

    // return `${x + (randomBloomPercetage * xDiff)},${y + (randomBloomPercetage * yDiff)}`
export default class Vertex {

  readonly centerX: number = 50;
  readonly centerY: number = 50;

  public x: number;
  public y: number;
  private vertexCount: number;

  public cwBezierPoint: string;
  public ccwBezierPoint: string;

  constructor(xCoord: number, yCoord: number, vertexCount: number, ) {
    this.x=xCoord;
    this.y=yCoord;
    this.vertexCount = vertexCount;

    this.cwBezierPoint = this.getBezierPoint(`${xCoord},${yCoord}`, true, vertexCount);
    this.ccwBezierPoint = this.getBezierPoint(`${xCoord},${yCoord}`, false, vertexCount)

  }

  private getBezierPoint(currentCoord: string, clockwise: boolean, vertexCount: number): string {

    // we want the bezier curve points to be in a perpendicular line from the vertex -> center.
    // org gradient = rise/run
    // (g) perpendiular gradient  = -1/g
    // pythagoras theorem: 
    // c = length of bezier line / 2
    // b = ag
    // a = ?
    // therefor: a^2 + (ag)^2 = c^2
    // solving for a we get: a = c/sqrt(1+g^2)
    // a = change in x
    // g*a = change in y

    // we can use the nagative or positive version shown
    // below based on the vertex y pos and direction (then rounded to 2 decimal places)

    const centerX: number = 50;
    const centerY: number = 50;
    const currentCoordX = parseInt(currentCoord.split(',')[0]);
    const currentCoordY = parseInt(currentCoord.split(',')[1]);

    const slop: number = (centerY-currentCoordY)/(centerX-currentCoordX);
    
    const distanceFromCenter = Math.floor(Math.sqrt(Math.pow((centerY-currentCoordY),2) + Math.pow((centerX-currentCoordX),2)))

    const perpendicularSlop: number = Math.round(-(1/slop) * 100) / 100;
    const c = 20 - vertexCount   // length of bezier line (half) // segements increase, this number should reduce
    // const c = (distanceFromCenter * 2) / vertexCount\
    const a = c/Math.sqrt(1+Math.pow(perpendicularSlop,2));

    if (currentCoordY < 50 && clockwise || currentCoordY >= 50 && !clockwise) {
      return `${Math.round((currentCoordX + a) * 100) / 100},${Math.round((currentCoordY + (a*perpendicularSlop)) * 100) / 100}` 
    } 
    return `${Math.round((currentCoordX - a) * 100) / 100},${Math.round((currentCoordY - (a*perpendicularSlop)) * 100) / 100}` 
  }

  public getCoordsString (direction?: 'cw' | 'ccw'): string{
    if (direction === 'cw') return this.cwBezierPoint
    if (direction === 'ccw') return this.ccwBezierPoint
    return `${this.x},${this.y}`;
  }

  public bloom (bloomFactor: number) {
    const xDiff = this.centerX - this.x;
    const yDiff = this.centerY - this.y;
    const randomBloomPercetage = Math.round(Math.random() * (bloomFactor) * 100) / 100

    this.x += (randomBloomPercetage * xDiff)
    this.y += (randomBloomPercetage * yDiff)

    this.cwBezierPoint = this.getBezierPoint(`${this.x},${this.y}`, true, this.vertexCount)
    this.ccwBezierPoint = this.getBezierPoint(`${this.x},${this.y}`, false, this.vertexCount)
  } 

  private setX (x: number): void {
    this.x = x;
  }

  private setY (y: number): void  {
    this.y = y;
  }

  private setCWX (x: number): void  {
    this.cwBezierPoint = this.cwBezierPoint.replace(this.cwBezierPoint.split(',')[0], x.toString())
  }

  private setCWY (y: number): void  {
    this.cwBezierPoint = this.cwBezierPoint.replace(this.cwBezierPoint.split(',')[1], y.toString())
  }

  private setCCWX (x: number): void  {
    this.ccwBezierPoint = this.ccwBezierPoint.replace(this.ccwBezierPoint.split(',')[0], x.toString())
  }

  private setCCWY (y: number): void  {
    this.ccwBezierPoint = this.ccwBezierPoint.replace(this.ccwBezierPoint.split(',')[1], y.toString())
  }


  public setCoords (coords: string): void  {
    this.setX(parseInt(coords.split(',')[0]));
    this.setY(parseInt(coords.split(',')[1]));
  }

  public setCWCoords (coords: string): void  {
    this.setCWX(parseInt(coords.split(',')[0]));
    this.setCWY(parseInt(coords.split(',')[1]));
  }

  public setCCWCoords (coords: string): void  {
    this.setCCWX(parseInt(coords.split(',')[0]));
    this.setCCWY(parseInt(coords.split(',')[1]));
  }
}