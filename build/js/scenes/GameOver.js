import SceneKeys from '../consts/SceneKeys';
// eslint-disable-next-line import/no-cycle
import Main from '../main';
import { screenWidth as width, screenHeight as height } from '../utils/index';
import Game from './Game';
/**
 * 游戏结束场景
 */
export default class GameOver extends Phaser.Scene {
    constructor() {
        // 注册场景名称
        super(SceneKeys.GameOver);
    }
    create() {
        this.background = this.add.rectangle(width / 2, height / 2, width, 300, 0x131620, 0.9).setOrigin(0.5, 0.5);
        this.isWinMessage = this.add.text(width / 2, height / 2 - 80, (Game.isGameWin ? '  你 赢 了 ！' : '  你 输 了 ！'), {
            fontSize: '30px',
            color: '#ffffff',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setScrollFactor(0).setOrigin(0.5, 0.5);
        this.score = this.add.text(width / 2, height / 2, `游戏得分：${Game.totalScore.toString()}`, {
            fontSize: '30px',
            color: '#ffffff',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        }).setScrollFactor(0).setOrigin(0.5, 0.5);
        const btn = this.add.text(width / 2, height / 2 + 80, '再来一局', {
            fontSize: '30px',
            color: '#ffffff',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
            backgroundColor: '#000000'
        }).setScrollFactor(0).setOrigin(0.5, 0.5);
        btn.setInteractive(new Phaser.Geom.Rectangle(0, 0, btn.width, btn.height), Phaser.Geom.Rectangle.Contains);
        btn.on('pointerdown', () => {
            if (Game.isGameTerminated) {
                new Main();
            }
        });
    }
}
