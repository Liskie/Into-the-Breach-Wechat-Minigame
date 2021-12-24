import SceneKeys from '../consts/SceneKeys';
import Button from '../components/Button';
// eslint-disable-next-line import/no-cycle
import Main from '../main';
import { screenWidth as width, screenHeight as height } from '../utils/index';
import Game from '../scenes/Game';
/**
 * 游戏结束场景
 */
export default class GameOver extends Phaser.Scene {
    constructor() {
        // 注册场景名称
        super(SceneKeys.GameOver);
    }
    create() {
        this.isWinMessage = this.add.text(width / 2 - 100, height / 2 - 100, (Game.isGameWin ? 'You win !' : 'Game over !'), {
            fontSize: '30px',
            color: '#ffffff',
            backgroundColor: '#000000',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setScrollFactor(0).setOrigin(0, 0);
        this.score = this.add.text(width / 2 - 130, height / 2 + 50, 'score: ' + Game.totalScore.toString(), {
            fontSize: '30px',
            color: '#ffffff',
            backgroundColor: '#000000',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setScrollFactor(0).setOrigin(0, 0);
        const btn = new Button(this, 'Play Again', () => {
            new Main();
        });
        this.add.existing(btn);
    }
}
