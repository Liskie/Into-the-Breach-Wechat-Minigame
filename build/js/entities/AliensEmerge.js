import TextureKeys from '../consts/TextureKeys';
import { Carb } from './Aliens/Carb';
import { Mech } from './Mech';
export class AliensEmerge {
    constructor(game, coords) {
        this.game = game;
        this.coords = coords;
        this.game = game;
        this.coords = coords;
        this.sprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.EmergingIntro)
            .setOrigin(0.5, 0.5)
            .setScale(0.8, 0.8)
            .setInteractive();
        this.sprite.anims.play('emerging-intro');
        this.atkSprite = AliensEmerge.getAtkSprite(game, coords);
        this.game.time.addEvent({
            callback: () => {
                this.sprite.anims.play('emerging-normal');
                this.atkSprite.destroy(true);
            },
            delay: 1000,
            callbackScope: this,
            repeat: 0
        });
    }
    static getAtkSprite(game, coords) {
        const tsprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.EmergingAttack)
            .setOrigin(0.5, 1.2)
            .setScale(0.8, 0.8)
            .setInteractive();
        return tsprite;
    }
    tryEmerge() {
        let xCoord = this.coords.x;
        let yCoord = this.coords.y;
        if (this.game.board[xCoord][yCoord] == null) {
            this.game.aliensEmergeBoard[xCoord][yCoord] = null;
            this.sprite.destroy();
            this.sprite = Carb.getSprite(this.game, this.coords);
            this.sprite.play('carb-emerge');
            this.game.time.addEvent({
                callback: () => {
                    this.sprite.destroy();
                    this.game.board[xCoord][yCoord] = Carb.newUnit(this.game, this.coords);
                },
                delay: 1000,
                callbackScope: this,
                repeat: 0
            });
        }
        else {
            this.game.board[xCoord][yCoord].beAttacked(1);
        }
    }
    checkAtkSprite() {
        if (this.game.board[this.coords.x][this.coords.y] != null) {
            this.atkSprite = AliensEmerge.getAtkSprite(this.game, this.coords);
            this.atkSprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (this.game.board[this.coords.x][this.coords.y] instanceof Mech) {
                    this.game.board[this.coords.x][this.coords.y].onClick();
                }
            });
        }
        else {
            this.atkSprite.destroy();
        }
    }
    remove() {
        this.sprite.destroy();
        this.atkSprite.destroy();
        this.game.aliensEmergeBoard[this.coords.x][this.coords.y] = null;
    }
}
