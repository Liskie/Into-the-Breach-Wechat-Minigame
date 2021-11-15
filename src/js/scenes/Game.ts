import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import { getScale } from '../utils/index';

export default class Game extends Phaser.Scene {
  private _scale!: number;
  private background!: Phaser.GameObjects.Image;
  private map:Array<Array<number>> = new Array<Array<number>>();

  constructor() {
    // 注册场景名称
    super(SceneKeys.Game);
  }

  init() {
    const hello: string = '有一说一杰哥组长真牛逼';
    console.log(hello);
  }

  create() {
    this.drawMap();
  }
  update() {
  }

  drawMap() {
    const { width, height } = this.game.scale;
    this._scale = getScale(width, height);
    console.log(width);
    console.log(height);

    const scaling = 1.7;
    const w = 56 * scaling * this._scale;
    const h = 74 * scaling * this._scale;

    const startX = width / 2;
    const startY = height / 8;
    const dx = w / 2;
    const dy = h / 3.5;

    for (let i = 0; i < 8; i++) {
      const x: number = startX - i * dx;
      this.background = this.add.image(x, startY + i * dy, TextureKeys.Ground).setDisplaySize(w, h).setOrigin(0.5, 0.5);
      this.map.push([x, startY + i * dy]);
      for (let j = 1; j < 8; ++j) {
        const y: number = startY + i * dy + j * dy;
        this.background = this.add.image(x + (j * w) / 2, y, TextureKeys.Ground).setDisplaySize(w, h).setOrigin(0.5, 0.5);
        this.map.push([x + (j * w) / 2, y]);
      }
    }

    // for (let i = 0; i < 64; i++) {
    //   const x = Math.floor(i / 8);
    //   const y = Math.floor(i % 8);
    //   console.log([x,y]);
    //   this.make.text({
    //     x: this.map[i][0],
    //     y: this.map[i][1]-h/4,
    //     text: `${x.toString()},${y.toString()}`,
    //   }).setOrigin(0.5, 0.5);
    //
    //   var player = this.add.image(this.map[i][0],this.map[i][1]-h/4, TextureKeys.Sand1).setOrigin(0.5,0.5).setDisplaySize(w/2.5, h/2.5);
    // }
  }
}
