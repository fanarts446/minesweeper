const __queue = function() {
  this.__queue = [];
  this.__lock = false;
  this.init();
}
__queue.prototype.init = function(){
  this.lock = function() {
    this.__lock = true;
  }
  this.unlock = function() {
    this.__lock = false;
  }
  this.deque = function() {
    // (new Diagnosis()).print("denque");
    // if (this.__lock) return;
    return this.__queue.shift();
  }
  this.enque = function(gameEvent) {
    // (new Diagnosis()).print("enque");
    // (new Diagnosis()).print(gameEvent);
    if (this.__lock) return;
    this.__queue.push(gameEvent);
  }
  this.clear = function() {
    // if (this.__lock) return;
    this.__queue = this.__queue.filter((elm)=>(/^sys_/).test(elm.key));
    // (new Diagnosis()).print(this.__queue);
  }
  this.hasEvent = function() {
    if (this.__queue) return this.__queue.length != 0;
    return false;
  }
}
const Queue = (function(){
  var instance;
  return function(){
    if ( !instance ) {
      instance = new __queue();
    }
    return instance;
  };
})();

