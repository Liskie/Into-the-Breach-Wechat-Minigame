import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;
  private StartGameLabel!: Phaser.GameObjects.Text;
  private DeveloperLabel!: Phaser.GameObjects.Text;
  private ExitGameLabel!: Phaser.GameObjects.Text;
  private monster!:Phaser.GameObjects.Image;

  constructor() {
    super(SceneKeys.StartGame);
  }

  init() {
    console.log('游戏菜单');
  }
  create() {
    const { width, height } = this.game.scale;
    this.background = this.add.image(0, 0, TextureKeys.Calibration).setDisplaySize(width, height).setOrigin(0, 0);
    console.log(width);
    console.log(height);

    this.StartGameLabel = this.add.text(30, height / 2 - 30, '开始游戏', {
      fontSize: '24px',
      color: '#080808',
      backgroundColor: '#F8E71C',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0, 0);

    this.StartGameLabel.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.StartGameLabel.width, this.StartGameLabel.height), Phaser.Geom.Rectangle.Contains);
    this.StartGameLabel.on('pointerdown', () => {
        this.scene.start(SceneKeys.Game);
    });

    this.DeveloperLabel = this.add.text(30, height / 2 + 30, '主创人员', {
      fontSize: '24px',
      color: '#080808',
      backgroundColor: '#F8E71C',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0, 0);

    this.ExitGameLabel = this.add.text(30, height / 2 + 90, '退出游戏', {
      fontSize: '24px',
      color: '#080808',
      backgroundColor: '#F8E71C',
      shadow: { fill: true, blur: 0, offsetY: 0 },
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
    }).setScrollFactor(0).setOrigin(0, 0);

    this.monster = this.add.image(0, height - 100, TextureKeys.Bg3).setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: [this.monster],
      props: {
        x: { value: '+=250', duration: 2000, ease: 'Linear' }
      },
      delay: 1000,
      frameRate: 25, // 每秒10帧
      repeat: -1, // 告诉动画要循环播放
      yoyo: true
    });
  }
  update() {
  }
}
