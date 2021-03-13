class Design {
  constructor(){
    this._intervalId = -1;

    // 仮置
    this.__gameCells = null;
    // (+ (* (+ 50 2) 10) 2 2)
    this.__maxSize = 524;  // 611;
    this.__cellSize = 50;
    // (+ (* (+ 35 2) 10) 2 2)
    // this.__maxSize = 374;
    // this.__cellSize = 35;
    this.__columnsCount = 10;
    this.__rowsCount = 10;
    this.__border = 2;
    this.__gameState = GAME_STATE.None;
    this.__flagCount = 0;
    this.__mineCount = 10;
    this.__width = this.__maxSize;
    this.__height = this.__maxSize;
    // this.__width = 640;
    // this.__height = 480;
  }
  init() {
    // data initializing
    // this.initGame();
    this.ctx = this.initCanvas();
    this.initDrawings();
  }
  initCanvas(){
    const canvas = document.createElement('canvas');
    canvas.id = 'Design';
    canvas.width  = this.__width;  // this.__maxSize;
    canvas.height = this.__height;  // this.__maxSize;
    canvas.style.margin = "0 auto";
    // // canvas.style.align = 'center';
    // // canvas.style.verticalAlign = 'middle';
    // canvas.addEventListener('mousemove', this.getMouseMoveEventHandler());
    // canvas.addEventListener('mouseup', this.getMouseUpEventHandler());
    canvas.oncontextmenu = function() { return false; }

    // const div = document.createElement('div');
    // div.style.align = 'center';
    // div.style.verticalAlign = 'middle';
    // div.appendChild(canvas);
    document.body.style.padding = 0;
    document.body.style.mergin = 0;
    document.body.appendChild(canvas);
    // document.body.appendChild(div);
    return canvas.getContext('2d');
  }

  draw() {
    (new Rectangle(this.ctx,
                   new Point(1,1),
                   this.__width, this.__height,
                   new Rgb(0xff,0x00,0x00))).draw();

    this.elements.backGround.draw();
    for (var i = 0; i < this.__rowsCount; i++){
      for (var j = 0; j < this.__columnsCount; j++){
        var elm = this.elements.cells[i][j];
        elm.Covered.draw();
      }
    }
  }
  initDrawings() {
    (new Diagnosis()).print("Game initDrawings called");
    // background pattern
    const backGroundRgb = new Rgb(0x20, 0x20, 0x20);
    const highLightRgb = new Rgb(0xFF, 0xFF, 0xAA);
    const rate = 0.2; // 20%
    const openedRgb = new Rgb(0xAA, 0xAA, 0xAA);

    const baseRgb = new Rgb(0x00, 0x00, 0x07);
    const borderRgb = new Rgb(0xEE, 0xEE, 0xE7);
    const accentRgb = new Rgb(0x8C, 0x70, 0x24);

    const coveredBackGround = new ShishiroPattern(this.__maxSize,
                                                  baseRgb,
                                                  borderRgb,
                                                  accentRgb);

    coveredBackGround.initImage();
    coveredBackGround.prepareCells(this.__rowsCount,
                                   this.__columnsCount,
                                   this.__cellSize, this.__cellSize,
                                   this.__border, backGroundRgb);


    const selectedBackGround = new ShishiroPattern(this.__maxSize,
                                                   baseRgb.getAddBlend(highLightRgb, rate),
                                                   borderRgb.getAddBlend(highLightRgb, rate),
                                                   accentRgb.getAddBlend(highLightRgb, rate));

    selectedBackGround.initImage();
    selectedBackGround.prepareCells(this.__rowsCount,
                                    this.__columnsCount,
                                    this.__cellSize, this.__cellSize,
                                    this.__border, backGroundRgb);


    // Background
    this.elements = {};
    this.elements.backGround = new Rectangle(this.ctx,
                                             new Point(1,1),
                                             this.__maxSize, this.__maxSize,
                                             backGroundRgb);// '#202020');  // '#555555')
    // cell
    (new Diagnosis()).print(this.__columnsCount);
    (new Diagnosis()).print(this.__rowsCount);
    this.elements.cells = [];
    this.elements.precells = [];
    const cellSize = new Point(this.__cellSize, this.__cellSize);
    for(var i = 0 ; i < this.__columnsCount; i++ ){
      this.elements.cells.push([]);
      this.elements.precells.push([]);
      for(var j = 0 ; j < this.__rowsCount ; j++ ){
        // coveredでもselectedでも同じはず
        let startPoint = coveredBackGround.cells[i][j].topLeft
        let endPoint = startPoint.add(cellSize);

        let cell = {};
        cell.Covered  = new GameImage(this.ctx,
                                      coveredBackGround.cells[i][j].topLeft,
                                      coveredBackGround.cells[i][j].image);
        cell.Selected = new GameImage(this.ctx,
                                      selectedBackGround.cells[i][j].topLeft,
                                      selectedBackGround.cells[i][j].image);
        cell.Opened   = new Rectangle(this.ctx,
                                      startPoint,
                                      cellSize.x, cellSize.y,
                                      openedRgb,
                                      5, null, null);
        cell.FlagedCovered = new GameImage(this.ctx,
                                          coveredBackGround.cells[i][j].topLeft,
                                          coveredBackGround.cells[i][j].image,
                                          (new SingletonImageResource()).flag);
        cell.FlagedSelected = new GameImage(this.ctx,
                                            selectedBackGround.cells[i][j].topLeft,
                                            selectedBackGround.cells[i][j].image,
                                            (new SingletonImageResource()).flag);
        this.elements.cells[i].push(cell);
      }
    }
  }
}

window.onload = function() {
  const d = new Design();
  d.init();
  d.draw();
}
