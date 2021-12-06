// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
import { Coords } from './Coords';
// eslint-disable-next-line import/no-cycle
import Game from '../scenes/Game';
import TextureKeys from '../consts/TextureKeys';

export class Alien extends Unit {
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
  // 攻击意图标识
  public atkIntention: number = -1;
  // 给定当前的坐标以及目标坐标，判断按照当前的攻击意图，该怪能不能打到目标
  ifAttackable(tgtCoords : Coords){
    return false;
  }
  // 查看当前攻击目标坐标
  getAttackPos(nowCoords : Coords){
    return new Coords(-1, -1);
  }
  // 玩家动之前，怪先动，并显示攻击意图
  moveAndPrepareForAttack(){
  }
  // 怪物攻击
  attack(){
      
  }
}
