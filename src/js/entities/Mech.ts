import { Unit } from './Unit';
import { Coords } from './Coords';
import Game from '../scenes/Game';
import TextureKeys from '../consts/TextureKeys';

export class Mech extends Unit {
  constructor(
    public game: Game,
    public coords: Coords,
    public sprite: Phaser.Physics.Arcade.Sprite,
    public maxAp: number,
    public atkRange: number,
    public hp: number,
    public maxHp: number
  ) {
    super(game, coords, sprite, maxAp, atkRange, hp, maxHp);
  }

  showPossibleMoveDestinations() {
    // const x = this.game.boardWXCoords[0][0][0];
    // const y = this.game.boardWXCoords[0][0][1];
    // this.game.add.image(x, y, TextureKeys.ReachableGrid).setOrigin(0.5, 0.5);

    const reachMat = this.findPossibleMoveDestinations();
    for (let i = 0; i < this.game.BOARD_SIZE; i++) {
      for (let j = 0; j < this.game.BOARD_SIZE; j++) {
        if (reachMat[i][j]) {
          const x = this.game.boardWXCoords[i][j][0];
          const y = this.game.boardWXCoords[i][j][1];
          this.game.add.image(x, y, TextureKeys.ReachableGrid)
            .setOrigin(0.5, 0.5);
        }
      }
    }
  }
}
