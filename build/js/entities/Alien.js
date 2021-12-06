// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
import { Coords } from './Coords';
export class Alien extends Unit {
    constructor(game, coords, sprite, maxAp, atkRange, hp, maxHp) {
        super(game, coords, sprite, maxAp, atkRange, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.maxAp = maxAp;
        this.atkRange = atkRange;
        this.hp = hp;
        this.maxHp = maxHp;
        // 攻击意图标识
        this.atkIntention = -1;
    }
    // 给定当前的坐标以及目标坐标，判断按照当前的攻击意图，该怪能不能打到目标
    ifAttackable(tgtCoords) {
        return false;
    }
    // 查看当前攻击目标坐标
    getAttackPos(nowCoords) {
        return new Coords(-1, -1);
    }
    // 玩家动之前，怪先动，并显示攻击意图
    moveAndPrepareForAttack() {
    }
    // 怪物攻击
    attack() {
    }
}
