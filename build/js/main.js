/**
 * 游戏主函数
 */
import { screenWidth as width, screenHeight as height } from './utils/index';
// import Music from './runtime/music';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
export default class Main {
    constructor() {
        this.config = {};
        this.config = {
            type: Phaser.CANVAS,
            antialias: true,
            width,
            height,
            // @ts-ignore
            parent: null,
            canvas: window.canvas,
            input: {
                touch: true, // 开启touch
            },
            // 物理引擎
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 },
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
