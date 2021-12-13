export class Building {
    constructor(game, coords, sprite, hp, maxHp, ruinFlag = false) {
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.hp = hp;
        this.maxHp = maxHp;
        this.ruinFlag = ruinFlag;
        // super(game, coords, sprite, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.hp = hp;
        this.maxHp = maxHp;
        this.ruinFlag = ruinFlag;
    }
}
