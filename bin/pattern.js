class ShishiroPattern {
  // backGroundColor = new Rgb(0x00, 0x00, 0x07);
  // borderColor = new Rgb(0xEE, 0xEE, 0xE7);
  // accentColor = '#8c7024'
  constructor(size, 
              backGroundRgb, borderRgb, accentRgb){
    this.__size = size;

    this.__backGroundColor = backGroundRgb;
    this.__borderColor = borderRgb;
    this.__accentColor = accentRgb;

    this.__imgData = null;
    this.__ctx = null;
    this.__cells = null;
  }
  initImage() {
    const canvas = document.createElement('canvas');
    canvas.width  = this.__size;
    canvas.height = this.__size;
    canvas.style.margin = 0;
    let ctx = canvas.getContext('2d');

    const backGround = new Rectangle(ctx, new Point(1,1),
                                     this.__size, this.__size,
                                     this.__backGroundColor.toString());
    backGround.draw();

    // this.drawPattern(ctx, 45);
    // this.drawPattern2(ctx, 0);
    this.drawPattern2(ctx, 45, 100, -250);
    // this.drawPattern3(ctx, 45);

    this.__ctx = ctx;
  }
  drawPattern3(ctx, degree, dx=0, dy=0) {
    // ctx.rotate(degree * Math.PI / 180);
    dx = (this.__size * 0.5) * Math.cos(degree * Math.PI / 180) + dx;
    dy = (this.__size * 0.5) * Math.sin(degree * Math.PI / 180) + dy;

    const borderColor = this.__borderColor.toString();
    const breadth = 50 * (30 / 50) * dx;
    // (float (* 524 (/ 5 6)))
    let sPt = new Point(this.__size - 6 * breadth+dx, -1000+dy);
    let ePt = new Point(this.__size - 6 * breadth+dx,  1000+dy);

    // border 1
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // border 2
    sPt = new Point(sPt.x + 2 * breadth, sPt.y);
    ePt = new Point(ePt.x + 2 * breadth, ePt.y);
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // border 3
    sPt = new Point(sPt.x + 2 * breadth, sPt.y);
    ePt = new Point(ePt.x + 2 * breadth, ePt.y);
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // (float (* 524 (/ 1 4)))
    // border 4
    sPt = new Point(this.__size * (1/6) + dx, this.__size * 0.5 + dy);
    ePt = new Point(this.__size * (1/6) + dx, this.__size + dy);
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // Accent
    sPt = new Point(this.__size * (1/6) + dx, (this.__size * 0.5) - 2 * breadth + dy);
    ePt = new Point(this.__size * (1/6) + dx, (this.__size * 0.5) - breadth + dy);
    ctx.fillStyle = this.__accentColor.toString();
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

  }
  drawPattern2(ctx, degree, dx=0, dy=0) {
    ctx.rotate(degree * Math.PI / 180);

    const borderColor = this.__borderColor.toString();
    const breadth = 50 * (30 / 50);
    // (float (* 524 (/ 5 6)))
    let sPt = new Point(this.__size - 6 * breadth+dx, -1000+dy);
    let ePt = new Point(this.__size - 6 * breadth+dx,  1000+dy);

    // border 1
    (new Rectangle(ctx,
                   sPt,
                   breadth, 2000,
                   borderColor)).draw();

    // border 2
    sPt = new Point(sPt.x + 2 * breadth, sPt.y);
    (new Rectangle(ctx,
                   sPt,
                   breadth, 2000,
                   borderColor)).draw();

    // border 3
    sPt = new Point(sPt.x + 2 * breadth, sPt.y);
    (new Rectangle(ctx,
                   sPt,
                   breadth, 2000,
                   borderColor)).draw();

    // (float (* 524 (/ 1 4)))
    // border 4
    sPt = new Point(this.__size * (1/6) + dx, this.__size * 0.5 + dy);
    var h = this.__size - (this.__size * 0.5);
    (new Rectangle(ctx,
                   sPt,
                   breadth, h,
                   borderColor)).draw();

    // Accent
    sPt = new Point(this.__size * (1/6) + dx, (this.__size * 0.5) - 2 * breadth + dy);
    h = (this.__size * 0.5) - breadth - ((this.__size * 0.5) - 2 * breadth);
    (new Rectangle(ctx,
                   sPt,
                   breadth, h,
                   this.__accentColor.toString())).draw();

    ctx.rotate(-1 * degree  * Math.PI / 180);

  }
  drawPattern(ctx, degree) {
    ctx.rotate(degree * Math.PI / 180);

    const borderColor = this.__borderColor.toString();
    const breadth = 30;
    // (float (* 524 (/ 5 6)))
    let sPt = new Point(437, -1000);
    let ePt = new Point(437, 1000);

    // border 1
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // border 2
    sPt = new Point(sPt.x + 2 * breadth, sPt.y);
    ePt = new Point(ePt.x + 2 * breadth, ePt.y);
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // border 3
    sPt = new Point(sPt.x + 2 * breadth, sPt.y);
    ePt = new Point(ePt.x + 2 * breadth, ePt.y);
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // (float (* 524 (/ 1 4)))
    // border 4
    sPt = new Point(162, 0);
    ePt = new Point(162, 1000);
    ctx.fillStyle = borderColor;
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    // Accent
    sPt = new Point(162, -50);
    ePt = new Point(162, -80);
    ctx.fillStyle = this.__accentColor.toString();
    ctx.beginPath();
    ctx.moveTo(sPt.x, sPt.y);
    ctx.lineTo(ePt.x, ePt.y);
    ctx.lineTo(ePt.x + breadth, ePt.y);
    ctx.lineTo(sPt.x + breadth, sPt.y);
    ctx.closePath();
    ctx.fill();

    ctx.rotate(-1 * degree  * Math.PI / 180);
  }
  prepareCells(rowsCount, columnsCount, width, height, diff, fillBackRgb){
    this.__cells = [];
    const radius = 5;
    const cellSize = new Point(width, height);

    for(var i = 0 ; i < rowsCount; i++ ){
      this.__cells.push([]);

      for(var j = 0 ; j < columnsCount ; j++ ){
        const x = (cellSize.x + diff)*i + 2*diff;
        const y = (cellSize.y + diff)*j + 2*diff;
        // (new Diagnosis()).print("Pattern getCells (" + x + ", " + y +")");

        let startPoint = new Point(x, y);
        let endPoint = startPoint.add(cellSize);

        // Top-Left
        this.__ctx.beginPath();
        this.__ctx.fillStyle = fillBackRgb.toString();
        this.__ctx.moveTo(startPoint.x,
                          startPoint.y);
        this.__ctx.lineTo(startPoint.x,
                          startPoint.y + radius);
        this.__ctx.arc(startPoint.x + radius,
                       startPoint.y +radius,
                       radius, Math.PI, Math.PI*1.5, false);
        this.__ctx.closePath();
        this.__ctx.fill();

        // Bottom-Left
        this.__ctx.beginPath();
        this.__ctx.moveTo(startPoint.x,
                          startPoint.y + cellSize.y);
        this.__ctx.lineTo(startPoint.x,
                          startPoint.y + cellSize.y - radius);
        this.__ctx.arc(startPoint.x + radius,
                       startPoint.y + cellSize.y - radius,
                       radius, Math.PI, Math.PI*0.5, true);
        this.__ctx.closePath();
        this.__ctx.fill();

        // Bottom-Right
        this.__ctx.beginPath();
        this.__ctx.moveTo(startPoint.x + cellSize.x,
                          startPoint.y + cellSize.y);
        this.__ctx.lineTo(startPoint.x + cellSize.x,
                          startPoint.y + cellSize.y - radius);
        this.__ctx.arc(startPoint.x + cellSize.x - radius,
                       startPoint.y + cellSize.y - radius,
                       radius, 0, Math.PI*0.5, false);
        this.__ctx.closePath();
        this.__ctx.fill();

        // Top-Right
        this.__ctx.beginPath();
        this.__ctx.moveTo(startPoint.x + cellSize.x,
                          startPoint.y);
        this.__ctx.lineTo(startPoint.x + cellSize.x,
                          startPoint.y + radius);
        this.__ctx.arc(startPoint.x + cellSize.x - radius,
                       startPoint.y + radius,
                       radius, Math.PI*0, Math.PI*1.5, true);
        this.__ctx.closePath();
        this.__ctx.fill();

        this.__cells[i].push(
          { topLeft: startPoint,
            image: this.__ctx.getImageData(startPoint.x, startPoint.y,
                                           cellSize.x, cellSize.y),
          });
      }
    }
  }
  get cells() {
    return this.__cells;
  }
}


class NumberPatterns {
  constructor(ctx, topLeftPoint, num, bgColor) {
    this.__ctx          = ctx;
    this.__topLeftPoint = topLeftPoint;
    this.__num          = num;
    this.__backGroundColor = bgColor;
    this.__image        = null;

    this.__width  = 20;
    this.__height = 40;
  }
  get image() {
    if (this.__image) return this.__image;
    const n = ("00" + this.__num).slice(-2);
    const img0 = this.__get_image(n[0]);
    const img1 = this.__get_image(n[1]);

    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    ctx.fillStyle =  this.__backGroundColor.toString();  // '#000007';
    ctx.beginPath();
    ctx.rect(0, 0, this.__width*2, this.__height);
    ctx.fill();
    ctx.drawImage(img0, 0, 0);
    ctx.drawImage(img1, 20, 0);
    this.__image = ctx.getImageData(0, 0,
                                    this.__width*2, this.__height);
    return this.__image;
  }
  __get_image(numStr) {
    switch(numStr) {
      default:
      case "0":
        return (new SingletonImageResource()).num0;
      case "1":
        return (new SingletonImageResource()).num1;
      case "2":
        return (new SingletonImageResource()).num2;
      case "3":
        return (new SingletonImageResource()).num3;
      case "4":
        return (new SingletonImageResource()).num4;
      case "5":
        return (new SingletonImageResource()).num5;
      case "6":
        return (new SingletonImageResource()).num6;
      case "7":
        return (new SingletonImageResource()).num7;
      case "8":
        return (new SingletonImageResource()).num8;
      case "9":
        return (new SingletonImageResource()).num9;
    }
  }
  changeTopLeft(topLeftPoint) {
    this.__topLeftPoint = topLeftPoint;
  }
  clone(ctx=null, topLeftPoint=null) {
    const ret = new NumberPatterns(ctx??this.__ctx,
                                   topLeftPoint??this.__topLeftPoint,
                                   this.__num);
    return ret;
  }
  draw() {
    if (!this.image) return;
    this.__ctx.putImageData(this.image,
                            this.__topLeftPoint.x, this.__topLeftPoint.y);
  }
}
