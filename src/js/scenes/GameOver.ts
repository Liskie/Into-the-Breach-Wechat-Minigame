import SceneKeys from '../consts/SceneKeys';
import Button from '../components/Button';
// eslint-disable-next-line import/no-cycle
import Main from '../main';
import { screenWidth as width, screenHeight as height } from '../utils/index';
import Game from './Game';

/**
 * 游戏结束场景
 */
export default class GameOver extends Phaser.Scene {
  private isWinMessage!: Phaser.GameObjects.Text;
  private score!: Phaser.GameObjects.Text;
  private background!: Phaser.GameObjects.Rectangle;
  constructor() {
    // 注册场景名称
    super(SceneKeys.GameOver);
  }

  create() {
    this.background = this.add.rectangle(width / 2, height / 2, width, 300, 0x131620, 0.9).setOrigin(0.5, 0.5);

    this.isWinMessage = this.add.text(width / 2, height / 2 - 80, (Game.isGameWin ? '  你 赢 了 ！' : '  你 输 了 ！'), {
      fontSize: '30px',
      color: '#ffffff',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0.5, 0.5);

    this.score = this.add.text(width / 2, height / 2 + 80, `游戏得分：${Game.totalScore.toString()}`, {
      fontSize: '30px',
      color: '#ffffff',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0.5, 0.5);

    const btn = new Button(this, '再来一局', () => {
      new Main();
    });

    this.add.existing(btn);
  }
}
