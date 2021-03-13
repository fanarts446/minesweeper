class Game {
  // 借値
  static fps = 30;
  constructor() {
    (new Diagnosis()).print('Game constructor called');
    this._intervalId = -1;

    // 仮置
    this.__gameCells = null;

    this.__maxSize      = StaticConfiguration.boardMax;
    this.__canvasWidth  = StaticConfiguration.canvasWidth;
    this.__canvasHeight = StaticConfiguration.canvasHeight ;
    this.__cellSize     = StaticConfiguration.cellSize;
    this.__columnsCount = StaticConfiguration.columnsCount;
    this.__rowsCount    = StaticConfiguration.rowsCount;
    this.__border       = StaticConfiguration.border;
    this.__mineCount    = StaticConfiguration.mineCount;

    // 仮置
    this.__timeMin    = 99;
    this.__timeSec    = 99;
    this.__timeMilSec = 99;
    this.__timer = new Timer();

    // Cache
    this.__preSelectedCell = null;
    this.__currentSelectedCell = null;
  }
  init() {
    (new Diagnosis()).print("Game init called");
    this.__gameState = GAME_STATE.None;
    this.__flagCount = 0;
    this.__mineCount = StaticConfiguration.mineCount;
    // data initializing
    this.initGame();
    if (!this.canvas) {
      this.canvas = this.initCanvas();
      this.ctx = this.canvas.getContext('2d');
    }
    (function(obj) { obj.initResource();})(this);
    this.__timer.init();


    if (this.run) return;
    // run method for game loop
    this.run = (function(gm){
      return function() {
        (new Queue).lock();
        gm.update();
        gm.sound();
        gm.draw();
        (new Queue).clear();
        (new Queue).unlock();
      }
    })(this);

  }
  async initResource() {
    (new Diagnosis()).print("Game initResource called");
    (new SingletonImageResource()).init();
    const obj = this;
    let id = null;
    id = setInterval(function(){
      while((new Queue).hasEvent()) {
        var e = (new Queue).deque();
        switch(e.key){
          // System operation
          case 'sys_img_onload':
            (new Diagnosis()).print("sys_img_onload");
            let flg = e.value;
            obj.initDrawings();
            obj.__timer.init();
            obj.__upGameState(GAME_STATE.Initialized);
            break;
          default:
            break;
        }
      }
      if (obj.__isGameState(GAME_STATE.Initialized)) {
        clearInterval(id);
        return;
      }
    }, 10);
  }
  changeSelectState(pt) {
    const i = Math.floor((pt.x - this.__border*2) / (this.__cellSize + this.__border));
    const j = Math.floor((pt.y - this.__border*2) / (this.__cellSize + this.__border));
    if (i < 0
        || i >= this.__columnsCount
        || j < 0
        || j >= this.__rowsCount) return;
    const currentCell = this.elements.cells[i][j];
    const preCell = this.preCell;

    if (currentCell.isState(CELL_STATE.Covered)) {
      currentCell.upState(CELL_STATE.Selected);
    }

    if (preCell && preCell !== currentCell && preCell.isState(CELL_STATE.Covered)) {
      preCell.downState(CELL_STATE.Selected);
      preCell.upState(CELL_STATE.Covered);
    }
    this.preCell = currentCell;
  }
  changeOpenState(pt) {
    const i = Math.floor((pt.x - this.__border*2) / (this.__cellSize + this.__border));
    const j = Math.floor((pt.y - this.__border*2) / (this.__cellSize + this.__border));
    if (i < 0
        || i >= this.__columnsCount
        || j < 0
        || j >= this.__rowsCount) return;
    const currentCell = this.elements.cells[i][j];
    const preCell = this.preCell;

    var cell = this.elements.cells[i][j];

    if (! currentCell.isState(CELL_STATE.Covered)
        || currentCell.isState(CELL_STATE.Flaged)) return;

    currentCell.downState(CELL_STATE.Covered);
    currentCell.downState(CELL_STATE.Selected);
    this.__gameGroups[i][j].forEach(elm => {
      var cell2 = this.elements.cells[elm[0]][elm[1]]
        if (cell2.isState(CELL_STATE.Covered)
            && !cell2.isState(CELL_STATE.Flaged)) {
          cell2.downState(CELL_STATE.Covered);
        }
    });
  }
  changeFlagState(pt) {
    const i = Math.floor((pt.x - this.__border*2) / (this.__cellSize + this.__border));
    const j = Math.floor((pt.y - this.__border*2) / (this.__cellSize + this.__border));
    if (i < 0
        || i >= this.__columnsCount
        || j < 0
        || j >= this.__rowsCount) return;
    const currentCell = this.elements.cells[i][j];
    if (!currentCell.isState(CELL_STATE.Covered)) return;

    if (currentCell.isState(CELL_STATE.Flaged)) {
      currentCell.downState(CELL_STATE.Flaged);
      this.__flagCount--;
      return;
    }

    if (this.__flagCount >= this.__mineCount) return;
    currentCell.upState(CELL_STATE.Flaged);
    this.__flagCount++;

  }
  pushExitButton(){
    (new SingletonSoundResource()).opened.play();
    this.stop();
    this.endPage();
  }
  pushRetryButton(){
    (new SingletonSoundResource()).opened.play();
    this.init();
    this.initDrawings();
    this.__timer.init();
    this.__downGameState(GAME_STATE.Gameover);
    this.__upGameState(GAME_STATE.Initialized);
    this.elements.retryBtn.display = false;
    this.elements.configBtn.display = false;
    this.elements.repentBtn.display = false;
  }
  pushConfigButton(){
    (new SingletonSoundResource()).opened.play();
    this.stop();
    this.configPage();
  }
  update() {
    // QUEUING
    // (new Diagnosis()).print("Game update called");
    while((new Queue).hasEvent()) {
      var e = (new Queue).deque();
      // (new Diagnosis()).print(e);
      let pt = null;
      switch(e.key){
        // User operation
        case 'move':
          // (new Diagnosis()).print("move");
          if (this.__isGameState(GAME_STATE.Gameover)) return;
          pt = e.value;
          this.changeSelectState(pt);
          break;
        case 'open':
          (new Diagnosis()).print("up");
          pt = e.value;
          // exit
          if (this.elements.exitBtn.display && this.elements.exitBtn.isHit(pt)) {
            this.pushExitButton();
            continue;
          }
          // retry
          if (this.elements.retryBtn.display && this.elements.retryBtn.isHit(pt)) {   
            this.pushRetryButton();
            continue;
          }
          // config
          if (this.elements.configBtn.display && this.elements.configBtn.isHit(pt)) {
            this.pushConfigButton();
            continue;
          }
          // repent
          if (this.elements.repentBtn.display && this.elements.repentBtn.isHit(pt)) {
            window.open('https://www.youtube.com/channel/UCUKD-uaobj9jiqB-VXt71mA');
            this.pushExitButton();
            continue;
          }

          if (this.__isGameState(GAME_STATE.Gameover)) continue;

          // when cell opened, system open related cells.
          this.changeOpenState(pt);
          break;
        case 'flag':
          (new Diagnosis()).print("flag");
          if (this.__isGameState(GAME_STATE.Gameover)) return;
          pt = e.value;
          this.changeFlagState(pt);
          break;
        default:
          break;
      }
    }

    if (this.__isGameState(GAME_STATE.Gameover)) return;

    // Timer
    const time = this.__timer.lap();
    this.__timeMin    = time.minutes;
    this.__timeSec    = time.seconds;
    this.__timeMilSec = time.milliSeconds;


    // JUDGE
    // Fail check
    for(var i = 0 ; i < this.__columnsCount; i++ ){
      for(var j = 0 ; j < this.__rowsCount ; j++ ){
        var cell = this.elements.cells[i][j];
        if (cell.isState(CELL_STATE.Covered)) continue;
        if (!cell.isState(CELL_STATE.Mine)) continue;
        // Uncovered & Mine => Game over
        this.__upGameState(GAME_STATE.Gameover);
        break;
      }
    }
    // Success check
    if (!this.__isGameState(GAME_STATE.Gameover)) {
      if (this.__flagCount == this.__mineCount){
        // all flag is up on all mine-cell
        (new Diagnosis()).print("all flag is up on all mine-cell");
        let isSuccess = true;
        for(var i = 0 ; i < this.__columnsCount; i++ ){
          for(var j = 0 ; j < this.__rowsCount ; j++ ){
            var cell = this.elements.cells[i][j];
            if (cell.isState(CELL_STATE.Flaged)
                & !cell.isState(CELL_STATE.Mine)){
              isSuccess = false;
              break;
            }
          }
          if (!isSuccess) break;
        }
        if (isSuccess) {
          (new Diagnosis()).print("all-flag-mine");
          for(var i = 0 ; i < this.__columnsCount; i++ ){
            for(var j = 0 ; j < this.__rowsCount ; j++ ){
              var cell = this.elements.cells[i][j];
              if (cell.isState(CELL_STATE.Selected)) cell.State ^= CELL_STATE.Selected;
            }
          }
          this.__upGameState(GAME_STATE.Gameover);
          this.__upGameState(GAME_STATE.Success);
        }
      } else {
        // all cell open without mine-cell.
        let checkCount = 0;
        for(var i = 0 ; i < this.__columnsCount; i++ ){
          for(var j = 0 ; j < this.__rowsCount ; j++ ){
            var cell = this.elements.cells[i][j];
            checkCount += cell.isState(CELL_STATE.Covered) ? 1 : 0;
          }
        }
        if (checkCount == this.__mineCount) {
          (new Diagnosis()).print("all-cell-mine");
          this.__upGameState(GAME_STATE.Gameover);
          this.__upGameState(GAME_STATE.Success);
        }
      }
    }

    if (this.__isGameState(GAME_STATE.Gameover)) {
      this.elements.retryBtn.display = true;
      this.elements.configBtn.display = true;
      if (DynamicConfiguration.gameMode == 'ultra') {
        this.elements.repentBtn.display = true;
      }
    }
  }
  sound() {
    // T.B.D.
    for (var i = 0; i < this.__rowsCount; i++){
      for (var j = 0; j < this.__columnsCount; j++){
        var precellState = this.elements.precells[i][j];
        var cell         = this.elements.cells[i][j];

        if (!((precellState & CELL_STATE.Flaged) == CELL_STATE.Flaged)
            && cell.isState(CELL_STATE.Flaged)) {
          (new SingletonSoundResource()).flaged.play();

        } else if (((precellState & CELL_STATE.Flaged) == CELL_STATE.Flaged)
                   && !cell.isState(CELL_STATE.Flaged)) {
          (new SingletonSoundResource()).unflaged.play();

        } else if (!((precellState & CELL_STATE.Selected) == CELL_STATE.Selected)
                   && cell.isState(CELL_STATE.Selected)) {
          (new SingletonSoundResource()).selected.play();

        } else if (((precellState & CELL_STATE.Covered) == CELL_STATE.Covered)
                   && !cell.isState(CELL_STATE.Covered)) {
          (new SingletonSoundResource()).opened.play();
        }

        this.elements.precells[i][j]
          = this.elements.cells[i][j].state;
      }
    }

    if (this.__isGameState(GAME_STATE.Gameover)
        & !this.__isGameState(GAME_STATE.Suspend)) {
      if (this.__isGameState(GAME_STATE.Success)) {
        (new SingletonSoundResource()).success.play();
        this.__upGameState(GAME_STATE.Suspend);
      } else {
        // (new SingletonSoundResource()).fail.play();
        (new SingletonSoundResource()).bomb.play();
        this.__upGameState(GAME_STATE.Suspend);
      }
    }
  }
  draw() {
    // (new Diagnosis()).print(this.__isGameState(GAME_STATE.Initialized));
    if (!this.__isGameState(GAME_STATE.Initialized)) return;

    // Base Area
    this.elements.canvasBackGround.draw();

    // Game Area
    this.elements.backGround.draw();
    for (var i = 0; i < this.__rowsCount; i++){
      for (var j = 0; j < this.__columnsCount; j++){
        this.elements.cells[i][j].draw();
      }
    }

    // Controle Pane
    this.elements.controlePane.draw();

    // Time
    this.elements.times[0][this.__timeMin].draw();
    this.elements.times[1][this.__timeSec].draw();
    this.elements.times[2][this.__timeMilSec].draw();

    // Flag count
    this.elements.flags[this.__mineCount - this.__flagCount].draw();

    // if (this.elements.restartBtn.display) this.elements.restartBtn.draw();

    this.elements.exitBtn.draw();
    if (this.elements.retryBtn.display) this.elements.retryBtn.draw();
    if (this.elements.configBtn.display) this.elements.configBtn.draw();
    if (this.elements.repentBtn.display) this.elements.repentBtn.draw();
  }
  __isGameState(flg) {
    return (this.__gameState & flg) == flg;
  }
  __upGameState(flg) {
    this.__gameState |= flg;
  }
  __downGameState(flg) {
    if (!this.__isGameState(flg)) return;
    this.__gameState ^= flg;
  }
  __loop(cb) {
    for(var i = 0 ; i < this.__columnsCount; i++ ){
      for(var j = 0 ; j < this.__rowsCount ; j++ ){
        cb();
      }
    }
  }
  initGame() {
    const mines = this.__initMines();
    const hints = this.__initHints(mines);
    const groups = this.__initGroups(hints);

    (new Diagnosis()).print(this.__gameGroups);
    (new Diagnosis()).print(mines);
    this.__gameCells = hints;
    this.__gameGroups = groups;


  }
  __initMines() {
    const max = this.__columnsCount * this.__rowsCount;
    // const mines = [ 1, 5, 6, 10, 25, 77, 78, 79, 87, 89, 97, 98, 99];
    let mines = [];
    const getCount = function(arr){
      let cnt = 0;
      for(var i = 0 ; i < max; i++ ){
        if (arr[i]) cnt++;
      }
      return cnt;
    };
    const memo = [];
    for(var i = 0 ; i < max; i++ ){
      memo.push(false);
    }
    while(getCount(memo) < this.__mineCount) {
      var idx = Math.floor(Math.random() * max);
      if (memo[idx]) continue;
      mines.push(idx);
      memo[idx] = true;
    }
    mines = mines.sort((a, b) => a-b);
    return mines;
  }
  __initHints(mines) {
    const hints = [];
    for(var i = 0 ; i < this.__columnsCount; i++ ){
      hints.push([])
      for(var j = 0 ; j < this.__rowsCount ; j++ ){
        hints[i].push(0);
      }
    }

    let topx = -1, topy = -1;
    const colNum  = this.__columnsCount,
          rowNum  = this.__rowsCount,
          cellNum = colNum * rowNum;

    mines.forEach(idx => {
      (new Diagnosis()).print("----------------");
      let x = idx % colNum, y = Math.floor(idx / rowNum);
      (new Diagnosis()).print(idx + ": (" + x + ", " + y + ")");

      // top
      topx = x, topy = y - 1;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("t (" + topx + ", " + topy + ")");
      }

      // top-left
      topx = x - 1, topy = y - 1;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("tl(" + topx + ", " + topy + ")");
      }

      // top-right
      topx = x + 1, topy = y - 1;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("tr(" + topx + ", " + topy + ")");
      }

      // left
      topx = x - 1, topy = y;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("l (" + topx + ", " + topy + ")");
      }

      // right
      topx = x + 1, topy = y;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("r (" + topx + ", " + topy + ")");
      }

      // bottom
      topx = x, topy = y + 1;
      if (this.__isInRegion(topx, topy)) {
        hints[topx][topy]++;
        (new Diagnosis()).print("b (" + topx + ", " + topy + ")");
      }

      // bottom-left
      topx = x - 1, topy = y + 1;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("bl(" + topx + ", " + topy + ")");
      }

      // bottom-right
      topx = x + 1, topy = y + 1;
      if (this.__isInRegion(topx, topy)){
        hints[topx][topy]++;
        (new Diagnosis()).print("br(" + topx + ", " + topy + ")");
      }
    });

    mines.forEach(idx => {
      let x = idx % colNum, y = Math.floor(idx / rowNum);
      hints[x][y] = -1;
    });
    return hints;
  }
  __initGroups(hints) {
    let memo = [];
    const initMemo = (function(obj) {
      return function(){
        memo = [];
        for (var i = 0; i < obj.__rowsCount ; i++) {
          memo.push([]);
          for (var j = 0; j < obj.__columnsCount ; j++) {
            memo[i].push(false);
          }
        }
      }
    })(this);
    const dfs = (function(obj){
      return function(i, j, arr){
        if (!obj.__isInRegion(i,j)) return [];
        if (arr[i][j] < 0) return [];
        if (memo[i][j]) return [];
        memo[i][j] = true;

        var ret = [[i,j]];

        if (arr[i][j] > 0) return ret;

        dfs(i, j-1, arr).forEach(elm => ret.push(elm));
        dfs(i, j+1, arr).forEach(elm => ret.push(elm));
        dfs(i-1, j, arr).forEach(elm => ret.push(elm));
        dfs(i+1, j, arr).forEach(elm => ret.push(elm));
        return ret.filter(elm => elm.length > 0);
      }
    })(this);

    const groups = [];
    for (var i = 0; i < this.__rowsCount ; i++) {
      groups.push([]);
      for (var j = 0; j < this.__columnsCount ; j++) {
        initMemo();
        let gs = dfs(i, j, hints);
        gs = gs.filter(elm => elm.length == 2);
        if(i == 0 && j == 3) {
          (new Diagnosis()).print("gs");
          (new Diagnosis()).print(gs);
        }
        groups[i].push(gs);
      }
    }
    return groups;
  }
  __isInRegion = (i, j) => {
    // (new Diagnosis()).print("isInRegion called");
    let flg = true;
    flg &= (i >= 0);
    flg &= (i < this.__columnsCount);
    flg &= (j >= 0);
    flg &= (j < this.__rowsCount);
    // (new Diagnosis()).print("isInRegion: " + flg);
    return flg;
  };
  // 仮置
  initCanvas() {
    (new Diagnosis()).print("Game initCanvas called");
    const canvas = document.createElement('canvas');
    canvas.id = 'MineSweeper';
    canvas.width  = this.__canvasWidth;  // this.__maxSize;
    canvas.height = this.__canvasHeight; // this.__maxSize;
    canvas.style.margin = "0 auto";
    canvas.style.letterSpacing = '2px';

    canvas.addEventListener('mousemove', this.getMouseMoveEventHandler());
    canvas.addEventListener('mouseup', this.getMouseUpEventHandler());
    canvas.oncontextmenu = function() { return false; }

    return canvas;
  }
  getMouseMoveEventHandler() {
    return function(event) {
      // (new Diagnosis()).print("getMouseMoveEventHandler");
      const testPt = new Point(event.offsetX, event.offsetY);
      (new Queue).enque({key: 'move', value: testPt});
    };
  }
  getMouseUpEventHandler() {
    return function(event) {
      (new Diagnosis()).print("getMouseUpEventHandler");
      (new Diagnosis()).print((new Queue).__lock);
      const testPt = new Point(event.offsetX, event.offsetY);

      // 0: Left click
      // 1: Middle click(Wheel)
      // 2: Right click
      switch(event.button) {
        case  0:
          (new Queue).enque({key: 'open', value: testPt});
          break;
        case 2:
          (new Queue).enque({key: 'flag', value: testPt});
          break;
        default:
          break;
      }
    };
  }
  // 仮置
  initDrawings() {
    (new Diagnosis()).print("Game initDrawings called");
    // background pattern
    const baseBackGroundRgb = new Rgb(0x50, 0x50, 0x50);
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
    // canvas
    this.elements.canvasBackGround
      = new Rectangle(this.ctx, new Point(1, 1),
                      this.__canvasWidth, this.__canvasHeight,
                      baseBackGroundRgb);

    // Game area
    this.elements.backGround = new Rectangle(this.ctx,
                                             new Point(1,1),
                                             this.__maxSize, this.__maxSize,
                                             backGroundRgb);
    this.elements.backGround.changed = true;
    // Game area (cell)
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
        let startPoint = coveredBackGround.cells[i][j].topLeft;
        let endPoint = startPoint.add(cellSize);

        let cell = new GameCell(this.ctx,
                                cellSize,
                                i, j,
                                coveredBackGround,
                                selectedBackGround,
                                this.__gameCells);
        this.elements.cells[i].push(cell);
        this.elements.precells[i].push(cell.state);
      }
    }

    // Controle Panel
    const white = new Rgb(0xFF, 0xFF, 0xFF);
    const red = new Rgb(0xFF, 0x00, 0x00);
    this.elements.controlePane = new GraphicsCollection();
    const controlePaneWidth
      = this.__canvasWidth - this.__maxSize - (4 * this.__border);
    const controlePaneHeight
      = this.__maxSize - 2 * this.__border;  // this.__canvasHeight - (4 * this.__border);
    const controlePaneTopLeft = new Point(
      this.__maxSize + 2 * this.__border,
      2 * this.__border
      );
    const controlePane = new Rectangle(this.ctx,
                                       controlePaneTopLeft,
                                       controlePaneWidth, controlePaneHeight,
                                       backGroundRgb);

    // Clock
    const missionClockTopLeft
      = controlePaneTopLeft.add(new Point(this.__border,
                                          this.__border));
    const masterNumbers = [];
    masterNumbers.push([]);  // 1st digits
    masterNumbers.push([]);  // 2nd digits
    masterNumbers.push([]);  // 3rd digits
    let stp = 20;
    const firstTopLeft       = missionClockTopLeft.add(new Point(stp,   30));
    stp += 40;
    const firstColonTopLeft  = missionClockTopLeft.add(new Point(stp,  30));
    stp += 20;
    const secondTopLeft      = missionClockTopLeft.add(new Point(stp,  30));
    stp += 40;
    const secondColonTopLeft = missionClockTopLeft.add(new Point(stp, 30));
    stp += 20;
    const thirdTopLeft       = missionClockTopLeft.add(new Point(stp, 30));
    for (var i=0; i<100; i++) {
      var one   = new NumberPatterns(this.ctx, firstTopLeft,  i, baseRgb);
      var two   = new NumberPatterns(this.ctx, secondTopLeft, i, baseRgb);
      var three = new NumberPatterns(this.ctx, thirdTopLeft,  i, baseRgb);
      masterNumbers[0].push(one);
      masterNumbers[1].push(two);
      masterNumbers[2].push(three);
    }
    this.elements.times = masterNumbers;
    // colon
    const firstColon = new Rectangle(this.ctx,
                                     firstColonTopLeft,
                                     20, 40, baseRgb,
                                     0, null, null,
                                     (new SingletonImageResource()).colon);
    const secondColon = new Rectangle(this.ctx,
                                      secondColonTopLeft,
                                      20, 40, baseRgb,
                                      0, null, null,
                                      (new SingletonImageResource()).piriod);
    const missionClock = new Rectangle(this.ctx,
                                       missionClockTopLeft,
                                       controlePaneWidth - 2 * this.__border,
                                       100,
                                       baseRgb);

    // Info
    const infoTopLeft
      = missionClockTopLeft.add(new Point(0,
                                          100+2*this.__border));
    const mineInfoTopLeft = infoTopLeft.add(
        new Point(10, 15)
      );
    const mineColonInfoTopLeft = mineInfoTopLeft.add(
        new Point(this.__cellSize, 5)
      );
    const mineCountInfoTopLeft = mineColonInfoTopLeft.add(
        new Point(20, 0)
      );

    const flagInfoTopLeft = infoTopLeft.add(
        new Point(10, 15*2+this.__cellSize)
      );
    const flagColonInfoTopLeft = flagInfoTopLeft.add(
        new Point(this.__cellSize, 5)
      );
    const flagCountInfoTopLeft = flagColonInfoTopLeft.add(
        new Point(20, 0)
      );

    const info = new Rectangle(this.ctx,
                               infoTopLeft,
                               controlePaneWidth - 2 * this.__border,
                               this.__maxSize - infoTopLeft.y - this.__border,
                               baseRgb);
    const mineInfo = new Rectangle(this.ctx,
                                   mineInfoTopLeft,
                                   this.__cellSize, this.__cellSize,
                                   baseRgb,
                                   // white,
                                   0, null, null,
                                   (new SingletonImageResource()).mine);
    const mineColonInfo = new Rectangle(this.ctx,
                                        mineColonInfoTopLeft,
                                        20, 40,
                                        baseRgb,
                                        // red,
                                        0, null, null,
                                        (new SingletonImageResource()).colon);
    const mineCountInfo = new NumberPatterns(this.ctx,
                                             mineCountInfoTopLeft,
                                             this.__mineCount,
                                             baseRgb
                                             // red
                                             );

    const flagInfo = new Rectangle(this.ctx,
                                   flagInfoTopLeft,
                                   this.__cellSize, this.__cellSize,
                                   baseRgb,
                                   // white,
                                   0, null, null,
                                   (new SingletonImageResource()).flag);
    const flagColonInfo = new Rectangle(this.ctx,
                                        flagColonInfoTopLeft,
                                        20, 40,
                                        baseRgb,
                                        // red,
                                        0, null, null,
                                        (new SingletonImageResource()).colon);
    const flagCount = [];
    for (var i=0; i<100; i++) {
      flagCount.push(new NumberPatterns(this.ctx, flagCountInfoTopLeft,  i, baseRgb))
    }
    this.elements.flags = flagCount;


    // Add
    this.elements.controlePane.add(controlePane);

    this.elements.controlePane.add(missionClock);
    this.elements.controlePane.add(firstColon);
    this.elements.controlePane.add(secondColon);

    this.elements.controlePane.add(info);
    this.elements.controlePane.add(mineInfo);
    this.elements.controlePane.add(mineColonInfo);
    this.elements.controlePane.add(mineCountInfo);

    this.elements.controlePane.add(flagInfo);
    this.elements.controlePane.add(flagColonInfo);

    // Button
    const fontSize = 20;
    const btnWidth = controlePaneWidth - 60;
    const btnHeight = 50;

    // exit button
    const exitBtnTopLeft = flagInfoTopLeft.add(
        new Point(20, 15*2+this.__cellSize)
      );
    const exitBtn = new Rectangle(this.ctx,
                                  exitBtnTopLeft,
                                  btnWidth,
                                  btnHeight,
                                  backGroundRgb);
    const exitLabel = new GraphicsText(this.ctx,
                                       exitBtnTopLeft,
                                       btnWidth,
                                       btnHeight,
                                       fontSize,
                                       "bold " + fontSize + "px DotGothic16",
                                       '終了',
                                       new Rgb(0xF8, 0xF8, 0xFF));
    const exitStartPoint = exitBtnTopLeft;
    const exitEndPoint = exitStartPoint.add(new Point(btnWidth, btnHeight));

    let exitBtnObj = {};
    exitBtnObj.display = true;
    exitBtnObj.isHit = (point) => {
      let flg = true;
      flg &= (point.x >= exitStartPoint.x);
      flg &= (point.x <= exitEndPoint.x);
      flg &= (point.y >= exitStartPoint.y);
      flg &= (point.y <= exitEndPoint.y);
      return flg;
    };
    exitBtnObj.draw = () => {
      exitBtn.draw();
      exitLabel.draw();
    };
    this.elements.exitBtn = exitBtnObj;

    // restart button
    const retryBtnTopLeft = exitBtnTopLeft.add(
        new Point(0, 15+this.__cellSize)
      );
    const retryBtn = new Rectangle(this.ctx,
                                   retryBtnTopLeft,
                                   btnWidth,
                                   btnHeight,
                                   backGroundRgb);
    const retryLabel = new GraphicsText(this.ctx,
                                        retryBtnTopLeft,
                                        btnWidth,
                                        btnHeight,
                                       fontSize,
                                       "bold " + fontSize + "px DotGothic16",
                                        '再挑戦',
                                        new Rgb(0xF8, 0xF8, 0xFF));
    const retryStartPoint = retryBtnTopLeft;
    const retryEndPoint = retryStartPoint.add(new Point(btnWidth, btnHeight));

    let retryBtnObj = {};
    retryBtnObj.display = false;
    retryBtnObj.isHit = (point) => {
          let flg = true;
          flg &= (point.x >= retryStartPoint.x);
          flg &= (point.x <= retryEndPoint.x);
          flg &= (point.y >= retryStartPoint.y);
          flg &= (point.y <= retryEndPoint.y);
          return flg;
    };
    retryBtnObj.draw = () => {
      retryBtn.draw();
      retryLabel.draw();
    };
    this.elements.retryBtn = retryBtnObj;

    // config button
    const configBtnTopLeft = retryBtnTopLeft.add(
        new Point(0, 15+this.__cellSize)
      );
    const configBtn = new Rectangle(this.ctx,
                                    configBtnTopLeft,
                                    btnWidth,
                                    btnHeight,
                                    backGroundRgb);
    const configLabel = new GraphicsText(this.ctx,
                                         configBtnTopLeft,
                                         btnWidth,
                                         btnHeight,
                                         fontSize,
                                         "bold " + fontSize + "px DotGothic16",
                                         '設定',
                                         new Rgb(0xF8, 0xF8, 0xFF));
    const configStartPoint = configBtnTopLeft;
    const configEndPoint = configStartPoint.add(new Point(btnWidth, btnHeight));

    let configBtnObj = {};
    configBtnObj.display = false;
    configBtnObj.isHit = (point) => {
          let flg = true;
          flg &= (point.x >= configStartPoint.x);
          flg &= (point.x <= configEndPoint.x);
          flg &= (point.y >= configStartPoint.y);
          flg &= (point.y <= configEndPoint.y);
          return flg;
    };
    configBtnObj.draw = () => {
      configBtn.draw();
      configLabel.draw();
    };
    this.elements.configBtn = configBtnObj;

    // repent button
    const repentBtnTopLeft = configBtnTopLeft.add(
        new Point(0, 15+this.__cellSize)
      );
    const repentBtn = new Rectangle(this.ctx,
                                    repentBtnTopLeft,
                                    btnWidth,
                                    btnHeight,
                                    backGroundRgb);
    const repentLabel = new GraphicsText(this.ctx,
                                         repentBtnTopLeft,
                                         btnWidth,
                                         btnHeight,
                                         fontSize,
                                         "bold " + fontSize + "px DotGothic16",
                                         '悔い改める',
                                         new Rgb(0xF8, 0xF8, 0xFF));
    const repentStartPoint = repentBtnTopLeft;
    const repentEndPoint = repentStartPoint.add(new Point(btnWidth, btnHeight));

    let repentBtnObj = {};
    repentBtnObj.display = false;
    repentBtnObj.isHit = (point) => {
          let flg = true;
          flg &= (point.x >= repentStartPoint.x);
          flg &= (point.x <= repentEndPoint.x);
          flg &= (point.y >= repentStartPoint.y);
          flg &= (point.y <= repentEndPoint.y);
          return flg;
    };
    repentBtnObj.draw = () => {
      repentBtn.draw();
      repentLabel.draw();
    };
    this.elements.repentBtn = repentBtnObj;
  }
  initBlank(i, j){
    switch(this.__gameCells[i][j]){
      case 1:
        return (new SingletonImageResource()).hintOne;
      case 2:
        return (new SingletonImageResource()).hintTwo;
      case 3:
        return (new SingletonImageResource()).hintThree;
      case 4:
        return (new SingletonImageResource()).hintFour;
      case 5:
        return (new SingletonImageResource()).hintFive;
      case 6:
        return (new SingletonImageResource()).hintSix;
      case 7:
        return (new SingletonImageResource()).hintSeven;
      case 8:
        return (new SingletonImageResource()).hintEight;
      case -1:
        return (new SingletonImageResource()).mine;
    }
  }
  initState(i, j) {
    switch(this.__gameCells[i][j]){
      case -1:
        return CELL_STATE.Covered | CELL_STATE.Mine;
      default:
        return CELL_STATE.Covered;
    }
  }
}



class GameCell {
  constructor(ctx, cellSize, row, col, coveredPattern, selectedPattern, gameCells) {
    this._ctx = ctx;
    this._coveredPattern  = coveredPattern;
    this._selectedPattern = selectedPattern;
    this._cellSize = cellSize;
    this._row = row;
    this._col = col;
    this._gameCells = gameCells;
    this._init();
  }
  _init() {
    this._startPoint = this._coveredPattern.cells[this._row][this._col].topLeft;
    this._endPoint   = this._startPoint.add(this._cellSize);
    this._openedRgb  = new Rgb(0xAA, 0xAA, 0xAA);

    this._state = this._initState(this._row, this._col);

    // 仮置(cache用)
    this._change = true;
    this._initDrawing();
  }
  get state() {
    if (this._state === undefined) throw Error("this._state is undefined");
    return this._state;
  }
  isState(flg) {
    return (this._state & flg) == flg;
  }
  upState(flg) {
    if (this.isState(flg)) return;
    this._state |= flg;
    this._changed = true;
  }
  downState(flg) {
    if (!this.isState(flg)) return;
    this._state ^= flg;
    this._changed = true;
  }
  isHit(point) {
    let flg = true;
    flg &= (point.x >= this._startPoint.x);
    flg &= (point.x <= this._endPoint.x);
    flg &= (point.y >= this._startPoint.y);
    flg &= (point.y <= this._endPoint.y);
    return flg;
  }
  draw() {
    if (this.isState(CELL_STATE.Selected)) {
      if (this.isState(CELL_STATE.Flaged)) {
        this._FlagedSelected.draw();
        this._changed = false;
      } else {
        this._Selected.draw();
        this._changed = false;
      }
    } else if (!this.isState(CELL_STATE.Covered)){
      this._Opened.draw();
      this._changed = false;
    } else {
      if (this.isState(CELL_STATE.Flaged)) {
        this._FlagedCovered.draw();
        this._changed = false;
      } else {
        this._Covered.draw();
        this._changed = false;
      }
    }
  }
  _initDrawing() {
    this._Covered  = new GameImage(this._ctx,
                                   this._coveredPattern.cells[this._row][this._col].topLeft,
                                   this._coveredPattern.cells[this._row][this._col].image);
    this._Selected = new GameImage(this._ctx,
                                   this._selectedPattern.cells[this._row][this._col].topLeft,
                                   this._selectedPattern.cells[this._row][this._col].image);
    this._Opened   = new Rectangle(this._ctx,
                                   this._startPoint,
                                   this._cellSize.x, this._cellSize.y,
                                   this._openedRgb,
                                   5, null, null,
                                   this._initBlank(this._row, this._col));
    this._FlagedCovered = new GameImage(this._ctx,
                                        this._coveredPattern.cells[this._row][this._col].topLeft,
                                        this._coveredPattern.cells[this._row][this._col].image,
                                        (new SingletonImageResource()).flag);
    this._FlagedSelected = new GameImage(this._ctx,
                                         this._selectedPattern.cells[this._row][this._col].topLeft,
                                         this._selectedPattern.cells[this._row][this._col].image,
                                         (new SingletonImageResource()).flag);
  }
  _initBlank(i, j){
    switch(this._gameCells[i][j]){
      case 1:
        return (new SingletonImageResource()).hintOne;
      case 2:
        return (new SingletonImageResource()).hintTwo;
      case 3:
        return (new SingletonImageResource()).hintThree;
      case 4:
        return (new SingletonImageResource()).hintFour;
      case 5:
        return (new SingletonImageResource()).hintFive;
      case 6:
        return (new SingletonImageResource()).hintSix;
      case 7:
        return (new SingletonImageResource()).hintSeven;
      case 8:
        return (new SingletonImageResource()).hintEight;
      case -1:
        return (new SingletonImageResource()).mine;
    }
  }
  _initState(i, j) {
    switch(this._gameCells[i][j]){
      case -1:
        return CELL_STATE.Covered | CELL_STATE.Mine;
      default:
        return CELL_STATE.Covered;
    }
  }
}

