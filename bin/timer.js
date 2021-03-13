class Time {
  constructor(minutes, seconds, milliseconds) {
    this.__minutes      = minutes;
    this.__seconds      = seconds;
    this.__milliSeconds = milliseconds;
  }
  get minutes() {
    return this.__minutes >= 0 ? this.__minutes : 99;
  }
  get seconds() {
    return this.__seconds >= 0 ? this.__seconds : 99;
  }
  get milliSeconds() {
    return this.__milliSeconds >= 0 ? this.__milliSeconds : 99;
  }
}

class Timer {
  constructor() {
    this.__startTime = (new Date).getTime();
    this.__cache = null;
  }
  init() {
    this.__startTime = (new Date).getTime();
  }
  lap() {
    // (+ (* (+ (* 99 60) 99) 1000) 999)
    const diff = (new Date).getTime() - this.__startTime;
    if (diff >= 6039999) return this.__cache;
    const milsec = diff % 1000;
    const worksec = Math.floor(diff/1000)
    const sec = worksec % 60;
    const min = Math.floor(worksec/60);
    var tm = new Time(min, sec, Math.floor(milsec/10));
    this.__cache = tm;
    // return new Time(min, sec, Math.floor(milsec/10));
    return tm;
  }
}