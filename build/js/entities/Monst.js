// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
export class Monst extends Unit {
    constructor(game, coords, sprite, maxAp, atkRange, hp, maxHp, movesLeft = 5) {
        super(game, coords, sprite, maxAp, atkRange, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.maxAp = maxAp;
        this.atkRange = atkRange;
        this.hp = hp;
        this.maxHp = maxHp;
        this.movesLeft = movesLeft;
        // 攻击意图标识
        this.atkIntention = -1;
    }
    // 给定当前的坐标以及目标坐标，判断该怪能不能打到目标
    ifAttackable(nowCoords, tgtCoords) {
    }
    // 玩家动之前，怪先动，并显示攻击意图
    moveAndPrepareForAttack() {
    }
}
