// eslint-disable-next-line import/no-cycle
import { Alien } from '../Alien';
import { Coords } from '../Coords';
export class Carb extends Alien {
    constructor(game, coords, sprite, maxAp, atkRange, hp, maxHp) {
        super(game, coords, sprite, maxAp, atkRange, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.maxAp = maxAp;
        this.atkRange = atkRange;
        this.hp = hp;
        this.maxHp = maxHp;
        this.shootPos = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];
    }
    // 给定目标坐标，判断按照当前的攻击意图，该怪能不能打到目标
    ifAttackable(tgtCoords) {
        if (this.atkIntention == -1) {
            return false;
        }
        const dis = new Coords(tgtCoords.x - this.coords.x, tgtCoords.y - this.coords.y);
        const dx = this.shootPos[this.atkIntention][0];
        const dy = this.shootPos[this.atkIntention][1];
        if (dis.x == 0 && dx == 0 && dy * dis.y > 0) {
            let sign = true;
            for (let i = this.coords.y + dy; i != tgtCoords.y; i += dy) {
                if (this.game.board[tgtCoords.x][i] != null) {
                    sign = false;
                    break;
                }
            }
            return sign;
        }
        else if (dis.y == 0 && dy == 0 && dx * dis.x > 0) {
            let sign = true;
            for (let i = this.coords.x + dx; i != tgtCoords.x; i += dx) {
                if (this.game.board[i][tgtCoords.y] != null) {
                    sign = false;
                    break;
                }
            }
            return sign;
        }
        return false;
    }
    // 查看当前攻击目标坐标
    getAttackPos(nowCoords) {
        let ret = new Coords(-1, -1);
        if (this.atkIntention < 0 || this.atkIntention > 4) {
            return ret;
        }
        const dx = this.shootPos[this.atkIntention][0];
        const dy = this.shootPos[this.atkIntention][1];
        for (let i = new Coords(nowCoords.x + dx, nowCoords.y + dy); i.x >= 0 && i.x < 8 && i.y >= 0 && i.y < 8; i.x += dx, i.y += dy) {
            if (this.game.board[i.x][i.y] != null) {
                ret.x = i.x;
                ret.y = i.y;
                break;
            }
        }
        return ret;
    }
    // 玩家动之前，怪先动，并显示攻击意图
    moveAndPrepareForAttack() {
        let achieve = this.findPossibleMoveDestinations();
        let choice = [];
        let moveOnlyChoice = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (!achieve[i][j]) {
                    continue;
                }
                for (let k = 0; k < this.game.aliens.length; k++) {
                    if (this.game.aliens[k].ifAttackable(new Coords(i, j))) {
                        continue;
                    }
                }
                let tcd = new Coords(i, j);
                moveOnlyChoice.push(tcd);
                for (let k = 1; k < 5; k++) {
                    this.atkIntention = k;
                    let atkPos = this.getAttackPos(tcd);
                    if (atkPos.x >= 0 && atkPos.y >= 0 && atkPos.x < 8 && atkPos.y < 8) {
                        if (!(this.game.board[i][j] instanceof Alien)) {
                            let tc = [i, j, k];
                            choice.push(tc);
                        }
                    }
                }
                this.atkIntention = -1;
            }
        }
        if (choice.length != 0) {
            const rand = Math.ceil(Math.random() * choice.length);
            this.atkIntention = choice[rand][2];
            this.moveTo(new Coords(choice[rand][0], choice[rand][1]));
        }
        else if (moveOnlyChoice.length != 0) {
            const rand = Math.ceil(Math.random() * moveOnlyChoice.length);
            this.moveTo(moveOnlyChoice[rand]);
        }
    }
    // 怪物攻击
    attack() {
    }
}
