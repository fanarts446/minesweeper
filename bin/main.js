(new Diagnosis()).enableDebugMode()

function main() {
  (new Diagnosis()).print("main called");
  const game = new Game();
  // (function() { game.initResource();})();
  game.init();
  // game.main();
  return game;
}

window.onload = function() {
  (new Diagnosis()).print("onload called");
  // もっと前に読み込みたい…
  (new SingletonSoundResource());
  document.onselectstart = () => { return false; }
  (new PageController()).display();
  return;
}
