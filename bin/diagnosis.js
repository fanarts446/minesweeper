const __DebugConfig = function() {
  this.debug = false;
  this.init();
}
__DebugConfig.prototype.init = function(){
  this['print'] = (function(flg) {
    return function(message) {
      if (!flg) { return ; }
      console.log(message);
      return;
    }
  })(this.debug);
  this['enableDebugMode'] = (function(obj){
    return function() {
      obj.debug = true;
    }
  })(this);
  this['disableDebugMode'] = (function(obj){
    return function() {
      obj.debug = false;
    }
  })(this);
  this['format'] = function(f, params){
    // T.B.D.
    // if(f.test(/\{\w+\}/i)) {
    // }
    // f.
    return f;
  }

}
const Diagnosis = (function(){
  var instance;
  return function(){
    if ( !instance ) {
      instance = new __DebugConfig();
    }
    return instance;
  };
})();
