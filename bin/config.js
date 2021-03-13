class StaticConfiguration {
  static __columnsCount=10;
  static __rowsCount=10;
  static __cellsCount = this.columnsCount * this.rowsCount;

  // px
  static __gameViewMax  = 524
  static __canvasWidth  = 736;
  static __canvasHeight = 530;  // 552;
  static __cellSize     = 50;
  static __border       = 2;

  static get columnsCount() {
    return this.__columnsCount;
  }
  static get rowsCount() {
    return this.__rowsCount;
  }
  static get cellsCount() {
    return this.__cellsCount;
  }

  static get boardMax() {
    //(+ (* (+ 50 2) 10) 2 2)
    return ((this.__cellSize + this.__border)
             * this.__columnsCount)
            + this.__border + 2;
  }
  static get canvasWidth() {
    return this.__canvasWidth;
  }
  static get canvasHeight() {
    return this.__canvasHeight;
  }
  static get cellSize() {
    return this.__cellSize;
  }
  static get border() {
    return this.__border;
  }
  static get mineCount() {
    switch(DynamicConfiguration.gameMode.toLowerCase()){
      case 'easy':
        return 5;
      default:
      case 'normal':
        return 10;
      case 'hard':
        return 20;
      case 'ultra':
        return 99;
    }
  }
}

class DynamicConfiguration {
  static __gameMode=''; // easy, normal, hard

  static get gameMode() {
    return this.__gameMode;
  }
  static set gameMode(val) {
    if (!val) this.__gameMode = 'normal';
    switch(val.toString().toLowerCase()){
      case 'easy':
        this.__gameMode = 'easy';
        break;
      default:
      case 'normal':
        this.__gameMode = 'normal';
        break;
      case 'hard':
        this.__gameMode = 'hard';
        break;
      case 'ultra':
        this.__gameMode = 'ultra';
        break;
    }

  }
  
}
