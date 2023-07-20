


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

  public centerCoords: string = '50,50'

  public x: number;
  public y: number;
  private vertexCount: number;

  private initialPos: string;
  private initialCWPos: string;
  private initialCCWPos: string;

  public cwBezierPoint: string;
  public ccwBezierPoint: string;

  constructor(xCoord: number, yCoord: number, vertexCount: number) {
    this.x=xCoord;
    this.y=yCoord;
    this.vertexCount = vertexCount;
    this.initialPos = `${xCoord},${yCoord}`
    this.cwBezierPoint = this.getBezierPoint(`${xCoord},${yCoord}`, true, vertexCount);
    this.ccwBezierPoint = this.getBezierPoint(`${xCoord},${yCoord}`, false, vertexCount)
    this.initialCWPos = this.cwBezierPoint
    this.initialCCWPos = this.ccwBezierPoint
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

    const currentCoordX = parseFloat(currentCoord.split(',')[0]);
    const currentCoordY = parseFloat(currentCoord.split(',')[1]);

    const centerX = parseFloat(this.centerCoords.split(',')[0]);
    const centerY = parseFloat(this.centerCoords.split(',')[1]);

    const slop: number = (centerY-currentCoordY)/(centerX-currentCoordX);

    // const distanceFromCenter = Math.floor(Math.sqrt(Math.pow((centerY-currentCoordY),2) + Math.pow((centerX-currentCoordX),2)))

    const perpendicularSlop: number = -(1/slop);
    const c = 20 - vertexCount   // length of bezier line (half) // segements increase, this number should reduce
    // const c = (distanceFromCenter * 2) / vertexCount\
    const a = c/Math.sqrt(1+Math.pow(perpendicularSlop,2));


    // below lines could be optimised
    if (currentCoordY === centerX) {
      if ((currentCoordX <= centerX && clockwise) || (currentCoordX > centerX && !clockwise)) {
        return `${currentCoordX},${Math.round((currentCoordY - (c)) * 100) / 100}` 
      }
      return `${currentCoordX},${Math.round((currentCoordY + (c)) * 100) / 100}` 
    }

    if ((currentCoordY < centerY && clockwise) || (currentCoordY > centerY && !clockwise)) {
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
    const centerX = parseFloat(this.centerCoords.split(',')[0]);
    const centerY = parseFloat(this.centerCoords.split(',')[1]);

    const xDiff = centerX - this.x;
    const yDiff = centerY - this.y;
    const randomBloomPercetage = Math.round(Math.random() * (bloomFactor) * 100) / 100

    this.x += (randomBloomPercetage * xDiff)
    this.y += (randomBloomPercetage * yDiff)
    this.initialPos =`${this.x},${this.y}`
    this.resetBezier()
  } 

  public resetBezier (): void {
    this.cwBezierPoint = this.getBezierPoint(`${this.x},${this.y}`, true, this.vertexCount)
    this.ccwBezierPoint = this.getBezierPoint(`${this.x},${this.y}`, false, this.vertexCount)
  }

  private setX (x: number): void {
    this.x = x;
  }

  private setY (y: number): void  {
    this.y = y;
  }

  public setCoords (coords: string, event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.WheelEvent<HTMLDivElement>, autoSetBezier: boolean): void  {
    this.setX(parseFloat(coords.split(',')[0]));
    this.setY(parseFloat(coords.split(',')[1]));

    if (event.ctrlKey) { // ctrl: move point independently
      if (autoSetBezier) this.resetBezier() // if we move all vertices, beziers arent auto set
    } 

    if (event.altKey) {
      
    }
  }

  public setCWCoords (coords: string): void  {
    this.cwBezierPoint = coords
  }

  public setCCWCoords (coords: string): void  {
    this.ccwBezierPoint = coords
  }

  public getOffsetCoords (offsetAmount: string): string {
    
    const xOffset = parseFloat(offsetAmount.split(',')[0])
    const yOffset = parseFloat(offsetAmount.split(',')[1])

    const newX = Math.round((parseFloat(this.initialPos.split(',')[0]) + xOffset) * 100) / 100
    const newY = Math.round((parseFloat(this.initialPos.split(',')[1]) + yOffset) * 100) / 100
    
    
    return `${newX},${newY}`;
  }

  public getCWOffsetCoords (offsetAmount: string): string {
    
    const xOffset = parseFloat(offsetAmount.split(',')[0])
    const yOffset = parseFloat(offsetAmount.split(',')[1])

    const newX = Math.round((parseFloat(this.initialCWPos.split(',')[0]) + xOffset) * 100) / 100
    const newY = Math.round((parseFloat(this.initialCWPos.split(',')[1]) + yOffset) * 100) / 100
    
    
    return `${newX},${newY}`;
  }

  public getCCWOffsetCoords (offsetAmount: string): string {
    
    const xOffset = parseFloat(offsetAmount.split(',')[0])
    const yOffset = parseFloat(offsetAmount.split(',')[1])

    const newX = Math.round((parseFloat(this.initialCCWPos.split(',')[0]) + xOffset) * 100) / 100
    const newY = Math.round((parseFloat(this.initialCCWPos.split(',')[1]) + yOffset) * 100) / 100
    
    return `${newX},${newY}`;
  }

  public saveCurrentAsInitial() {
    this.initialPos = `${this.x},${this.y}`;
    this.initialCWPos = this.cwBezierPoint;
    this.initialCCWPos = this.ccwBezierPoint;
  }

  public setCenterCoords(coords: string): void {
    this.centerCoords = coords
  }

  public getPointOnGradient (increment: number): string {
    const centerX: number = parseFloat(this.centerCoords.split(',')[0])
    const centerY: number = parseFloat(this.centerCoords.split(',')[1])

    const slop: number = (centerY-this.x)/(centerX-this.y);
    
    const c = increment  
    const a = c/Math.sqrt(1+Math.pow(slop,2));
    // console.log(this.centerCoords)
    return `${Math.round((this.x + (a*slop)) * 100) / 100},${Math.round((this.y + (a)) * 100) / 100}`
  }

  public withinCenter (currentCoord: string): boolean{
    const currentCoordX = parseFloat(currentCoord.split(',')[0]);
    const currentCoordY = parseFloat(currentCoord.split(',')[1]);

    if ((currentCoordX < 52 && currentCoordX > 48) && (currentCoordY < 52 && currentCoordY > 48)) {
      console.log('mid')
      return true;
    }

 
    return false; 
  }

}