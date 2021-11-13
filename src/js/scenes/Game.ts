import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import {getScale} from '../utils/index';

export default class Game extends Phaser.Scene {
    private _scale!: number;
    private background!: Phaser.GameObjects.Image;

    constructor() {
        // 注册场景名称
        super(SceneKeys.Game);
    }

    init() {
        const hello: string = '有一说一杰哥组长真牛逼';
        console.log(hello);
    }

    create() {
        const {width, height} = this.game.scale;
        this._scale = getScale(width, height);
        // console.log(this._scale);

        const scaling = 0.8;
        const w = 56 * scaling * this._scale;
        const h = 74 * scaling * this._scale;

        // console.log(w);
        // console.log(h);

        const startX = width / 2;
        const startY = height / 3;
        const dx = w / 2;
        const dy = h / 3.5;

        // for (var j = 0; j < 8; ++j) {
        //   let y: number = height / 10 + (j * h) / 3.5;
        for (var i = 0; i < 8; i++) {
            let x: number = startX - i * dx;
            this.background = this.add.image(x, startY + i * dy, TextureKeys.Ground)
                .setDisplaySize(w, h).setOrigin(0.5, 0.5);
            for (var j = 1; j < 8; ++j) {
                let y: number = startY + i * dy + j * dy;
                this.background = this.add.image(x + (j * w) / 2, y, TextureKeys.Ground)
                    .setDisplaySize(w, h).setOrigin(0.5, 0.5);
            }
        }
    }

    update() {
    }
}
