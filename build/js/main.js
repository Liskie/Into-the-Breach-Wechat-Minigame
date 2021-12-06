/**
 * 游戏主函数
 */
import { screenWidth as width, screenHeight as height } from './utils/index';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import StartGame from './scenes/StartGame';
export default class Main {
    constructor() {
        this.config = {};
        this.config = {
            type: Phaser.CANVAS,
            antialias: true,
            width,
            height,
            backgroundColor: '#0C0C17',
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
                // debug: true,
                },
            },
            // 注册场景：Preloader -> StartGame -> Game -> GameOver
            scene: [Preloader, StartGame, Game],
        };
        this.create();
    }
    create() {
        // 创建 phaser游戏s
        new Phaser.Game(this.config);
        // new Music();
    }
}
