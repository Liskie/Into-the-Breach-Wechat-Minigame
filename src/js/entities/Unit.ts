// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-cycle
import Game from '../scenes/Game';

import { Coords } from './Coords';

export class Unit {
  constructor(
    public game: Game,
    public coords: Coords,
    public sprite: Phaser.Physics.Arcade.Sprite,
    public max_ap: number,
    public atk_range: number,
    public hp: number,
    public max_hp: number
  ) {
    this.coords = coords;
    this.sprite = sprite;
    this.max_ap = max_ap;
    this.atk_range = atk_range;
    this.hp = hp;
    this.max_hp = max_hp;
  }

  findPossibleMoveDestinations() {

  }

  move(des_coords: Coords) {
    this.coords = des_coords;
  }

  attack(target: Unit) {
    target.hp -= 1;
  }

  refresh() {
  }
}
