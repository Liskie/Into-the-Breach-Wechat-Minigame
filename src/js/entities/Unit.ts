// eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-cycle
import Game from '../scenes/Game';

import { Coords } from './Coords';

export class Unit {
  constructor(
    public game: Game,
    public coords: Coords,
    public sprite: object,
    public max_ap: number,
    public atk_range: number,
    public hp: number,
    public max_hp: number) {
    this.coords = coords;
    this.sprite = sprite;
    this.max_ap = max_ap;
    this.atk_range = atk_range;
    this.hp = hp;
    this.max_hp = max_hp;
  }

  checkCoords(coords: Coords, dis: Array<Array<number>>, nowDis: number){
    if(coords.x > 7 || coords.y > 7 || coords.x < 0 || coords.y < 0){
      return false;
    }
    if(dis[coords.x][coords.y] != -1 && dis[coords.x][coords.y] <= nowDis + 1){
      return false;
    }
    if(this.game.board[coords.x][coords.x] != null){
      return false;
    }
    return true;
  }

  private dCoords: Array<Array<number>> = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  private path: Array<Array<Coords>> = new Array<Array<Coords>>();
  findPossibleMoveDestinations() {
    let res: Array<Array<boolean>> = new Array<Array<boolean>>();
    let dis: Array<Array<number>> = new Array<Array<number>>();
    for(let i = 0; i < 8; i++){
      res[i] = [];
      dis[i] = [];
      this.path[i] = [];
      for(let j = 0; j < 8; j++){
        res[i][j] = false;
        dis[i][j] = -1;
        this.path[i][j] = new Coords(-1, -1);
      }
    }
    let queue: Array<Coords> = [];
    let qstart = 0;
    let qend = 0;
    queue[0] = new Coords(this.coords.x, this.coords.y);
    for(; qstart <= qend; qstart++){
      for(let i = 0; i < 4; i++){
        let nowx:number = queue[qstart].x + this.dCoords[i][0];
        let nowy:number = queue[qstart].y + this.dCoords[i][1];
        if(this.checkCoords(new Coords(nowx, nowy), dis, dis[queue[qstart].x][queue[qstart].y])){
          qend++;
          dis[nowx][nowy] = dis[queue[qstart].x][queue[qstart].y] + 1;
          queue[qend] = new Coords(nowx, nowy);
          this.path[nowx][nowy].x = queue[qstart].x;
          this.path[nowx][nowy].y = queue[qstart].y;
        }
      }
    }
    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 8; j++){
        if(dis[i][j] <= this.max_ap){
          res[i][j] = true;
        }
      }
    }
    return res;
  }
  findPathToCoords(toCoords: Coords){
    let res: Array<Coords> = [];
    res[0] = new Coords(-1, -1);
    if(toCoords.x > 7 || toCoords.y > 7 || toCoords.x < 0 || toCoords.y < 0){
      return res;
    }
    let reachable = this.findPossibleMoveDestinations();
    if(!reachable[toCoords.x][toCoords.y]){
      return res;
    }
    let ures: Array<Coords> = [];
    let nowCoords = toCoords;
    let len:number = 0;
    while(this.path[nowCoords.x][nowCoords.y].x != -1 && this.path[nowCoords.x][nowCoords.y].y != -1){
      ures[len] = new Coords(nowCoords.x, nowCoords.y);
      nowCoords = this.path[nowCoords.x][nowCoords.y];
      len++;
    }
    for(let i = 0; i < len; i++){
      res[i] = ures[len - i - 1];
    }
    return res;
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
