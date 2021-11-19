import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';

export default class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.Image;

  constructor() {
    // 注册场景名称
    super(SceneKeys.Preloader);
  }

  preload() {
    // 首先加载资源
    this.loadResources();
  }

  create() {
    // 在preload函数执行完，才执行
    // 切换到游戏场景,触发下一个场景的created
    this.scene.start(SceneKeys.StartGame);
  }

  // 加载静态资源
  loadResources() {
    this.load.image(TextureKeys.Ground, 'images/ground.png');
    this.load.image(TextureKeys.Calibration, 'images/calibration.png');
    this.load.image(TextureKeys.Bg3, 'images/bg3.png');
    this.load.image(TextureKeys.Sand1, 'images/sand1.png');
    this.load.image(TextureKeys.Boold, 'images/boold.png');
    this.load.image(TextureKeys.EndTurn, 'images/endTurn.png');
    this.load.image(TextureKeys.Success, 'images/success.png');

    // mechs
    this.load.image(TextureKeys.MechTankA, 'images/player/mech_tank_a.png');

    const { width, height } = this.game.scale;
    const style = { font: '18px monospace', fill: '#ffffff' }; // 设置显示文本的样式
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style
    }).setOrigin(0.5, 0.5);

    this.load.on('progress', (value:string) => {
      // eslint-disable-next-line radix
      percentText.setText(`${parseInt(value) * 100}%`);
    });

    this.load.on('complete', () => {
      percentText.destroy();
    });
  }
}
