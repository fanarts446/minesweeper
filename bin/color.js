/*
 
Rgb
  see. http://www.charatsoft.com/develop/otogema/page/05d3d/effect.html
  alphaBlend(stackColor: Rgb, percentage: Number)
  addBlend(stackColor: Rgb, percentage: Number)
  toHsv();
  toString()
Hsv
  toRgb();
  toString()
*/
(new Diagnosis()).print("color load");
class Rgb {
  constructor(r, g, b){
    (new Diagnosis()).print("Rgb constructor");
    (new Diagnosis()).print("param: (" + r
                            + ", " + g
                            + ", " + b + ")");
    this.__r = r;
    this.__g = g;
    this.__b = b;
    (new Diagnosis()).print("color: (" + this.__r
                            + ", " + this.__g
                            + ", " + this.__b + ")");
  }
  get r() {
    return this.__r;
  }
  get g() {
    return this.__g;
  }
  get b() {
    return this.__b;
  }
  toHsv() {
    // // T.B.D.
    // let max = Math.max(this.__r, this.__b, this.__c);
    // let min = Math.min(this.__r, this.__b, this.__c);
  }
  /*
    rate: Number (0.0 - 1.0);
   */
  getAlphaBlend(stackRgb, rate) {
    (new Diagnosis()).print("getAlphaBlend called");
    (new Diagnosis()).print("arguments: (" + stackRgb
                            + ", " + rate + ")");
    
    if (rate < 0 || rate > 1) return this;

    // 確定色 = 背景色 + (重ねる色 - 背景色) * (アルファ値 / 255)
    const conv = function(base, stack, rate) {
      return Math.floor(base + (stack - base) * rate);
    }
    let r = conv(this.__r, stackRgb.r, rate);
    let g = conv(this.__g, stackRgb.g, rate);
    let b = conv(this.__b, stackRgb.b, rate);
    (new Diagnosis()).print("alpha blend: (" + r
                            + ", " + g
                            + ", " + b + ")");
    r = r >= 0xFF ? 0xFF : r;
    g = g >= 0xFF ? 0xFF : g;
    b = b >= 0xFF ? 0xFF : b;

    (new Diagnosis()).print("original: (" + this.__r
                            + ", " + this.__g
                            + ", " + this.__b + ")");
    return new Rgb(r,g,b);
  }
  /*
    rate: Number (0.0 - 1.0);
   */
  getAddBlend(stackRgb, rate) {
    if (rate < 0 || rate > 1) return this;

    // 確定色 = 背景色 + 重ねる色 * (アルファ値 / 255)
    const conv = function(base, stack, rate) {
      return Math.floor(base + stack * rate);
    }
    let r = conv(this.__r, stackRgb.r, rate);
    let g = conv(this.__g, stackRgb.g, rate);
    let b = conv(this.__b, stackRgb.b, rate);
    r = r > 0xFF ? 0xFF : r;
    g = g > 0xFF ? 0xFF : g;
    b = b > 0xFF ? 0xFF : b;

    return new Rgb(r,g,b);
  }
  toString() {
    let color = '#';
    color += ( '00' + this.__r.toString(16)).slice(-2);
    color += ( '00' + this.__g.toString(16)).slice(-2);
    color += ( '00' + this.__b.toString(16)).slice(-2);
    return color
  }
}

class Hsv {
  constructor(h, s, v){
    this.__h = h;
    this.__s = s;
    this.__v = v;
  }
}


