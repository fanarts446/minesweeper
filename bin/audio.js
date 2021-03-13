/*
*/
const SoundResource = function() {
  this.nameMap = [
    // { name: 'selected' , src: 'selected.mp3'},
    { name: 'selected',  src: 'selected.mp3'},
    { name: 'opened',    src: 'opened.mp3'},
    { name: 'flaged',    src: 'flaged.mp3'},
    { name: 'unflaged',  src: 'unflaged.mp3'},
    { name: 'success',   src: 'success.mp3'},
//     { name: 'fail',      src: 'fail.mp3'},
    { name: 'bomb',      src: 'bomb.mp3'},
//     { name: 'unflaged',  src: 'unflaged.mp3'},
//     { name: 'dummy',     src: 'se1.mp3'},
  ];
  this.init();
}
class CustomAudio{
  // https://www.html5rocks.com/ja/tutorials/webaudio/intro/
  constructor(src){
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.src = src;
    this.isLoaded = false;
    this.buffer = null;
    this.vol = 0.05;  // 1.0;
  }
  init() {
    const request = new XMLHttpRequest();
    request.open('GET', this.src, true);
    request.responseType = 'arraybuffer';
    request.onload = (function(obj){
      return function(){
        obj.ctx.decodeAudioData(request.response, function(buffer) {
          (new Diagnosis()).print("sound onload: " + obj.src);
          obj.buffer = buffer;

          obj.isLoaded = true;
        });
      }
    })(this);
    request.send();
  }
  volume(vol) {
    this.vol = vol;
  }
  play(){
    if (!this.isLoaded) return;

    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    source.buffer = this.buffer;

    // Connect the gain node to the destination.
    gainNode.connect(this.ctx.destination);
    // Connect the source to the gain node.
    source.connect(gainNode);
    // Reduce the volume.
    gainNode.gain.value = this.vol;

    source.start(0);

//     // サウンドごとに作り直さないと動かない
//     const source = this.ctx.createBufferSource();
//     source.buffer = this.buffer;
// 
//     // Create a gain node.
//     const gainNode = this.ctx.createGain();
//     // Connect the source to the gain node.
//     source.connect(gainNode);
//     // Connect the gain node to the destination.
//     gainNode.connect(this.ctx.destination);
//     // Reduce the volume.
//     gainNode.gain.value = 0.01;
//     source.start(0);
  }
}

SoundResource.prototype.init = function(){
  this.nameMap.forEach(data => {
    if (data.src != 'dummy') {
      this[data.name] = new CustomAudio('./resources/' + data.src);
    } else {
      this[data.name] = new CustomAudio('./resources/' + data.src);
    }
    this[data.name].init();
  });
}
SoundResource.prototype.volume = function(val){
  this.nameMap.forEach(data => {
    if (this[data.name]) {
      this[data.name].volume(val);
    }
  });
}
const SingletonSoundResource = (function(){
  var instance;
  return function(){
    if ( !instance ) {
      instance = new SoundResource();
    }
    return instance;
  };
})();

