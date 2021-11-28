import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import { Unit } from '../entities/Unit';
// eslint-disable-next-line import/no-duplicates
import { screenWidth as width, screenHeight as height } from '../utils/index';
// eslint-disable-next-line import/no-duplicates
import { getScale } from '../utils/index';
import { Mech } from '../entities/Mech';
import { Coords } from '../entities/Coords';
import MechProperties from '../consts/MechProperties';
import LevelKeys from '../consts/LevelKeys';
export default class Game extends Phaser.Scene {
    // mechs
    // private MECH_NUM = 3;
    // private mechs: Array<Unit> = new Array<Unit>(this.MECH_NUM);
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
        // board that contains the units
        this.BOARD_SIZE = 8;
        this.board = new Array();
        this.boardWXCoords = [];
    }
    create() {
        this.drawBackground();
        this.drawButton();
        this.buttonEvent();
        this.drawTime();
        this.drawTurn();
        this.drawbloodEvent(1);
        // Board init
        this.createBoard();
        this.createMechs();
        // Development
        this.dev();
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
        const dy = 21 * this._scale;
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
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            this.boardWXCoords.push([]);
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const tempo = this.map[i * this.BOARD_SIZE + j];
                tempo[1] -= 16 * this._scale;
                this.boardWXCoords[i].push(tempo);
            }
        }
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
    createBoard() {
        for (let i = 0; i < this.BOARD_SIZE; i++) {
            const tempo = new Array();
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                tempo.push(null);
            }
            this.board.push(tempo);
        }
    }
    createMechs() {
        const levelJson = this.cache.json.get(LevelKeys.Level1);
        for (let i = 0; i < levelJson.initMechPos.length; i++) {
            const xCoord = levelJson.initMechPos[i][0];
            const yCoord = levelJson.initMechPos[i][1];
            const mechSprite = this.physics.add.sprite(this.boardWXCoords[xCoord][yCoord][0], this.boardWXCoords[xCoord][yCoord][1], TextureKeys.MechTankA)
                .setOrigin(0.5, 0.5)
                .setScale(this._scale, this._scale);
            this.anims.create({
                key: `mech${i.toString()}`,
                frames: this.anims.generateFrameNumbers(TextureKeys.MechTankA, { start: 0, end: 2 }),
                frameRate: 3,
                repeat: -1
            });
            mechSprite.anims.play(`mech${i.toString()}`);
            this.board[xCoord][yCoord] = new Mech(this, new Coords(xCoord, yCoord), mechSprite, MechProperties.TankMaxAp, MechProperties.TankAtkRange, MechProperties.TankMaxHp, MechProperties.TankMaxHp);
        }
        // Generate reachable grid texture
        this.add.graphics()
            .fillStyle(0x13E92A)
            .fillPoints([
            new Phaser.Geom.Point(28.5, 0),
            new Phaser.Geom.Point(0, 21.5),
            new Phaser.Geom.Point(28.5, 42),
            new Phaser.Geom.Point(56, 21.5)
        ], true, true)
            .setScale(this._scale)
            .setAlpha(0.3)
            .generateTexture(TextureKeys.ReachableGrid, 56, 42)
            .destroy();
    }
    // Main game logic
    doTurn() {
        // oneTurn: alienMove -> showEnvEffects -> playerMove&Attack -> takeEnvEffects -> alienAttack
        this.doAlienPhase1();
        this.doEnvPhase1();
        this.doPlayerPhase();
        this.doEnvPhase2();
        this.doAlienPhase2();
    }
    doAlienPhase1() {
    }
    doEnvPhase1() {
    }
    doPlayerPhase() {
    }
    doEnvPhase2() {
    }
    doAlienPhase2() {
    }
    dev() {
        if (this.board[1][1] instanceof Mech) {
            this.board[1][1].showPossibleMoveDestinations();
        }
        else if (this.board[1][1] instanceof Unit) {
            // this.board[1][1].showPossibleMoveDestinations();
        }
    }
}
