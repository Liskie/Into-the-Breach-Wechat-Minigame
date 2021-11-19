import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
// eslint-disable-next-line import/no-duplicates
import { screenWidth as width, screenHeight as height } from '../utils/index';
// eslint-disable-next-line import/no-duplicates
import { getScale } from '../utils/index';
export default class Game extends Phaser.Scene {
    constructor() {
        // 注册场景名称
        super(SceneKeys.Game);
        // 二维地图的索引
        this.map = new Array();
        // 二维地图对应的方格
        this.mapBloack = new Array();
        this.gameTime = new Date().getTime();
        // 游戏轮数
        this.Turn = 5;
        this.dotoX = 30;
        // 剩余血量
        this.booldNum = 4;
    }
    init() {
        const hello = '有一说一涛神真牛逼';
        console.log(hello);
    }
    create() {
        this.drawBackground();
        this.drawButton();
        this.buttonEvent();
        this.drawTime();
        this.drawTurn();
        this.drawbloodEvent(1);
    }
    update() {
        this.gameTurnLabel.setText(this.Turn.toString());
        this.gameTimeLabel.setText(this.intoTime());
    }
    drawBackground() {
        this._scale = getScale(width, height);
        const booldScaling = 0.25;
        const booldBgWidth = 1203 * booldScaling * this._scale;
        const booldBgHight = 334 * booldScaling * this._scale;
        this.booldBg = this.add.image(this.dotoX, height / 50, TextureKeys.Boold).setDisplaySize(booldBgWidth, booldBgHight).setOrigin(0, 0);
        const successScaling = 0.34;
        const successBgWidth = 679 * successScaling * this._scale;
        const successBgHight = 639 * successScaling * this._scale;
        this.booldBg = this.add.image(this.dotoX, height / 2 - height / 20, TextureKeys.Success).setDisplaySize(successBgWidth, successBgHight).setOrigin(0, 0);
        const scaling = 1;
        const w = 56 * scaling * this._scale;
        const h = 74 * scaling * this._scale;
        const startX = width / 2 + width / 7;
        const startY = height / 8;
        const dx = w / 2;
        const dy = h / 3.5;
        for (let i = 0; i < 8; i++) {
            const x = startX - i * dx;
            this.mapBloack.push(this.add.image(x, startY + i * dy, TextureKeys.Ground).setDisplaySize(w, h).setOrigin(0.5, 0.5));
            this.map.push([x, startY + i * dy]);
            for (let j = 1; j < 8; ++j) {
                const y = startY + i * dy + j * dy;
                this.mapBloack.push(this.add.image(x + (j * w) / 2, y, TextureKeys.Ground).setDisplaySize(w, h).setOrigin(0.5, 0.5));
                this.map.push([x + (j * w) / 2, y]);
            }
        }
        // this.mapBloack[0].setInteractive(new Phaser.Geom.Rectangle(0, 0, this.mapBloack[0].width - w / 2, this.mapBloack[0].height - h / 2), Phaser.Geom.Rectangle.Contains);
        // this.mapBloack[0].addListener('pointerdown', () => {
        //   this.mapBloack[0].destroy();
        // });
        // for (let i = 0; i < 64; i++) {
        //   const x = Math.floor(i / 8);
        //   const y = Math.floor(i % 8);
        //   this.add.text(this.map[i][0], this.map[i][1] - h / 3.5, (`${x.toString()},${y.toString()}`), {
        //     fontSize: '16px',
        //     color: '#ffffff',
        //     padding: { top: 2, bottom: 2 },
        //   }).setScrollFactor(0).setOrigin(0.5, 0.5);
        // }
    }
    drawButton() {
        this._scale = getScale(width, height);
        const booldScaling = 0.25;
        const booldBgHight = 334 * booldScaling * this._scale;
        const x = (width / 30) * this._scale;
        const y = (height / 50 + booldBgHight / 1.7) * this._scale;
        this.ExitGameLabel = this.add.text(x + this.dotoX, y, '结束回合', {
            fontSize: '20px',
            color: '#ffffff',
            padding: { top: 5, bottom: 5 },
        }).setScrollFactor(0).setOrigin(0, 0);
    }
    buttonEvent() {
        this.ExitGameLabel.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.ExitGameLabel.width, this.ExitGameLabel.height), Phaser.Geom.Rectangle.Contains);
        this.ExitGameLabel.on('pointerdown', () => {
            if (this.Turn > 0) {
                this.Turn -= 1;
            }
        });
    }
    drawTime() {
        const successScaling = 0.34;
        const successBgWidth = 679 * successScaling * this._scale;
        const successBgHight = 639 * successScaling * this._scale;
        // this.booldBg = this.add.image(0, height / 2 - height / 20, TextureKeys.Success).setDisplaySize(successBgWidth, successBgHight).setOrigin(0, 0);
        const x = successBgWidth / 2;
        const y = height / 2 - height / 20 + successBgHight / 40;
        this.gameTimeLabel = this.add.text(x + this.dotoX, y, '00:00', {
            fontSize: '14px',
            color: '#ffffff',
            padding: { top: 2, bottom: 2 },
        }).setScrollFactor(0).setOrigin(0, 0);
    }
    drawTurn() {
        const successScaling = 0.34;
        const successBgWidth = 679 * successScaling * this._scale;
        const successBgHight = 639 * successScaling * this._scale;
        // this.booldBg = this.add.image(0, height / 2 - height / 20, TextureKeys.Success).setDisplaySize(successBgWidth, successBgHight).setOrigin(0, 0);
        const x = successBgWidth / 3.2;
        const y = height / 2 + successBgHight / 8;
        this.gameTurnLabel = this.add.text(x + this.dotoX, y, this.Turn.toString(), {
            fontSize: '20px',
            color: '#ffffff',
            padding: { top: 2, bottom: 2 },
        }).setScrollFactor(0).setOrigin(0, 0);
    }
    intoTime() {
        const dangTime = new Date().getTime();
        const time = new Date(dangTime - this.gameTime);
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        return `${minutes < 10 ? (`0${minutes}`) : minutes}:${seconds < 10 ? (`0${seconds}`) : seconds}`;
    }
    drawbloodEvent(i) {
        this._scale = getScale(width, height);
        const booldScaling = 0.25;
        const booldBgWidth = 1203 * booldScaling * this._scale;
        const booldBgHight = 334 * booldScaling * this._scale;
        const x = this.dotoX + booldBgWidth / 2 + booldBgWidth / 20 - 2;
        const y = height / 50 + booldBgHight / 9;
        const dx = booldBgWidth / 30;
        const graphics = this.add.graphics();
        // graphics.fillStyle(0xffffff);
        graphics.fillStyle(0x0C0C17);
        graphics.fillRect(x - i * dx, y, booldBgWidth / 30, booldBgHight / 4);
    }
}
