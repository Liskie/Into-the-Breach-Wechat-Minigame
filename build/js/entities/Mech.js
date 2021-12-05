// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
import { Coords } from './Coords';
import TextureKeys from '../consts/TextureKeys';
export class Mech extends Unit {
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
        // Show/clear move destinations on touch
        this.sprite.on('pointerdown', () => {
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
        });
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
                    grid.on('pointerdown', () => {
                        this.moveTo(new Coords(i, j));
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
}
