/**
 * 游戏主函数
 */
import {screenWidth as width, screenHeight as height} from './utils/index';
// import Music from './runtime/music';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';

interface GameConfig extends Phaser.Types.Core.GameConfig {
    pixelRatio?: number; // 屏幕像素比
}

export default class Main {
    private readonly config: GameConfig = {};

    constructor() {
        this.config = {
            type: Phaser.CANVAS, // 手机游戏请务必指定Phaser.CANVAS
            antialias: true, // 开启抗锯齿
            width,
            height,
            // @ts-ignore
            parent: null, // 游戏容器
            canvas: window.canvas,
            input: {
                touch: true, // 开启touch
            },
            // 物理引擎
            physics: {
                default: 'arcade', // 重力
                arcade: {
                    gravity: {y: 200},
                    // debug: true,
                },
            },
            // 注册场景：Preloader -> Game -> GameOver
            scene: [Preloader, Game],
        };

        this.create();
    }

    create() {
        // 创建 phaser游戏s
        new Phaser.Game(this.config);
        // new Music();
    }
}
