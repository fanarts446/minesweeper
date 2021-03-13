class Message {
  messages = {
    prepare : [
      { JP: "作戦目標を確認する。", EN: "Check the objective of our mission."},
      { JP: "作戦目標は、領域内の全地雷の撤去。", EN: "Mission objective is you remove all mines into this field."},
      { JP: "準備完了まで待機せよ。", EN: "Wait for done prepare."},
      ],
    donePrepare: [
      { JP: "準備完了を通達。", EN: "We announce ready to the mission."},
      { JP: "作戦クロック作動。", EN: "Mission clock start."},
      { JP: "作戦開始。", EN: "Mission started."},
      { JP: "ご武運を。", EN: "Good luck."},
      ],
    help: [
      { JP: "これがマニュアルだ。理解して覚えろ。", EN: "This is the manual. You understand and memorize it."},
      { JP: "戦場に二度目はない。", EN: "No second chances on the battlefield."},
      ],
    cheer: [
      { JP: "いいぞ。", EN: "Good."},
      { JP: "慎重に", EN: "Carefully."},
      ],
    fail: [
      { JP: "作戦失敗。", EN: "Mission fail."},
      { JP: "おめでとう。お前はシシローランドへ行く義務を手に入れたわけだ。", EN: "Oops! Congratulations! You have earned the obligation, which go to the Shishirow-Land."},
      ],
    success: [
      { JP: "作戦完了。", EN: "Mission complete."},
      { JP: "お前の帰還を歓迎する。", EN: "Welcome back, soldier."},
      ],
  };
  FLG_JP = "JP";
  FLG_EN = "EN";

  constructor() {
    this.flgState = this.FLG_JP;
    this.msgCnt = this.normalizeMsgCnt();
    this.nowPhase = phaseConstants.prepare;
  }
  setI8n(flg) {
    if (flg != this.FLG_JP && flg != this.FLG_EN) throw Error();
    this.flgState = flg;
  }
  changePhase(phase) {
    this.nowPhase = phase;
  }
  normalizeMsgCnt(no, phase) {
    if (!phase && !no) {
      this.msgCnt = 0;
      return;
    }
    if (phase == this.nowPhase) {
      this.msgCnt = no && no >= 0 && no <= this.phaseCnt[phase] ? no : 0;
      return;
    }
    this.msgCnt = 0;
    return;
  }
  getMessage(){
    return this.messages[this.nowPhase][this.msgCnt][this.flgState];
  }
  rollBackState(phase, no, flg) {
    this.nowPhase = phase ? phase : this.nowPhase;
    this.msgCnt = getMsgCnt(no, this.nowPhase);
    this.flgState = flg ? phase : this.nowPhase;
  }
}

const phaseConstants = {
  prepare: "prepare",
  donePrepare: "donePrepare",
  help: "help",
  fail: "fail",
  success: "success",
}

/*
  作戦目標を確認する。
  Check the objective of our mission.
  作戦目標は、領域内の全地雷の撤去。
  Mission objective is you remove all mines into this field.
  準備完了まで待機せよ。
  Wait for done prepare.
  準備完了を通達。
  We announce ready to the mission.
  作戦クロック作動。作戦開始。ご武運を。
  Mission clock start. Mission started. God luck.

  これがマニュアルだ。理解して覚えろ。
  This is the manual. You understand and memorize it.
  戦場に二度目はない。
  No second chances on the battlefield.

  いいぞ
  Good.
  きろつけろ
  Carefully.

  作戦失敗。
  Mission fail.
  おめでとう。お前はシシローランドへ行く義務を手に入れたわけだ。
  Oops! Congratulations! You have earned the obligation, which go to the Shishirow-Land.

  作戦完了。
  Mission complete.
  帰還を歓迎する。
  Welcome back, soldier. 

  
*/
