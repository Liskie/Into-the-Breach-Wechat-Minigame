import SceneKeys from '../consts/SceneKeys';
import Button from '../components/Button';
// eslint-disable-next-line import/no-cycle
import Main from '../main';
import { screenWidth as width, screenHeight as height } from '../utils/index';
import Game from './Game';

/**
 * 游戏结束场景
 */
export default class Author extends Phaser.Scene {
  private isWinMessage!: Phaser.GameObjects.Text;
  private score!: Phaser.GameObjects.Text;
  private background!: Phaser.GameObjects.Rectangle;
  constructor() {
    // 注册场景名称
    super(SceneKeys.Author);
  }

  create() {
    this.background = this.add.rectangle(width / 2, height / 2, width, 300, 0x131620, 0.9).setOrigin(0.5, 0.5);

    this.isWinMessage = this.add.text(width / 2, height / 2 - 80, '主 创 人 员', {
      fontSize: '30px',
      color: '#ffffff',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0.5, 0.5);

    this.score = this.add.text(width / 2, height / 2, '王誉杰 王丹羽 张存涛 沈楠', {
      fontSize: '30px',
      color: '#ffffff',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0.5, 0.5);

    const back = this.add.text(width / 2, height / 2 + 80, '返回主菜单', {
      fontSize: '30px',
      color: '#ffffff',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      backgroundColor: '#000000'
    }).setScrollFactor(0).setOrigin(0.5, 0.5);

    back.setInteractive(new Phaser.Geom.Rectangle(0, 0, back.width, back.height), Phaser.Geom.Rectangle.Contains);
    back.on('pointerdown', () => {
      if (Game.isGameTerminated) {
        new Main();
      }
    });
  }
}
