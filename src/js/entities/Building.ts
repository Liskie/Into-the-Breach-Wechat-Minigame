// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-cycle
import Game from '../scenes/Game';
import { Unit } from './Unit';

import { Coords } from './Coords';

export class Building extends Unit {
  constructor(
    public game: Game,
    public coords: Coords,
    public sprite: Phaser.Physics.Arcade.Sprite,
    public hp: number,
    public maxHp: number,
    public ruinFlag: boolean = false,
  ) {
    // super(game, coords, sprite, hp, maxHp);
    super(game, coords, sprite, 0, 0, hp, maxHp);
    this.game = game;
    this.coords = coords;
    this.sprite = sprite;
    this.hp = hp;
    this.maxHp = maxHp;
    this.ruinFlag = ruinFlag;
  }
  dead(){
    this.game.dead(this);
  }
}
