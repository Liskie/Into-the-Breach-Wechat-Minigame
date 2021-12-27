// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
import { Coords } from './Coords';
// eslint-disable-next-line import/no-cycle
import Game from '../scenes/Game';
import TextureKeys from '../consts/TextureKeys';
import UnitProperties from '../consts/UnitProperties';
import { Shot } from './Shot';

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
    this.spriteNumber = Alien.getSpriteNumber(game, coords, -1);
    this.spriteAtkIntention = Alien.getSpriteAtkIntention(game, coords, -1);
    this.cleanSpriteNA();
  }
  public spriteNumber: Phaser.Physics.Arcade.Sprite;
  public spriteAtkIntention: Phaser.Physics.Arcade.Sprite;
  public spriteShotPredict: Array<Phaser.Physics.Arcade.Sprite> = [];
  public showPredict: boolean = false;
  static getOneShotPredict(game: Game, coords: Coords, number: Number) {
    if (number > 1 || number < 0) {
      return game.getEmptySprite(coords);
    }

    return game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.AlienShotPredic + number.toString())
      .setOrigin(0.5, 0.5)
      .setScale(0.8, 0.8)
      .setInteractive();
  }
  static getSpriteNumber(game: Game, coords: Coords, num: number) {
    if (num > 9 || num < 0) {
      return game.getEmptySprite(coords);
    }

    return game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.Number + num.toString())
      .setOrigin(0, 0)
      .setScale(0.5, 0.5)
      .setInteractive();
  }
  static spriteShotPos = [[0, 0], [-1, -1], [1, 1], [1, -1], [-1, 1]];
  static getSpriteAtkIntention(game: Game, coords: Coords, num: number) {
    if (num > 4 || num <= 0) {
      return game.getEmptySprite(coords);
    }

    return game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.Melee + num.toString())
      .setOrigin(0.5 + 0.3 * Alien.spriteShotPos[<integer>num][0], 0.5 + 0.3 * Alien.spriteShotPos[<integer>num][1])
      .setScale(0.8, 0.8)
      .setInteractive();
  }
  static getSpriteBox(game: Game, coords: Coords) {
    const tsprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.Box)
      .setOrigin(0.5, 0.5)
      .setScale(1, 1)
      .setInteractive()
      .setAlpha(0.6);
    game.board[coords.x][coords.y]?.refreshSprite();
    return tsprite;
  }
  // 攻击意图标识
  public atkIntention: number = -1;
  // 给定目标坐标，判断按照当前的攻击意图，该怪能不能打到目标
  ifAttackable(tgtCoords : Coords) {
    return false;
  }
  // 查看当前攻击目标坐标
  getAttackPos(nowCoords : Coords) {
    return new Coords(-1, -1);
  }
  getShotRoad() {
    return <Array<Coords>>[];
  }
  // 玩家动之前，怪先动，并显示攻击意图
  moveAndPrepareForAttack() {
  }
  // 怪物攻击
  attack() {
    if (this.hp <= 0) {
      return;
    }
    this.showPredict = false;
    this.cleanSpriteNA();
    this.setAct(true);
    if (!(this.atkIntention <= 0 || this.atkIntention > 4)) {
      const atkPos = this.getAttackPos(this.coords);
      if (atkPos.x >= 0 && atkPos.y >= 0 && atkPos.x < 8 && atkPos.y < 8) {
        const shot = new Shot(this.game, this, this.getShotRoad(), this.atkIntention);
        // this.game.board[atkPos.x][atkPos.y]?.beAttacked(1);
      }
      this.atkIntention = -1;
      this.cleanShotPredict();
    }
    this.game.time.addEvent({
      callback: () => {
        this.setAct(false);
      },
      delay: UnitProperties.ShotDelay * 8, // ms
      callbackScope: this,
      repeat: 0
    });
  }
  public saveNumTmp: number = -1;
  showSpriteAfterMove(num: number) {
    this.saveNumTmp = num;
    this.spriteNumber = Alien.getSpriteNumber(this.game, this.coords, num);
    this.spriteAtkIntention = Alien.getSpriteAtkIntention(this.game, this.coords, this.atkIntention);
    this.refreshShotPredict();
    this.showPredict = true;
  }
  cleanSpriteNA() {
    this.spriteAtkIntention.destroy();
    this.spriteNumber.destroy();
  }
  refreshShotPredict() {
    for (let i = 0; i < this.spriteShotPredict.length; i++) {
      this.spriteShotPredict[i].destroy();
    }
    this.spriteShotPredict = [];
    if (this.hp > 0) {
      const road: Array<Coords> = this.getShotRoad();
      for (let i = 1; i < road.length - 1; i++) {
        if (road[i].x >= 0 && road[i].x < 8 && road[i].y >= 0 && road[i].y < 8) {
          this.spriteShotPredict.push(Alien.getOneShotPredict(this.game, road[i], this.atkIntention < 3 ? 1 : 0));
        }
      }
      const i = road.length - 1;
      if (i >= 0 && road[i].x >= 0 && road[i].x < 8 && road[i].y >= 0 && road[i].y < 8) {
        this.spriteShotPredict.push(Alien.getSpriteBox(this.game, road[i]));
      }
    }
  }
  cleanShotPredict() {
    for (let i = 0; i < this.spriteShotPredict.length; i++) {
      this.spriteShotPredict[i].destroy();
    }
    this.spriteShotPredict = [];
  }
  moveStepTo(des_coords: Coords) {
    // Remove this unit from current coords of the board
    this.game.board[this.coords.x][this.coords.y] = null;
    // Change coords of this unit
    this.coords = des_coords;
    // Add this unit into the board with new coords
    this.game.board[des_coords.x][des_coords.y] = this;
    // Move the sprite to the new coords, this ACTUALLY moves what the player sees on the board
    const wxCoords = this.game.boardWXCoords[des_coords.x][des_coords.y];
    this.sprite.setPosition(wxCoords[0], wxCoords[1]);
    this.spriteShowAct.setPosition(wxCoords[0], wxCoords[1]);
    this.spriteNumber.setPosition(wxCoords[0], wxCoords[1]);
    this.spriteAtkIntention.setPosition(wxCoords[0], wxCoords[1]);
  }
  refreshSprite() {
    super.refreshSprite();
    if (this.showPredict) {
      this.spriteNumber.destroy();
      this.spriteAtkIntention.destroy();
      this.spriteNumber = Alien.getSpriteNumber(this.game, this.coords, this.saveNumTmp);
      this.spriteAtkIntention = Alien.getSpriteAtkIntention(this.game, this.coords, this.atkIntention);
    }
  }
}
