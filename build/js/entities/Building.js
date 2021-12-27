import { Unit } from './Unit';
import BuildingProperties from '../consts/BuildingProperties';
import TextureKeys from '../consts/TextureKeys';
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
    static newUnit(game, coords, ruinFlag) {
        const sprite = Building.getSprite(game, coords, ruinFlag, false);
        return new Building(game, coords, sprite, BuildingProperties.BuildingMaxAp, BuildingProperties.BuildingMaxAp, ruinFlag);
    }
    static getSprite(game, coords, ruinFlag, isBroken) {
        if (ruinFlag) {
            let txtk = TextureKeys.BuildingA;
            if (isBroken) {
                txtk = TextureKeys.BuildingBroken;
            }
            const buildingSprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], txtk)
                .setOrigin(0.45, 0.65)
                .setScale(BuildingProperties.buildingHScale, BuildingProperties.buildingHScale)
                .setInteractive();
            return buildingSprite;
        }
        let txtk = TextureKeys.MountainA;
        if (isBroken) {
            txtk = TextureKeys.MountainBroken;
        }
        const buildingSprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], txtk)
            .setOrigin(0.35, 0.65)
            .setScale(BuildingProperties.buildingMountainScale, BuildingProperties.buildingMountainScale)
            .setInteractive();
        return buildingSprite;
    }
    copySprite() {
        return Building.getSprite(this.game, this.coords, this.ruinFlag, this.hp == 1);
    }
    dead() {
        this.game.dead(this);
    }
    beAttacked(damage) {
        if (this.hp > 0) {
            this.hp -= damage;
            if (this.hp <= 0) {
                this.dead();
            }
            else {
                if (this.ruinFlag) {
                    this.game.gameHp -= damage;
                }
                if (this.hp == 1) {
                    this.sprite.destroy(true);
                    this.sprite = Building.getSprite(this.game, this.coords, this.ruinFlag, true);
                }
                const tsprite = this.copySprite().setAlpha(0.5).setBlendMode('ADD');
                this.game.time.addEvent({
                    callback: () => {
                        tsprite.setAlpha(0);
                        tsprite.destroy();
                    },
                    delay: 300,
                    callbackScope: this,
                    repeat: 0
                });
            }
        }
    }
}
