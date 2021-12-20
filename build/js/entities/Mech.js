/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
import { Coords } from './Coords';
import TextureKeys from '../consts/TextureKeys';
import MechProperties from '../consts/MechProperties';
import UnitProperties from '../consts/UnitProperties';
export class Mech extends Unit {
    constructor(game, coords, sprite, maxAp, atkRange, hp, maxHp, movesLeft = 1) {
        super(game, coords, sprite, maxAp, atkRange, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.maxAp = maxAp;
        this.atkRange = atkRange;
        this.hp = hp;
        this.maxHp = maxHp;
        this.movesLeft = movesLeft;
    }
    onClick() {
        if (this.game.isPlayerTurn && this.hp > 0) {
            if (this.game.possibleMoveDestinations.length === 0) {
                this.showPossibleMoveDestinations();
                this.game.possibleMoveDestinationsShowerMech = this;
            }
            else if (this.game.possibleMoveDestinationsShowerMech !== this) {
                this.clearMoveDestinations();
                this.showPossibleMoveDestinations();
                this.game.possibleMoveDestinationsShowerMech = this;
            }
            else {
                this.clearMoveDestinations();
                this.game.possibleMoveDestinationsShowerMech = null;
            }
        }
    }
    spriteLink() {
        // Show/clear move destinations on touch
        this.sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.onClick();
        });
    }
    static newUnit(game, coords) {
        const sprite = Mech.getSprite(game, coords);
        return new Mech(game, coords, sprite, MechProperties.TankMaxAp, MechProperties.TankAtkRange, MechProperties.TankMaxHp, MechProperties.TankMaxHp);
    }
    static getSprite(game, coords) {
        const mechSprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.MechTankA)
            .setOrigin(0.5, 0.5)
            .setScale(game._scale, game._scale)
            .setInteractive();
        mechSprite.anims.play(`mech-normal`);
        return mechSprite;
    }
    clearMoveDestinations() {
        this.game.possibleMoveDestinations.map(item => item.destroy());
        // The following approach is too heavy-weight according to ESLint
        // for (const destinationGrid of this.possibleMoveDestinations) {
        //   destinationGrid.destroy();
        // }
        // We should avoid using for-in or for-of loops
        this.game.possibleMoveDestinations = [];
    }
    showPossibleMoveDestinations() {
        if (this.movesLeft < 1) {
            return;
        }
        this.clearMoveDestinations();
        const reachMat = this.findPossibleMoveDestinations();
        for (let i = 0; i < this.game.BOARD_SIZE; i++) {
            for (let j = 0; j < this.game.BOARD_SIZE; j++) {
                if (reachMat[i][j]) {
                    const x = this.game.boardWXCoords[i][j][0];
                    const y = this.game.boardWXCoords[i][j][1];
                    const grid = this.game.add.image(x, y, TextureKeys.ReachableGrid)
                        .setOrigin(0.5, 0.5)
                        .setInteractive();
                    this.game.possibleMoveDestinations.push(grid);
                    grid.on(Phaser.Input.Events.POINTER_DOWN, () => {
                        this.game.isPlayerTurn = false;
                        this.moveTo(new Coords(i, j));
                        this.game.time.addEvent({
                            callback: () => {
                                this.game.isPlayerTurn = true;
                            },
                            delay: UnitProperties.MoveDelay * 12,
                            callbackScope: this,
                            repeat: 0
                        });
                    });
                }
            }
        }
    }
    moveTo(des_coords) {
        if (this.movesLeft <= 0) {
            return;
        }
        this.clearMoveDestinations();
        super.moveTo(des_coords);
        // decrease movesLeft of this mech
        this.movesLeft -= 1;
    }
    refreshState() {
        this.movesLeft = 1;
    }
    dead() {
        this.game.dead(this);
    }
    copySprite() {
        return Mech.getSprite(this.game, this.coords);
    }
}
