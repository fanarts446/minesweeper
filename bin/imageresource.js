const ImageResource = function() {
  this.nameMap = [
    { name: 'hintOne'   , src: '1.png'},
    { name: 'hintTwo'   , src: '2.png'},
    { name: 'hintThree' , src: '3.png'},
    { name: 'hintFour'  , src: '4.png'},
    { name: 'hintFive'  , src: '5.png'},
    { name: 'hintSix'   , src: '6.png'},
    { name: 'hintSeven' , src: '7.png'},
    { name: 'hintEight' , src: '8.png'},
    { name: 'mine'      , src: 'mine.png'},
    { name: 'flag'      , src: 'ooba.png'},
    { name: 'colon'     , src: 'colon.png'},
    { name: 'piriod'     , src: 'piriod.png'},
    { name: 'num0'      , src: 'num0.png'},
    { name: 'num1'      , src: 'num1.png'},
    { name: 'num2'      , src: 'num2.png'},
    { name: 'num3'      , src: 'num3.png'},
    { name: 'num4'      , src: 'num4.png'},
    { name: 'num5'      , src: 'num5.png'},
    { name: 'num6'      , src: 'num6.png'},
    { name: 'num7'      , src: 'num7.png'},
    { name: 'num8'      , src: 'num8.png'},
    { name: 'num9'      , src: 'num9.png'},
  ];
  this.init();
}
ImageResource.prototype.init = function(){

  const total = this.nameMap.length;
  let loadedCount = 0;
  const getOnload = function(data, onComplete) {
    return function() {
      (new Diagnosis()).print(data.src);
      data.isLoaded = true;
      loadedCount++;
      if (loadedCount < total) return;
      (new Queue).enque({key: 'sys_img_onload', value: true});
      onComplete()
    };
  }

  this.nameMap.forEach(data => {
    this[data.name] = new Image();
    this[data.name].src = './resources/' + data.src;
    this[data.name].isLoaded = false;
    // // DEBUG
    // this[data.name].onload = () => {
    //   (new Diagnosis()).print(this[data.name].isLoaded);
    // };
    this[data.name].onload = getOnload(this[data.name], ()=>{});
  });
}
const SingletonImageResource = (function(){
  var instance;
  return function(){
    if ( !instance ) {
      instance = new ImageResource();
    }
    return instance;
  };
})();
