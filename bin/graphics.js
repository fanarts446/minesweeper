/*
  graphics.js

  # Graphic's Values
  * Point(x:Number, y:Number)
  * Vector(orgX: Number, orgY: Number, normalX: Number, normalY: Number)
  * Region(x: Number, y: Number,
           width: Number, height: Number)

  # Lines
  * Vertical(ctx: Context, pt:Point, width: Number | 2)
  * Line(ctx, sPt: Point, ePt: Point, width: Number | 2) (vector?)
  (* FreeLine(T.B.D.))
  (* Arc)
  (* Circle)

  # Shapes
  * Rectangle(ctx: Context,
              topLeftPt:Point,
              width: Number, height: Number,
              color: String,
              cornerRadius: Number | null,
              cutLine: Line | null)
  (* Square)
  (* RoundedRectangle)
  (* Triangle(T.B.D))
  (* RoundedTriangle)
  * Oval(ctx Context,
         centerPt: Point,
         radiusX: Number, radiusY: Number
         color: String
         cutLine: Line | null);

  # etc
  * Image
*/

// =============================================================================
//  Graphic Units
// =============================================================================

class Point {
  /*
    x: Number
    y: Number
   */
  constructor(x, y){
    this.__x = x;
    this.__y = y;
  }
  get x() {
    return this.__x;
  }
  get y() {
    return this.__y;
  }
  clone(x, y) {
    if (!x & !y) return new Point(this.__x, this.__y);
    if (x  & !y) return new Point(x, this.__y);
    if (!x & y) return new Point(this.__x, y);
    return new Point(x, y);
  }
  cloneX(y) {
    return new Point(this.__x, y);
  }
  cloneY(x) {
    return new Point(x ,this.__y);
  }
  add(pt) {
    return new Point(this.__x + pt.x, this.__y + pt.y);
  }
  sub(pt) {
    return new Point(this.__x - pt.x, this.__y - pt.y);
  }
  // mul() {
  //   // T.B.D.
  // }
  // div() {
  //   // T.B.D.
  // }
}

class Vector {
  costructor(startPoint, endPoint){
    this.__startPoint = startPoint;
    this.__endPoint   = endPoint;
  }
  get startPoint() {
    return this.__startPoint;
  }
  get endPoint() {
    return this.__endPoint;
  }
  add(vec) {
    const dx = vec.endPoint.x - this.startPoint.x;
    const dy = vec.endPoint.y - this.startPoint.y;
    return new Vector(this.startPoint,
                      new Point(this.endPoint.x + dx, this.endPoint.y + dy));
  }
  sub(vec) {
    const dx = vec.endPoint.x - this.startPoint.x;
    const dy = vec.endPoint.y - this.startPoint.y;
    return new Vector(this.startPoint,
                      new Point(this.endPoint.x - dx, this.endPoint.y - dy));
  }
  dot(vec) {
    const dx = vec.startPoint.x - this.startPoint.x;
    const dy = vec.startPoint.y - this.startPoint.y;
    const pt = new Point(vec.endPoint.x - dx, vec.endPoint.y - dy);
    return this.endPoint.x * pt.x + this.endPoint.y * pt.y;
  }
}

// class Region(x: Number, y: Number,
//            width: Number, height: Number)

// =============================================================================
//  Lines
// =============================================================================
// class Vertical(ctx: Context, pt:Point, width: Number | 2)
class Line {
  /*
    ctx:        Context
    startPoint: Point
    endPoint:   Point
    color:      String
    [width:     Number (default 2)]
   */
  constructo(ctx, startPoint, endPoint, color, width = 2){
    this.__ctx        = ctx;
    this.__startPoint = startPoint;
    this.__endPoint   = endPoint;
    this.__color      = color;
    this.__lineWidth  = width;
  }
  get startPoint() {
    return this.__startPoint;
  }
  get endPoint() {
    return this.__endPoint;
  }
  draw() {
    const buff = this.__ctx.strokeStyle;
    this.__ctx.strokeStyle = this.__color.toString();
    this.__ctx.beginPath();
    this.__ctx.moveTo(this.__startPoint.x,
                      this.__startPoint.y);
    this.__ctx.lineTo(this.__endPoint.x,
                      this.__endPoint.y);
    this.__ctx.stroke();
    this.__ctx.strokeStyle = buff;
  }
}

// =============================================================================
//  Shapes
// =============================================================================
class Rectangle {
  /*
    ctx:           Context
    topLeftPt:     Point
    width:         Number
    height:        Number
    color:         String
    [cornerRadius: Number   (defulat null)]
    [cutLine:      Line     (default null)]
    [image:        Image    (degault null)]
  */
  constructor(ctx, topLeftPoint, width, height, color,
              cornerRadius = 0, cutLine = null, secondaryColor = null,
              image = null){
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__width        = width;
    this.__height       = height;
    this.__color        = color;
    this.__cornerRadius = cornerRadius;
    this.__cutLine      = cutLine;
    this.__2ndColor     = secondaryColor;
    this.__image        = image;
  }
  draw(){
    this.__ctx.beginPath();
    // this.__ctx.lineWidth = this.__lineWidth;
    this.__ctx.fillStyle = this.__color.toString();
    this.__ctx.moveTo(this.__topLeftPoint.x,
                      this.__topLeftPoint.y + this.__cornerRadius);
    this.__ctx.arc(this.__topLeftPoint.x + this.__cornerRadius,
                   this.__topLeftPoint.y + this.__height - this.__cornerRadius,
                   this.__cornerRadius,
                   Math.PI, Math.PI*0.5, true);
    this.__ctx.arc(this.__topLeftPoint.x + this.__width  - this.__cornerRadius,
                   this.__topLeftPoint.y + this.__height - this.__cornerRadius,
                   this.__cornerRadius,
                   Math.PI*0.5,0,1);
    this.__ctx.arc(this.__topLeftPoint.x + this.__width - this.__cornerRadius,
                   this.__topLeftPoint.y + this.__cornerRadius,
                   this.__cornerRadius,
                   0,Math.PI*1.5,1);
    this.__ctx.arc(this.__topLeftPoint.x + this.__cornerRadius,
                   this.__topLeftPoint.y + this.__cornerRadius,
                   this.__cornerRadius,
                   Math.PI*1.5,Math.PI,1);
    this.__ctx.closePath();
    this.__ctx.fill();

    if (this.__image) {
      this.__ctx.drawImage(this.__image,
                           this.__topLeftPoint.x, this.__topLeftPoint.y);
    }
  }
}

class RectangleStroke {
  /*
    ctx:           Context
    topLeftPt:     Point
    width:         Number
    height:        Number
    color:         String
    lineWidth:     Number
    [cornerRadius: Number   (defulat null)]
    [cutLine:      Line     (default null)]
  */
  constructor(ctx, topLeftPoint, width, height, color, lineWidth,
              cornerRadius = 0, cutLine = null, secondaryColor = null){
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__width        = width;
    this.__height       = height;
    this.__color        = color;
    this.__lineWidth    = lineWidth;
    this.__cornerRadius = cornerRadius;
    this.__cutLine      = cutLine;
    this.__2ndColor     = secondaryColor;
  }
  draw(){
    this.__ctx.beginPath();
    this.__ctx.lineWidth = this.__lineWidth;
    this.__ctx.strokeStyle = this.__color.toString();
    this.__ctx.moveTo(this.__topLeftPoint.x,
                      this.__topLeftPoint.y + this.__cornerRadius);
    this.__ctx.arc(this.__topLeftPoint.x + this.__cornerRadius,
                   this.__topLeftPoint.y + this.__height - this.__cornerRadius,
                   this.__cornerRadius,
                   Math.PI, Math.PI*0.5, true);
    this.__ctx.arc(this.__topLeftPoint.x + this.__width  - this.__cornerRadius,
                   this.__topLeftPoint.y + this.__height - this.__cornerRadius,
                   this.__cornerRadius,
                   Math.PI*0.5,0,1);
    this.__ctx.arc(this.__topLeftPoint.x + this.__width - this.__cornerRadius,
                   this.__topLeftPoint.y + this.__cornerRadius,
                   this.__cornerRadius,
                   0,Math.PI*1.5,1);
    this.__ctx.arc(this.__topLeftPoint.x + this.__cornerRadius,
                   this.__topLeftPoint.y + this.__cornerRadius,
                   this.__cornerRadius,
                   Math.PI*1.5,Math.PI,1);
    this.__ctx.closePath();
    this.__ctx.stroke();
  }
}

// class Parallelogram {
//     /*
//     ctx:           Context
//     topLeftPt:     Point
//     breadth:       Number
// 
//     color:         String
//     [cornerRadius: Number   (defulat null)]
//     [cutLine:      Line     (default null)]
//   */
//   constructor(ctx, topLeftPoint, width, height, color,
//               cornerRadius = 0, cutLine = null, secondaryColor = null){
//     this.__ctx          = ctx;
//     this.__topLeftPoint = topLeftPoint;
//     this.__width        = width;
//     this.__height       = height;
//     this.__color        = color;
//     this.__cornerRadius = cornerRadius;
//     this.__cutLine      = cutLine;
//     this.__2ndColor     = secondaryColor;
//   }
//   draw(){
//     this.__ctx.beginPath();
//     this.__ctx.lineWidth = this.__lineWidth;
//     this.__ctx.fillStyle = this.__color;
//     this.__ctx.moveTo(this.__topLeftPoint.x,
//                       this.__topLeftPoint.y + this.__cornerRadius);
//     this.__ctx.arc(this.__topLeftPoint.x + this.__cornerRadius,
//                    this.__topLeftPoint.y + this.__height - this.__cornerRadius,
//                    this.__cornerRadius,
//                    Math.PI, Math.PI*0.5, true);
//     this.__ctx.arc(this.__topLeftPoint.x + this.__width  - this.__cornerRadius,
//                    this.__topLeftPoint.y + this.__height - this.__cornerRadius,
//                    this.__cornerRadius,
//                    Math.PI*0.5,0,1);
//     this.__ctx.arc(this.__topLeftPoint.x + this.__width - this.__cornerRadius,
//                    this.__topLeftPoint.y + this.__cornerRadius,
//                    this.__cornerRadius,
//                    0,Math.PI*1.5,1);
//     this.__ctx.arc(this.__topLeftPoint.x + this.__cornerRadius,
//                    this.__topLeftPoint.y + this.__cornerRadius,
//                    this.__cornerRadius,
//                    Math.PI*1.5,Math.PI,1);
//     this.__ctx.closePath();
//     this.__ctx.fill();
//   }
// }

class Oval{
  /*
    ctx:         Context
    centerPoint: Point
    radiusX:     Number
    radiusY:     Number
    color:       String
    [rotation:   Number (defualt 0)]
    [cutLine:    Line   (default null)]
  */
  constructo(ctx, centerPoint, radiusX, radiusY, color,
             rotation = 0, cutLine = null){
    this.__ctx         = ctx;
    this.__centerPoint = centerPoint;
    this.__radiusX     = radiusX;
    this.__radiusY     = radiusY;
    this.__color       = color;
    this.__rotation = rotation;
    this.__cutLine     = cutLine;
  }
  draw() {
    this.__ctx.beginPath();
    this.__ctx.ellipse(this.__centerPoint.x, this.__centerPoint.y,
                       this.__radiusX, this.__radiusY, this.__rotation,
                       0, 2 * Math.PI);
    this.__ctx.fill()
  }
}

class GameImage {
  /*
    ctx:           Context
    topLeftPt:     Point
    image:         Uint8ClampedArray
  */
  constructor(ctx, topLeftPoint, image, png = null) {
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__image        = image;
    this.__png          = png;
  }
  draw(){
    this.__ctx.putImageData(this.__image,
                            this.__topLeftPoint.x, this.__topLeftPoint.y);
    if (this.__png) {
      this.__ctx.drawImage(this.__png, this.__topLeftPoint.x, this.__topLeftPoint.y);
    }
  }
}

class GraphicsText2 {
  // top left‚ÅŽw’è‚Å‚«‚é‚æ‚¤‚É‚·‚é
  constructor(ctx, topLeftPoint, fontStyle, text, color) {
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__fontStyle    = fontStyle;
    this.__text         = text;
    this.__color        = color;
  }
  changeText(text) {
    this.__text = text;
  }
  draw(){
    this.__ctx.fillStyle = this.__color.toString();
    this.__ctx.font = this.__fontStyle;
    const textMetrics = this.__ctx.measureText(this.__text);
    this.__ctx.fillText(this.__text,
                        this.__topLeftPoint.x,
                        this.__topLeftPoint.y);
  }
}

class GraphicsText {
  // top left‚ÅŽw’è‚Å‚«‚é‚æ‚¤‚É‚·‚é
  constructor(ctx,
              topLeftPoint, width, height,
              fontSize, fontStyle, text, color) {
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__fontStyle    = fontStyle;
    this.__width        = width;
    this.__height       = height;
    this.__text         = text;
    this.__color        = color;
    this.__fontSize     = fontSize;

  }
  changeText(text) {
    this.__text = text;
  }
  draw(){
    this.__ctx.fillStyle = this.__color.toString();
    this.__ctx.font = this.__fontStyle;

    const textMetrics = this.__ctx.measureText(this.__text);

    let widthDiff = (this.__width - textMetrics.width)>>1;
    widthDiff = widthDiff >= 0 ? widthDiff : 0;

    let heightDiff = (this.__height - this.__fontSize)>>1;
    heightDiff -= textMetrics.fontBoundingBoxDescent>>1;
    heightDiff = heightDiff >= 0 ? heightDiff : 0;

    this.__ctx.fillText(this.__text,
                        this.__topLeftPoint.x + widthDiff,
                        this.__topLeftPoint.y + this.__fontSize + heightDiff);

    // // DEBUG
    // this.__ctx.beginPath();
    // this.__ctx.lineWidth = 1;
    // this.__ctx.strokeStyle = this.__color.toString();
    // this.__ctx.moveTo(this.__topLeftPoint.x + widthDiff , this.__topLeftPoint.y + heightDiff);
    // this.__ctx.lineTo(this.__topLeftPoint.x + widthDiff , this.__topLeftPoint.y + heightDiff + this.__fontSize);
    // this.__ctx.lineTo(this.__topLeftPoint.x + widthDiff  + textMetrics.width, this.__topLeftPoint.y + heightDiff + this.__fontSize);
    // this.__ctx.lineTo(this.__topLeftPoint.x + widthDiff  + textMetrics.width, this.__topLeftPoint.y + heightDiff);
    // this.__ctx.closePath();
    // this.__ctx.stroke();
  }
}

class GraphicsComplexText {
  constructor(ctx, topLeftPoint, fontStyle, text, color) {
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__fontStyle    = fontStyle;
    this.__text         = text;
    this.__color        = color;
  }
  changeText(text) {
    this.__text = text;
  }
  draw(){
    this.__ctx.fillStyle = this.__color.toString();
    this.__ctx.font = this.__fontStyle;
    this.__ctx.fillText(this.__text,
                        this.__topLeftPoint.x, this.__topLeftPoint.y);
  }
}

class GraphicsCollection {
  /*
    ctx:           Context
  */
  constructor(ctx) {
    this.__collection = [];
  }
  add(graphics){
    this.__collection.push(graphics);
  }
  remove() {
    return this.__collection.pop();
  }
  removeGraphics(graphics) {
    this.__collection
      = this.__collection.filter((elm) => elm !== graphics);
  }
  draw(){
    this.__collection.forEach((elm) => {
      elm.draw();
    });
  }
}



