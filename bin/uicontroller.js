class BasePage {
  constructor(parentElement, pageController){
    this.parent = parentElement;
    this.controller = pageController;
  }
  createPage(pageId){
    this.div = document.createElement('div');
    this.div.id =pageId;
    this.div.classList.add('game-page');
    this.div.innerHTML = this.html;
  }
  addEvent(){
    throw Error('Not Implemented');
  }
  removeEvent(){
    throw Error('Not Implemented');
  }
  getEventHandler(eventHandlerName){
    return (function(obj){
      return function(event){
        if (!obj[eventHandlerName]) return;
        obj[eventHandlerName]();
      }
    })(this);
  }
  get html() {
    throw Error('Not Implemented');
  }
  set html(value) {
    // pass
  }
}

class DummyPage {
  constructor(parentElement, pageController) {
    this.parent = parentElement;
    this.controller = pageController;
  }
  display() {
    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
      this.controller.setPage(new SorryPage(this.parent, this.controller));
    } else {
      this.controller.setPage(new StartPage(this.parent, this.controller));
    }
  }
}

class StartPage extends BasePage {
  constructor(parentElement, pageController) {
    super(parentElement, pageController);
    this.createPage('start-page');
    this.addEvent();
    this.parent.appendChild(this.div);
  }
  get html() {
    return `<div class="game-page-element">
<h1>MINE SWEEPER</h1>
<p class="flash-element">&lt; CLICK TO GAME &gt;</p>
</div>`;
  }
  addEvent(){
    this.div.addEventListener('click', this.getEventHandler('display'));
  }
  removeEvent(){
    this.div.removeEventListener('click', this.getEventHandler('display'));
  }
  display() {
    (new SingletonSoundResource()).opened.play();
    this.div.remove();
    this.controller.setPage(new ConfigPage(this.parent,
                                            this.controller));
  }
}

class ConfigPage extends BasePage {
  constructor(parentElement, pageController) {
    super(parentElement, pageController);
    this.createPage('config-page');

    this.generateElementCache();

    this.addEvent();
    this.parent.appendChild(this.div);

    this.preChecked = 'normal';

    this.controller.game.initDrawings();
  }
  get html() {
    return `<div class="game-page-element">
<h2>CONFIGURATIONS</h2>

<div>
<h4>ゲーム・モード</h4>
<div class="difficult-container">
<p class="difficult-radio">
  <input type='radio' name='difficult' id="difficult-easy">
  <label class="difficult-label" id="difficult-easy-label" for="difficult-easy">よゆー</label>
</p>
<p class="difficult-radio">
  <input type='radio' name='difficult' id="difficult-normal" checked>
  <label class="difficult-label" id="difficult-normal-label" for="difficult-normal">ふつー</label>
</p>
<p class="difficult-radio">
  <input type='radio' name='difficult' id="difficult-hard">
  <label class="difficult-label" id="difficult-hard-label" for="difficult-hard">むずむず</label>
</p>
<p class="difficult-radio">
  <input type='radio' name='difficult' id="difficult-nightmare">
  <label class="difficult-label dispose" id="difficult-nightmare-label" for="difficult-nightmare">9.2%</label>
</p>
</div>
</div>

<div>
<h4>サウンド・ボリューム</h4>
<div class="game-page-element sound-volume-container">
<p>
<input type='range' name='valume' max='0.5' step='0.05' id='valume-slider'>
</p>
</div>
</div>

<div>
<h4>獅白ぼたんの事、好き？</h4>
<div class="declare-container virtual-box">
  <p class="declare-check virtual-box">
    <input type='radio' name='check' id="declare-yes" checked>
    <label class="declare-label" for="declare-yes">大好き！</label>
  </p>
  <p class="declare-check virtual-box">
    <input type='radio' name='check' id="declare-no">
    <label class="declare-label" for="declare-no">どちらともいえない</label>
  </p>
</div>
</div>
<div class="game-page-element">
<p>
<a class="start-button">START<a>
</p>
</div>`;
  }
  addEvent(){
    this.generateElementCache();
    Array.from(this.difficultLabelContainer).forEach(elm => {
      elm.addEventListener('click', this.getEventHandler('soundMouseover'));
    });
    // this.volumeSlider.addEventListener('input', this.getEventHandler('slideVolume'));
    this.volumeSlider.addEventListener('mouseup', this.getEventHandler('slideVolume'));
    Array.from(this.loveRadioContainer).forEach(elm => {
      elm.addEventListener('click', this.getEventHandler('toggleCheckbox'));
      elm.addEventListener('mouseenter', this.getEventHandler('soundMouseover'));
    });
    this.startButton.addEventListener('click', this.getEventHandler('display'));
  }
  removeEvent(){
    Array.from(this.loveRadioContainer).forEach(elm => {
      elm.removeEventListener('click', this.getEventHandler('toggleCheckbox'));
    });
    this.volumeSlider.removeEventListener('input', this.getEventHandler('slideVolume'));
    this.startButton.removeEventListener('click', this.getEventHandler('display'));
  }
  generateElementCache(){
    if (!this.loveRadioContainer) {
      const container = this.div.getElementsByClassName('declare-container virtual-box')[0];
      this.loveRadioContainer = container.getElementsByTagName('input');
    }
    if (!this.loveLabelContainer) {
      const container = this.div.getElementsByClassName('declare-container virtual-box')[0];
      this.loveLabelContainer = container.getElementsByClassName('declare-label');
    }
    if (!this.volumeSlider) {
      this.volumeSlider = this.div.getElementsByClassName('game-page-element sound-volume-container')[0].getElementsByTagName('input')[0];
    }
    if (!this.startButton) {
      this.startButton = this.div.getElementsByClassName('start-button')[0];
    }
    if (!this.difficultLabelContainer) {
      const container = this.div.getElementsByClassName('difficult-container')[0];
      this.difficultLabelContainer = container.getElementsByClassName('difficult-label');
    }
    if (!this.easy) {
      this.easy = document.getElementById('difficult-easy-label');
    }
    if (!this.normal) {
      this.normal = document.getElementById('difficult-normal-label');
    }
    if (!this.hard) {
      this.hard = document.getElementById('difficult-hard-label');
    }
    if (!this.nightmare) {
      this.nightmare = document.getElementById('difficult-nightmare-label');
    }
    if (!this.easyCheckbox) {
      this.easyCheckbox = document.getElementById('difficult-easy');
    }
    if (!this.normalCheckbox) {
      this.normalCheckbox = document.getElementById('difficult-normal');
    }
    if (!this.hardCheckbox) {
      this.hardCheckbox = document.getElementById('difficult-hard');
    }
    if (!this.nightmareCheckbox) {
      this.nightmareCheckbox = document.getElementById('difficult-nightmare');
    }
  }
  soundMouseover() {
    (new SingletonSoundResource()).selected.play();
  }
  display() {
    this.generateElementCache();
    (new SingletonSoundResource()).opened.play();
    if (this.easyCheckbox.checked) {
      DynamicConfiguration.gameMode = 'easy';
    } else if (this.normalCheckbox.checked) {
      DynamicConfiguration.gameMode = 'normal';
    } else if (this.hardCheckbox.checked) {
      DynamicConfiguration.gameMode = 'hard';
    } else if (this.nightmareCheckbox.checked) {
      DynamicConfiguration.gameMode = 'ultra';
    } else {
      throw Error('Move Error');
    }

    this.div.remove();
    this.controller.setPage(new GamePage(this.parent,
                                         this.controller));
  }
  slideVolume() {
    (new SingletonSoundResource()).volume(document.getElementById('valume-slider').value);
    (new SingletonSoundResource()).opened.play();
  }
  toggleCheckbox() {
    this.generateElementCache();

    const flg = document.getElementById('declare-yes').checked;

    if (this.easyCheckbox.checked) this.preChecked = 'easy';
    if (this.normalCheckbox.checked) this.preChecked = 'normal';
    if (this.hardCheckbox.checked) this.preChecked = 'hard';

    if (flg) {
      this.easy.classList.remove('dispose');
      this.normal.classList.remove('dispose');
      this.hard.classList.remove('dispose');
      this.nightmare.classList.add('dispose');
    } else {
      this.easy.classList.add('dispose');
      this.normal.classList.add('dispose');
      this.hard.classList.add('dispose');
      this.nightmare.classList.remove('dispose');
    }

    switch(this.preChecked){
      case 'easy':
        this.easyCheckbox.checked = flg;
        break;
      case 'normal':
        this.normalCheckbox.checked = flg;
        break;
      case 'hard':
      default:
        this.hardCheckbox.checked = flg;
        break;
    }
    this.nightmareCheckbox.checked = !flg;
    (new SingletonSoundResource()).selected.play();
  }
}

class GamePage extends BasePage{
  constructor(parentElement, pageController) {
    super(parentElement, pageController);
    this.game = pageController.game;
    this.game.init();

    this.createPage('main-page');
    this.div.appendChild(this.game.canvas);

    this.parent.appendChild(this.div);

    // http://yomotsu.net/blog/2013/01/05/fps.html
    const reqAnimationFrame = (function() {
      return window.requestAnimationFrame ||
             window.webkitRequestAnimationFrame ||
             window.mozRequestAnimationFrame ||
             window.oRequestAnimationFrame ||
             window.msRequestAnimationFrame ||
             function( callback ) {
               window.setTimeout(callback, 1000.0/Game.fps);
             };
    })();
    const cancelAnimationFrame = (function() {
      return window.cancelAnimationFrame ||
             window.mozCancelAnimationFrame ||
             function( callback ) {
               window.setTimeout(callback, 1000.0/Game.fps);
             };
    })();

    let cancelId;
    (function(game) {
      const now = window.performance && (
        performance.now ||
        performance.mozNow ||
        performance.msNow ||
        performance.oNow ||
        performance.webkitNow
        );

      const getTime = function() {
        return (now && now.call(performance)) || ( new Date().getTime() );
      }

      var skipTicks = Math.floor(1000 / Game.fps);
      var nextGameTick = getTime();// (new Date).getTime();

      var onEachFrame = function(cb) {
        var _cb = function() {
          cancelId = reqAnimationFrame(_cb);
          if (!game.__isGameState(GAME_STATE.Initialized)) return;
          // ここでタイミング制御
          // if (getTime() - nextGameTick >= (skipTicks - 1) * 0.97) {
          if (getTime() - nextGameTick >= skipTicks) {
            cb();
            nextGameTick = getTime();
          }
        };
        _cb();
      }
      window.onEachFrame = onEachFrame;
    })(this.game);

    this.game.stop = function() {
      cancelAnimationFrame(cancelId);
    }
    this.game.endPage = this.getEventHandler('display');
    this.game.configPage = this.getEventHandler('config');

    window.onEachFrame(this.game.run);
  }
  get html() { return ''; }
  display() {
    this.div.remove();
    this.controller.setPage(new EndPage(this.parent, this.controller));
  }
  config() {
    this.div.remove();
    this.controller.setPage(new ConfigPage(this.parent, this.controller));
  }
}

class EndPage extends BasePage {
  constructor(parentElement, pageController) {
    super(parentElement, pageController);
    this.createPage('end-page');
    this.addEvent();
    this.parent.appendChild(this.div);
  }
  get html() {
    return `<div class="game-page-element">
<h2>THANK YOU FOR PLAYING.</h2>
</div>`;
  }
  addEvent(){
  }
  removeEvent(){
  }
  display() {
    (new SingletonSoundResource()).opened.play();
    this.div.remove();
    this.controller.setPage(new DummyPage(this.parent,
                                          this.controller));
  }
}

class SorryPage extends BasePage {
  constructor(parentElement, pageController) {
    super(parentElement, pageController);
    this.createPage('sorry-page');
    this.addEvent();
    this.parent.appendChild(this.div);
  }
  get html() {
    return `<div class="game-page-element">
<h2>SORRY</h2>
  <div>
    <p>このゲームはスマートフォンに対応してません。</p>
    <p>大変恐縮ですが、PCより再度アクセスしてください。</p>
  </div>
</div>`;
  }
  addEvent(){
  }
  removeEvent(){
  }
  display() {
    (new SingletonSoundResource()).opened.play();
    this.div.remove();
    this.controller.setPage(new DummyPage(this.parent,
                                          this.controller));
  }
}


class PageController {
  constructor(){
    this.game = new Game();
    this.game.init();

    const sec = document.getElementById('game-section');
    this.setPage(new DummyPage(sec, this));
  }
  setPage(page){
    this.page = page;
  }
  display() {
    this.page.display();
  }
}
