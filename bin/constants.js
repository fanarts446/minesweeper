const CELL_STATE = {
  Uncovered: 0b0000_0000,
  Covered:   0b0000_0001,
  NonFlaged: 0b0000_0000,
  Flaged:    0b0000_0010,
  NonMine:   0b0001_0000,
  Mine:      0b0000_0100,
  Blank:     0b0000_1000,
  // 上位3ビットを数字に使う
  Hint:      0b0001_0000,
  Selected:  0b1000_0000,
}

const GAME_STATE = {
  None:        0b0000_0000,
  Initialized: 0b0000_0001,
  Gameover:    0b0000_0010,
  Success:     0b0000_0100,
  Fail:        0b0000_1000,
  Suspend:     0b0001_0000,
}

const GAME_MODE = {
  None:   0b0000_0000,
  Easy:   0b0000_0001,
  Normal: 0b0000_0010,
  Hard:   0b0000_0100,
  Ultra:  0b0000_1000,
}

