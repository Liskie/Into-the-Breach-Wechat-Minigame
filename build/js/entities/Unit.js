export class Unit {
    constructor(game, coords, sprite, max_ap, atk_range, hp, max_hp) {
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.max_ap = max_ap;
        this.atk_range = atk_range;
        this.hp = hp;
        this.max_hp = max_hp;
        this.coords = coords;
        this.sprite = sprite;
        this.max_ap = max_ap;
        this.atk_range = atk_range;
        this.hp = hp;
        this.max_hp = max_hp;
    }
    findPossibleMoveDestinations() {
    }
    move(des_coords) {
        this.coords = des_coords;
    }
    attack(target) {
        target.hp -= 1;
    }
    refresh() {
    }
}
