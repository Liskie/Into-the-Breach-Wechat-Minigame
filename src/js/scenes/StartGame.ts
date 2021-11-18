/**
 * 游戏开始场景
 */
import { screenWidth as width, screenHeight as height } from '../utils/index';
import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private StartGameLabel!: Phaser.GameObjects.Text;
  private DeveloperLabel!: Phaser.GameObjects.Text;
  private ExitGameLabel!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.StartGame);
  }

  init() {
    console.log('游戏菜单');
  }
  create() {
    this.createMenu();
  }
  update() {
  }

  createMenu() {
    console.log(width);
    console.log(height);
    // 设置背景图片
    this.background = this.add.image(0, 0, TextureKeys.Calibration).setDisplaySize(width, height).setOrigin(0, 0);
    // 开始游戏
    this.StartGameLabel = this.add.text(30, height / 2 - 30, '开始游戏', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#181723',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0, 0);

    // 设置开始游戏的事件监听
    this.StartGameLabel.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.StartGameLabel.width, this.StartGameLabel.height), Phaser.Geom.Rectangle.Contains);
    this.StartGameLabel.on('pointerdown', () => {
      this.scene.start(SceneKeys.Game);
    });
    // 主创人员
    this.DeveloperLabel = this.add.text(30, height / 2 + 30, '主创人员', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#181723',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0, 0);
    // 退出游戏
    this.ExitGameLabel = this.add.text(30, height / 2 + 90, '退出游戏', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#181723',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0, 0);
  }
}
