/* eslint-disable linebreak-style */
// eslint-disable-next-line import/no-cycle
import { Unit } from './Unit';
import { Coords } from './Coords';
import TextureKeys from '../consts/TextureKeys';
import MechProperties from '../consts/MechProperties';
import UnitProperties from '../consts/UnitProperties';
import Colors from '../consts/Colors';
// eslint-disable-next-line import/no-cycle
import { Shot } from './Shot';
export class Mech extends Unit {
    constructor(game, coords, sprite, maxAp, atkRange, hp, maxHp, pilotKey, attacksLeft = 1, movesLeft = 1) {
        super(game, coords, sprite, maxAp, atkRange, hp, maxHp);
        this.game = game;
        this.coords = coords;
        this.sprite = sprite;
        this.maxAp = maxAp;
        this.atkRange = atkRange;
        this.hp = hp;
        this.maxHp = maxHp;
        this.pilotKey = pilotKey;
        this.attacksLeft = attacksLeft;
        this.movesLeft = movesLeft;
        this.shootDirectionIndex = -1;
    }
    onClick() {
        // Check if this is alive
        if (this.hp <= 0 || !this.game.isPlayerTurn) {
            return;
        }
        // Highlight
        for (let i = 0; i < this.game.mechs.length; i++) {
            this.game.mechs[i].setAct(false);
        }
        if (this.active) {
            this.setAct(false);
        }
        else {
            this.setAct(true);
        }
        // Select
        if (this.game.selectedMech == this) {
            this.game.selectedMech = null;
        }
        else {
            this.game.selectedMech = this;
        }
        // Move destinations
        if (this.game.isPlayerTurn && this.hp > 0) {
            if (this.game.possibleMoveDestinations.length === 0) {
                this.showPossibleMoveDestinations();
                this.game.possibleMoveDestinationsShowerMech = this;
            }
            else if (this.game.possibleMoveDestinationsShowerMech !== this) {
                this.clearMoveDestinations();
                this.showPossibleMoveDestinations();
                this.game.possibleMoveDestinationsShowerMech = this;
            }
            else {
                this.clearMoveDestinations();
                this.game.possibleMoveDestinationsShowerMech = null;
            }
        }
        // Attack destinations
        if (this.game.isPlayerTurn) {
            this.clearAttackDestination();
        }
        // Pilot portrait and weapons in the left-bottm corner
        if (this.game.currentPilotKey == null) {
            // Change pilot background color
            this.game.pilotBackgrounds.forEach((v) => { v.setFillStyle(Colors.MainPurple); });
            this.game.pilotBackgrounds.get(this.pilotKey).setFillStyle(Colors.BrightYellow);
            // Draw portrait and weapons in the left-bottom corner
            this.game.drawPortraitAndAttackBtn(this.pilotKey);
        }
        else if (this.game.currentPilotKey == this.pilotKey) {
            this.game.pilotBackgrounds.get(this.pilotKey).setFillStyle(Colors.MainPurple);
            if (this.game.currentPortraitAndAtkBtns != null) {
                this.game.currentPortraitAndAtkBtns.destroy(true);
            }
            this.game.currentPilotKey = null;
        }
        else {
            // Change pilot background color
            this.game.pilotBackgrounds.forEach((v) => { v.setFillStyle(Colors.MainPurple); });
            this.game.pilotBackgrounds.get(this.pilotKey).setFillStyle(Colors.BrightYellow);
            // Draw portrait and weapons in the left-bottom corner
            if (this.game.currentPortraitAndAtkBtns) {
                this.game.currentPortraitAndAtkBtns.destroy(true);
            }
            this.game.drawPortraitAndAttackBtn(this.pilotKey);
        }
    }
    spriteLink() {
        // Show/clear move destinations on touch
        this.sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.onClick();
        });
    }
    static newUnit(game, coords, pilotKey) {
        const sprite = Mech.getSprite(game, coords);
        return new Mech(game, coords, sprite, MechProperties.TankMaxAp, MechProperties.TankAtkRange, MechProperties.TankMaxHp, MechProperties.TankMaxHp, pilotKey);
    }
    static getSprite(game, coords) {
        const mechSprite = game.physics.add.sprite(game.boardWXCoords[coords.x][coords.y][0], game.boardWXCoords[coords.x][coords.y][1], TextureKeys.MechTankA)
            .setOrigin(0.5, 0.5)
            .setScale(game._scale, game._scale)
            .setInteractive();
        mechSprite.anims.play('mech-normal');
        return mechSprite;
    }
    clearMoveDestinations() {
        this.game.possibleMoveDestinations.map(item => item.destroy());
        // The following approach is too heavy-weight according to ESLint
        // for (const destinationGrid of this.possibleMoveDestinations) {
        //   destinationGrid.destroy();
        // }
        // We should avoid using for-in or for-of loops
        this.game.possibleMoveDestinations = [];
    }
    showPossibleMoveDestinations() {
        if (this.movesLeft < 1) {
            return;
        }
        this.clearMoveDestinations();
        const reachMat = this.findPossibleMoveDestinations();
        for (let i = 0; i < this.game.BOARD_SIZE; i++) {
            for (let j = 0; j < this.game.BOARD_SIZE; j++) {
                if (reachMat[i][j]) {
                    const x = this.game.boardWXCoords[i][j][0];
                    const y = this.game.boardWXCoords[i][j][1];
                    const grid = this.game.add.image(x, y, TextureKeys.ReachableGrid)
                        .setOrigin(0.5, 0.5)
                        .setInteractive();
                    this.game.possibleMoveDestinations.push(grid);
                    grid.on(Phaser.Input.Events.POINTER_DOWN, () => {
                        this.game.isPlayerTurn = false;
                        this.moveTo(new Coords(i, j));
                        this.game.time.addEvent({
                            callback: () => {
                                this.game.isPlayerTurn = true;
                            },
                            delay: UnitProperties.MoveDelay * 8,
                            callbackScope: this,
                            repeat: 0
                        });
                    });
                }
            }
        }
    }
    clearAttackDestination() {
        this.game.possibleAttackDestinations.map(item => item.destroy());
        this.game.possibleAttackDestinations = [];
    }
    findPossibleAttackDestinations() {
        const attackMat = [];
        for (let i = 0; i < this.game.BOARD_SIZE; i++) {
            const tempo = [];
            for (let j = 0; j < this.game.BOARD_SIZE; j++) {
                tempo.push(false);
            }
            attackMat.push(tempo);
        }
        // North
        for (let i = this.coords.x - 1; i >= 0; i--) {
            if (this.game.board[i][this.coords.y] == null) {
                attackMat[i][this.coords.y] = true;
            }
            else if (this.game.board[i][this.coords.y] instanceof Unit) {
                attackMat[i][this.coords.y] = true;
                break;
            }
        }
        // South
        for (let i = this.coords.x + 1; i < this.game.BOARD_SIZE; i++) {
            if (this.game.board[i][this.coords.y] == null) {
                attackMat[i][this.coords.y] = true;
            }
            else if (this.game.board[i][this.coords.y] instanceof Unit) {
                attackMat[i][this.coords.y] = true;
                break;
            }
        }
        // West
        for (let j = this.coords.y - 1; j >= 0; j--) {
            if (this.game.board[this.coords.x][j] == null) {
                attackMat[this.coords.x][j] = true;
            }
            else if (this.game.board[this.coords.x][j] instanceof Unit) {
                attackMat[this.coords.x][j] = true;
                break;
            }
        }
        // East
        for (let j = this.coords.y + 1; j < this.game.BOARD_SIZE; j++) {
            if (this.game.board[this.coords.x][j] == null) {
                attackMat[this.coords.x][j] = true;
            }
            else if (this.game.board[this.coords.x][j] instanceof Unit) {
                attackMat[this.coords.x][j] = true;
                break;
            }
        }
        return attackMat;
    }
    showPossibleAttackDestinations() {
        if (this.attacksLeft <= 0) {
            return;
        }
        this.clearMoveDestinations();
        const attackMat = this.findPossibleAttackDestinations();
        for (let i = 0; i < this.game.BOARD_SIZE; i++) {
            for (let j = 0; j < this.game.BOARD_SIZE; j++) {
                if (attackMat[i][j]) {
                    const x = this.game.boardWXCoords[i][j][0];
                    const y = this.game.boardWXCoords[i][j][1];
                    const grid = this.game.add.image(x, y, TextureKeys.AttackableGrid)
                        .setOrigin(0.5, 0.5)
                        .setInteractive();
                    this.game.possibleAttackDestinations.push(grid);
                    grid.on(Phaser.Input.Events.POINTER_UP, () => {
                        this.game.isPlayerTurn = false;
                        this.attackOnClick(new Coords(i, j));
                        this.game.time.addEvent({
                            callback: () => {
                                this.game.isPlayerTurn = true;
                            },
                            delay: UnitProperties.ShotDelay * 8,
                            callbackScope: this,
                            repeat: 0
                        });
                    });
                }
            }
        }
    }
    attackOnClick(clickCoords) {
        if (this.hp <= 0 || this.attacksLeft <= 0) {
            return;
        }
        this.attacksLeft -= 1;
        const attackMat = this.findPossibleAttackDestinations();
        let attackTargetCoords;
        let shootDirectionIndex = 0;
        if (clickCoords.x < this.coords.x) {
            // North
            let lastCoords;
            for (let i = clickCoords.x; i >= 0; i--) {
                if (attackMat[i][clickCoords.y]) {
                    lastCoords = new Coords(i, clickCoords.y);
                }
                else {
                    break;
                }
            }
            attackTargetCoords = lastCoords;
            shootDirectionIndex = 3;
        }
        else if (clickCoords.x > this.coords.x) {
            // South
            let lastCoords;
            for (let i = clickCoords.x; i < this.game.BOARD_SIZE; i++) {
                if (attackMat[i][clickCoords.y]) {
                    lastCoords = new Coords(i, clickCoords.y);
                }
                else {
                    break;
                }
            }
            attackTargetCoords = lastCoords;
            shootDirectionIndex = 4;
        }
        else if (clickCoords.y < this.coords.y) {
            // West
            let lastCoords;
            for (let j = clickCoords.y; j >= 0; j--) {
                if (attackMat[clickCoords.x][j]) {
                    lastCoords = new Coords(clickCoords.x, j);
                }
                else {
                    break;
                }
            }
            attackTargetCoords = lastCoords;
            shootDirectionIndex = 1;
        }
        else if (clickCoords.y > this.coords.y) {
            // East
            let lastCoords;
            for (let j = clickCoords.y; j < this.game.BOARD_SIZE; j++) {
                if (attackMat[clickCoords.x][j]) {
                    lastCoords = new Coords(clickCoords.x, j);
                }
                else {
                    break;
                }
            }
            attackTargetCoords = lastCoords;
            shootDirectionIndex = 2;
        }
        this.game.isPlayerTurn = false;
        this.shootDirectionIndex = shootDirectionIndex;
        const shot = new Shot(this.game, this, this.findShotPath(attackTargetCoords), shootDirectionIndex);
        this.clearAttackDestination();
        this.game.selectedMech = null;
        this.game.time.addEvent({
            callback: () => {
                this.game.isPlayerTurn = true;
            },
            delay: UnitProperties.ShotDelay * 10 + 300,
            callbackScope: this,
            repeat: 0
        });
    }
    realAttack(tgt) {
        tgt.pushed(this.shootDirectionIndex);
        tgt.beAttacked(1);
    }
    findShotPath(desCoords) {
        const shotPath = [];
        if (desCoords.x < this.coords.x) {
            // North
            for (let i = this.coords.x; i >= desCoords.x; i--) {
                shotPath.push(new Coords(i, this.coords.y));
            }
        }
        else if (desCoords.x > this.coords.x) {
            // South
            for (let i = this.coords.x; i <= desCoords.x; i++) {
                shotPath.push(new Coords(i, this.coords.y));
            }
        }
        else if (desCoords.y < this.coords.y) {
            // West
            for (let j = this.coords.y; j >= desCoords.y; j--) {
                shotPath.push(new Coords(this.coords.x, j));
            }
        }
        else if (desCoords.y > this.coords.y) {
            // East
            for (let j = this.coords.y; j <= desCoords.y; j++) {
                shotPath.push(new Coords(this.coords.x, j));
            }
        }
        return shotPath;
    }
    moveTo(des_coords) {
        if (this.movesLeft <= 0) {
            return;
        }
        this.clearMoveDestinations();
        super.moveTo(des_coords);
        // decrease movesLeft of this mech
        this.movesLeft -= 1;
    }
    refreshState() {
        this.movesLeft = 1;
        this.attacksLeft = 1;
    }
    beAttacked(damage) {
        super.beAttacked(damage);
        this.updateHpBar();
    }
    updateHpBar() {
        this.game.mechHpBars.get(this.pilotKey).forEach((value, key) => {
            if (key <= this.hp) {
                if (this.hp == 1) {
                    value.setFillStyle(Colors.BrightRed);
                }
                else {
                    value.setFillStyle(Colors.Green);
                }
            }
            else {
                value.setFillStyle(Colors.Black);
            }
        });
    }
    repair() {
        if (this.attacksLeft <= 0) {
            return;
        }
        if (this.hp >= this.maxHp) {
            return;
        }
        this.hp += 1;
        this.attacksLeft -= 1;
        this.updateHpBar();
    }
    dead() {
        this.game.dead(this);
    }
    copySprite() {
        return Mech.getSprite(this.game, this.coords);
    }
}
