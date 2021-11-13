import SceneKeys from '../consts/SceneKeys';
import Button from '../components/Button';
/**
 * 游戏结束场景
 */
export default class GameOver extends Phaser.Scene {
    constructor() {
        // 注册场景名称
        super(SceneKeys.GameOver);
    }
    create() {
        const btn = new Button(this, 'Play Again', () => {
            // stop the gameover scene
            this.scene.stop(SceneKeys.GameOver);
            // stop the game scene
            this.scene.stop(SceneKeys.Game);
            // restart the game scene
            this.scene.start(SceneKeys.Game);
        });
        this.add.existing(btn);
    }
}
