/**
 * 游戏主函数
 */
import { screenWidth as width, screenHeight as height } from './utils/index';
import Preloader from './scenes/Preloader';
import Game from './scenes/Game';
import StartGame from './scenes/StartGame';

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
      backgroundColor: '#0C0C17',
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
