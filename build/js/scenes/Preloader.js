import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import TextureProperties from '../consts/TextureProperties';
import LevelKeys from '../consts/LevelKeys';
export default class Game extends Phaser.Scene {
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
        this.load.spritesheet(TextureKeys.MechTankA, 'images/units/player/mech_tank_a.png', { frameWidth: TextureProperties.MechTankAWidth, frameHeight: TextureProperties.MechTankAHeight });
        // buildings
        this.load.image(TextureKeys.BuildingH, 'images/buildings/building.png');
        this.load.image(TextureKeys.BuildingMountain, 'images/buildings/mountain_0.png');
        // levels
        this.load.json(LevelKeys.Level1, 'levels/1.json');
        this.load.json(LevelKeys.Building, 'levels/building.json');
        const { width, height } = this.game.scale;
        const style = { font: '18px monospace', fill: '#ffffff' }; // 设置显示文本的样式
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style
        }).setOrigin(0.5, 0.5);
        this.load.on('progress', (value) => {
            // eslint-disable-next-line radix
            percentText.setText(`${parseInt(value) * 100}%`);
        });
        this.load.on('complete', () => {
            percentText.destroy();
        });
    }
}
