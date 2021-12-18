import { Unit } from './Unit';
export class Building extends Unit {
    constructor(game, coords, sprite, hp, maxHp, ruinFlag = false) {
        // super(game, coords, sprite, hp, maxHp);
        super(game, coords, sprite, 0, 0, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.hp = hp;
        this.maxHp = maxHp;
        this.ruinFlag = ruinFlag;
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.hp = hp;
        this.maxHp = maxHp;
        this.ruinFlag = ruinFlag;
    }
    dead() {
        this.game.dead(this);
    }
}
