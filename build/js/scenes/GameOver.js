import SceneKeys from '../consts/SceneKeys';
import Button from '../components/Button';
// eslint-disable-next-line import/no-cycle
import Main from "../main";
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
            //
            this.scene.stop(SceneKeys.StartGame);
            // restart the game scene
            new Main();
        });
        this.add.existing(btn);
    }
}
