import Game from '../scenes/Game';

import { Coords } from './Coords';
import TextureKeys from '../consts/TextureKeys';
import { Unit } from './Unit';
import { Carb } from './Aliens/Carb';
import { Mech } from './Mech';
import { Alien } from './Alien';

export class AliensEmerge extends Unit {
    constructor(
        public game: Game,
        public coords: Coords
      ) {
        super(game, coords, AliensEmerge.getSprite(game, coords, false) , 1, 1, 1, 1);
        this.setAct(true);
        this.spriteAtk = AliensEmerge.getSpriteAtk(game, coords);
        this.game.time.addEvent({
          callback: () => {
            this.sprite.anims.play('emerging-normal');
            this.spriteAtk.destroy(true);
            this.setAct(false);
            this.normalSign = true;
          },
          delay: 1000, // ms
          callbackScope: this,
          repeat: 0
        });
        this.spriteBox = game.getEmptySprite(coords);
        this.spriteBox.destroy();
      }
    static getSpriteAtk(game: Game, coords: Coords){
      const tsprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.EmergingAttack)
        .setOrigin(0.5, 1.2)
        .setScale(0.8, 0.8)
        .setInteractive();
      tsprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
        if(game.board[coords.x][coords.y] instanceof Mech){
          game.board[coords.x][coords.y]?.onClick();
        }
      });
      return tsprite;
    }
    public normalSign: boolean = false;
    static getSprite(game: Game, coords: Coords, normalSign: boolean){
      let ret = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.EmergingIntro)
        .setOrigin(0.5, 0.5)
        .setScale(0.8, 0.8)
        .setInteractive()
      if(normalSign){
        ret.anims.play('emerging-normal');
        return ret
      }
      else{
        ret.anims.play('emerging-intro');
        return ret
      }
    }
    
    public spriteAtk: Phaser.Physics.Arcade.Image;
    public spriteBox: Phaser.Physics.Arcade.Image;
    tryEmerge(){
      this.setAct(true);
      let xCoord = this.coords.x;
      let yCoord = this.coords.y;
      if(this.game.board[xCoord][yCoord] == null){
        this.game.aliensEmergeBoard[xCoord][yCoord] = null;
        this.sprite.destroy();
        this.sprite = Carb.getSprite(this.game, this.coords);
        this.sprite.play('carb-emerge');
        this.game.time.addEvent({
          callback: () => {
            this.sprite.destroy();
            this.game.board[xCoord][yCoord] = Carb.newUnit(this.game, this.coords);
            this.setAct(false);
          },
          delay: 1000, // ms
          callbackScope: this,
          repeat: 0
        });
      }
      else{
        (<Unit>this.game.board[xCoord][yCoord]).beAttacked(1);
        (<Unit>this.game.board[xCoord][yCoord]).refreshSprite();
        this.spriteAtk.destroy();
        this.spriteAtk = AliensEmerge.getSpriteAtk(this.game, this.coords);
        const wxCoords = this.game.boardWXCoords[xCoord][yCoord];
        this.spriteAtk.setScale(1.2, 1.2);
        this.spriteAtk.setPosition(wxCoords[0], wxCoords[1] + 2);
        let i = 0;
        this.game.time.addEvent({
          callback: () => {
            i++;
            if(i % 2 == 1){
              this.spriteAtk.setPosition(wxCoords[0], wxCoords[1]);
            }
            else{
              this.spriteAtk.setPosition(wxCoords[0], wxCoords[1] + 2);
            }
            if(i == 5){
              this.setAct(false);
              this.spriteAtk.setScale(0.8, 0.8);
            }
          },
          delay: 200, // ms
          callbackScope: this,
          repeat: 4
        });
      }
    }
  checkSpriteAtk(){
    if(this.game.board[this.coords.x][this.coords.y] != null){
      this.spriteBox = Alien.getSpriteBox(this.game, this.coords);
      this.spriteAtk = AliensEmerge.getSpriteAtk(this.game, this.coords);
    }
    else{
      this.spriteAtk.destroy();
      this.spriteBox.destroy();
    }
  }
  remove(){
    this.sprite.destroy();
    this.spriteAtk.destroy();
    this.setAct(false);
    this.game.aliensEmergeBoard[this.coords.x][this.coords.y] = null;
  }
  copySprite(): Phaser.Physics.Arcade.Sprite {
    return AliensEmerge.getSprite(this.game, this.coords, this.normalSign);
  }
}