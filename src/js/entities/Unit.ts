/* eslint-disable linebreak-style */
// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-cycle
import Game from '../scenes/Game';

import { Coords } from './Coords';
import UnitProperties from '../consts/UnitProperties';

export class Unit {
  constructor(
    public game: Game,
    public coords: Coords,
    public sprite: Phaser.Physics.Arcade.Sprite,
    public maxAp: number,
    public atkRange: number,
    public hp: number,
    public maxHp: number
  ) {
    this.game = game;
    this.coords = coords;
    this.sprite = sprite;
    this.maxAp = maxAp;
    this.atkRange = atkRange;
    this.hp = hp;
    this.maxHp = maxHp;
    this.spriteLink();
  }

  spriteLink(){
  }
  checkCoords(coords: Coords, dis: Array<Array<number>>, nowDis: number) {
    if (coords.x > 7 || coords.y > 7 || coords.x < 0 || coords.y < 0) {
      return false;
    }
    if (dis[coords.x][coords.y] !== -1 && dis[coords.x][coords.y] <= nowDis + 1) {
      return false;
    }
    return this.game.board[coords.x][coords.y] == null;
  }

  private dCoords: Array<Array<number>> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  private path: Array<Array<Coords>> = new Array<Array<Coords>>();
  findPossibleMoveDestinations() {
    /**
     * @return res: Array<Array<boolean>> Reachability matrix of current unit.
     */
    const res: Array<Array<boolean>> = new Array<Array<boolean>>();
    const dis: Array<Array<number>> = new Array<Array<number>>();
    for (let i = 0; i < 8; i++) {
      res[i] = [];
      dis[i] = [];
      this.path[i] = [];
      for (let j = 0; j < 8; j++) {
        res[i][j] = false;
        dis[i][j] = -1;
        this.path[i][j] = new Coords(-1, -1);
      }
    }
    dis[this.coords.x][this.coords.y] = 0;
    const queue: Array<Coords> = [];
    let qstart = 0;
    let qend = 0;
    queue[0] = new Coords(this.coords.x, this.coords.y);
    for (; qstart <= qend; qstart++) {
      for (let i = 0; i < 4; i++) {
        const nowx:number = queue[qstart].x + this.dCoords[i][0];
        const nowy:number = queue[qstart].y + this.dCoords[i][1];
        if (this.checkCoords(new Coords(nowx, nowy), dis, dis[queue[qstart].x][queue[qstart].y])) {
          qend++;
          dis[nowx][nowy] = dis[queue[qstart].x][queue[qstart].y] + 1;
          queue[qend] = new Coords(nowx, nowy);
          this.path[nowx][nowy].x = queue[qstart].x;
          this.path[nowx][nowy].y = queue[qstart].y;
        }
      }
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (dis[i][j] <= this.maxAp && dis[i][j] !== -1) {
          res[i][j] = true;
        }
      }
    }
    res[this.coords.x][this.coords.y] = false;
    return res;
  }

  findPathToCoords(toCoords: Coords) {
    /**
     * @params toCoords: Coords Coords of the destination tile.
     * @return res: Array<Coords> Coords of the block on the path to the destination tile.
     */
    const res: Array<Coords> = [];
    res[0] = new Coords(-1, -1);
    if (toCoords.x > 7 || toCoords.y > 7 || toCoords.x < 0 || toCoords.y < 0) {
      return res;
    }
    const reachable = this.findPossibleMoveDestinations();
    if (!reachable[toCoords.x][toCoords.y]) {
      return res;
    }
    const ures: Array<Coords> = [];
    let nowCoords = toCoords;
    let len:number = 0;
    while (this.path[nowCoords.x][nowCoords.y].x !== -1 && this.path[nowCoords.x][nowCoords.y].y !== -1) {
      ures[len] = new Coords(nowCoords.x, nowCoords.y);
      nowCoords = this.path[nowCoords.x][nowCoords.y];
      len++;
    }
    for (let i = 0; i < len; i++) {
      res[i] = ures[len - i - 1];
    }
    return res;
  }

  copySprite(){
    return this.sprite;
  }

  moveTo(des_coords: Coords) {
    const path = this.findPathToCoords(des_coords);
    // There seems no implementation of sleep() in Phaser, so we have to try another approach
    // for (let i = 0; i < path.length; i++) {
    //   this.moveStepTo(path[i]);
    //   sleep(20);
    // }
    
    let i = 0;
    if(this.game.aliensEmergeBoard[path[i].x][path[i].y] != null){
      this.sprite.destroy(true);
      this.sprite = this.copySprite();
      this.spriteLink();
    }
    let oldCoords = this.coords;
    this.moveStepTo(path[i]);
    i++;
    if(this.game.aliensEmergeBoard[oldCoords.x][oldCoords.y] != null){
      this.game.aliensEmergeBoard[oldCoords.x][oldCoords.y]?.checkAtkSprite();
    }
    this.game.time.addEvent({
      delay: UnitProperties.MoveDelay, // ms
      callback: () => {
        if(i != path.length){
          if(this.game.aliensEmergeBoard[path[i].x][path[i].y] != null){
            this.sprite.destroy(true);
            this.sprite = this.copySprite();
            this.spriteLink();
          }
          this.moveStepTo(path[i]);
          i += 1;
        }
        else{
          if(this.game.aliensEmergeBoard[this.coords.x][this.coords.y] != null){
            this.game.aliensEmergeBoard[this.coords.x][this.coords.y]?.checkAtkSprite();
          }
        }
      },
      callbackScope: this,
      repeat: path.length - 1
    });
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
  }

  dead(){
    this.game.board[this.coords.x][this.coords.y] = null;
  }
  beAttacked(damage: number){
    this.hp -= damage;
    if(this.hp <= 0){
      this.dead();
    }
  }
  attack(target: Unit) {
    target.beAttacked(1);
  }
  pushed(dtCoords: Coords){
    const tgtCoords = new Coords(this.coords.x + dtCoords.x, this.coords.y + dtCoords.y);
    if(tgtCoords.x > 7 || tgtCoords.y > 7 || tgtCoords.x < 0 || tgtCoords.y < 0){
      return;
    }
    if(this.game.board[tgtCoords.x][tgtCoords.y] == null){
      this.moveTo(tgtCoords);
      return;
    }
    else{
      this.beAttacked(1);
      if (this.game.board[tgtCoords.x][tgtCoords.x] instanceof Unit){
        (<Unit>this.game.board[tgtCoords.x][tgtCoords.x]).beAttacked(1);
      }
      else{
        
      }
    }
  }

  refreshState() {
  }
}
