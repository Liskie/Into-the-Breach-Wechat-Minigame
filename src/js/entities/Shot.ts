import Game from '../scenes/Game';

import { Coords } from './Coords';
import TextureKeys from '../consts/TextureKeys';
import { Unit } from './Unit';
import { Carb } from './Aliens/Carb';
import { Mech } from './Mech';
import UnitProperties from '../consts/UnitProperties';

export class Shot {
  constructor(
    public game: Game,
    public atker: Unit,
    public road: Array<Coords>,
    public intention: number
  ) {
    const sprite = road.length > 0 ? Shot.getSprite(game, road[0], ((atker instanceof Mech) ? 0 : 1), intention) : game.getEmptySprite(new Coords(0, 0));
    const sf = UnitProperties.ShotFrame;
    if (road.length > 0) {
      let ii = 1;
      game.time.addEvent({
        callback: () => {
          let i = ((ii - 1) / sf) + 1;
          i = Math.floor(i);
          if (ii != (road.length - 1) * sf) {
            if (road[i].x >= 0 && road[i].x < 8 && road[i].y >= 0 && road[i].y < 8) {
              const wxCoords1 = this.game.boardWXCoords[road[i - 1].x][road[i - 1].y];
              const wxCoords2 = this.game.boardWXCoords[road[i].x][road[i].y];
              const sche = (ii - 1) % sf + 1;
              sprite.setPosition((wxCoords1[0] * (sf - sche) + wxCoords2[0] * sche) * 1.0 / sf, (wxCoords1[1] * (sf - sche) + wxCoords2[1] * sche) * 1.0 / sf);
            }
            ii++;
          } else {
            sprite.destroy();
            if (game.board[road[road.length - 1].x][road[road.length - 1].y] != null) {
              atker.realAttack(<Unit>game.board[road[road.length - 1].x][road[road.length - 1].y]);
            }
          }
        },
        delay: UnitProperties.ShotDelay / sf, // ms
        callbackScope: this,
        repeat: (road.length - 1) * sf - 1
      });
    }
  }
  static getSprite(game: Game, coords: Coords, type: number, intention: number) {
    if (intention <= 0 || intention > 4 || type < 0 || type > 1) {
      return game.getEmptySprite(coords);
    }
    if (type == 0) {
      return game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.MechTankShot + (1 - (intention % 2)).toString())
        .setOrigin(0.5, 0.5)
        .setScale(1 * (intention <= 2 ? 1 : -1), 1)
        .setInteractive();
    }

    return game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.CarbShot + (1 - (intention % 2)).toString())
      .setOrigin(0.5, 0.5)
      .setScale(1 * (intention <= 2 ? 1 : -1), 1)
      .setInteractive();
  }
}
