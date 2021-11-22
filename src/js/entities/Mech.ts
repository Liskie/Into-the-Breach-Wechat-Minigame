import { Unit } from './Unit';
import { Coords } from './Coords';
import Game from '../scenes/Game';

export class Mech extends Unit {
  constructor(
    public game: Game,
    public coords: Coords,
    public sprite: Phaser.Physics.Arcade.Sprite,
    public max_ap: number,
    public atk_range: number,
    public hp: number,
    public max_hp: number
  ) {
    super(game, coords, sprite, max_ap, atk_range, hp, max_hp);
  }
}
