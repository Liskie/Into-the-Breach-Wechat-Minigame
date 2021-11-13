import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
export default class Game extends Phaser.Scene {
    constructor() {
        // 注册场景名称
        super(SceneKeys.Preloader);
    }
    preload() {
        this.load.image(TextureKeys.Ground, 'images/ground.png');
    }
    create() {
        // 在preload函数执行完，才执行
        // 切换到游戏场景,触发下一个场景的created
        this.scene.start(SceneKeys.Game);
    }
}
