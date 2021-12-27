import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import TextureProperties from '../consts/TextureProperties';
import LevelKeys from '../consts/LevelKeys';

export default class Game extends Phaser.Scene {
  // @ts-ignore
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

    this.load.image(TextureKeys.Blood, 'images/blood.png');
    this.load.image(TextureKeys.EndTurn, 'images/endTurn.png');
    this.load.image(TextureKeys.Success, 'images/success.png');

    // mechs
    this.load.image(TextureKeys.MechTankDeath, 'images/units/player/mech_tank_broken.png');
    this.load.spritesheet(TextureKeys.MechTankA,
      'images/units/player/mech_tank_a.png',
      { frameWidth: TextureProperties.MechTankAWidth, frameHeight: TextureProperties.MechTankAHeight });

    // aliens
    this.load.spritesheet(TextureKeys.CarbA,
      'images/units/aliens/carba.png',
      { frameWidth: TextureProperties.CarbAWidth, frameHeight: TextureProperties.CarbAHeight });
    this.load.spritesheet(TextureKeys.CarbDeath,
      'images/units/aliens/carb_death.png',
      { frameWidth: TextureProperties.CarbDeathWidth, frameHeight: TextureProperties.CarbDeathHeight });
    this.load.spritesheet(TextureKeys.CarbEmerge,
      'images/units/aliens/carb_emerge.png',
      { frameWidth: TextureProperties.CarbEmergeWidth, frameHeight: TextureProperties.CarbEmergeHeight });
    for (let i = 0; i < 2; i++) {
      this.load.image(TextureKeys.AlienShotPredic + i.toString(), `images/units/aliens/projectile_arrow_${i.toString()}.png`);
      this.load.image(TextureKeys.CarbShot + i.toString(), `images/units/aliens/shot_firefly_${i.toString()}.png`);
      this.load.image(TextureKeys.MechTankShot + i.toString(), `images/units/player/shot_mechtank_${i.toString()}.png`);
    }

    // buildings
    this.load.image(TextureKeys.BuildingA, 'images/buildings/building.png');
    this.load.image(TextureKeys.BuildingBroken, 'images/buildings/building_broken.png');
    this.load.spritesheet(TextureKeys.BuildingDeath,
      'images/buildings/building_B_collapse.png',
      { frameWidth: TextureProperties.Building_B_collapseWidth, frameHeight: TextureProperties.Building_B_collapseHeight });
    this.load.image(TextureKeys.MountainA, 'images/buildings/mountain_0.png');
    this.load.image(TextureKeys.MountainBroken, 'images/buildings/mountain_0_broken.png');
    this.load.spritesheet(TextureKeys.MountainDeath,
      'images/buildings/mountain_explode.png',
      { frameWidth: TextureProperties.MountainDeathWidth, frameHeight: TextureProperties.MountainDeathHeight });
    this.load.spritesheet(TextureKeys.EmergingIntro,
      'images/buildings/emerge_intro.png',
      { frameWidth: 56, frameHeight: 43 });
    this.load.spritesheet(TextureKeys.EmergingLoop,
      'images/buildings/emerge_loop.png',
      { frameWidth: 56, frameHeight: 43 });
    this.load.image(TextureKeys.EmergingAttack, 'images/buildings/icon_emerge.png');

    // icons
    for (let i = 0; i <= 9; i++) {
      this.load.image(TextureKeys.Number + i.toString(), `images/icon/Text_${i.toString()}.png`);
    }
    for (let i = 1; i <= 4; i++) {
      this.load.image(TextureKeys.Arrow + i.toString(), `images/icon/arrow_${i.toString()}.png`);
      this.load.image(TextureKeys.Melee + i.toString(), `images/icon/melee_${i.toString()}.png`);
    }
    this.load.image(TextureKeys.Empty, 'images/icon/empty.png');
    this.load.image(TextureKeys.Box, 'images/icon/push_box.png');

    // levels
    this.load.json(LevelKeys.Level1, 'levels/1.json');
    this.load.json(LevelKeys.Building, 'levels/building.json');

    // portraits
    this.load.spritesheet(TextureKeys.PilotGenius,
      'images/pilots/Pilot_Genius_blink.png',
      { frameWidth: TextureProperties.PilotWidth, frameHeight: TextureProperties.PilotHeight });
    this.load.spritesheet(TextureKeys.PilotLeader,
      'images/pilots/Pilot_Leader_blink.png',
      { frameWidth: TextureProperties.PilotWidth, frameHeight: TextureProperties.PilotHeight });
    this.load.spritesheet(TextureKeys.PilotHotshot,
      'images/pilots/Pilot_Hotshot_blink.png',
      { frameWidth: TextureProperties.PilotWidth, frameHeight: TextureProperties.PilotHeight });
    this.load.image(TextureKeys.PortraitBack1, 'images/pilots/back_1.png');

    // weapons
    this.load.image(TextureKeys.MechTankBrute, 'images/weapons/brute_tankmech.png');

    // repairs
    this.load.image(TextureKeys.Repair, 'images/weapons/repair.png');

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
