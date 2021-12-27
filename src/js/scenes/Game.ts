import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
// eslint-disable-next-line import/no-cycle
import { Unit } from '../entities/Unit';
// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates
import { getScale, screenHeight as height, screenWidth as width } from '../utils/index';
// eslint-disable-next-line import/no-cycle
import { Mech } from '../entities/Mech';
// eslint-disable-next-line import/no-cycle
import { Alien } from '../entities/Alien';
// eslint-disable-next-line import/no-cycle
import { AliensEmerge } from '../entities/AliensEmerge';
// eslint-disable-next-line import/no-cycle
import { Carb } from '../entities/Aliens/Carb';
import { Coords } from '../entities/Coords';
import LevelProperties from '../consts/LevelProperties';
import LevelKeys from '../consts/LevelKeys';
// eslint-disable-next-line import/no-cycle
import { Building } from '../entities/Building';
import UnitProperties from '../consts/UnitProperties';
import TextureProperties from '../consts/TextureProperties';
import MechProperties from '../consts/MechProperties';
import Colors from '../consts/Colors';

export default class Game extends Phaser.Scene {
  public _scale!: number;
  // 二维地图的索引
  public map: Array<Array<number>> = new Array<Array<number>>();
  // 二维地图对应的方格
  private mapBlock: Array<Phaser.GameObjects.Image> = new Array<Phaser.GameObjects.Image>();
  // 血条
  private bloodBg!: Phaser.GameObjects.Image;
  // 第几回合成功
  private successBg!: Phaser.GameObjects.Image;
  // 结束回合
  private ExitGameLabel!: Phaser.GameObjects.Text;
  // 游戏时间
  private gameTimeLabel!: Phaser.GameObjects.Text;
  private gameTime = new Date().getTime();
  // 游戏轮数面板
  private gameTurnLabel!: Phaser.GameObjects.Text;
  // 游戏轮数
  private Turn: number = 5;
  private dotoX: number = 40;
  // 剩余血量
  private bloodNum: number = 4;

  // board that contains the units
  public BOARD_SIZE = 8;
  public board: Array<Array<Unit | null>> = new Array<Array<Unit | null>>();
  public boardWXCoords: Array<Array<Array<number>>> = [];
  // mechs
  public mechs: Array<Mech> = [];
  public selectedMech!: Mech | null;
  public possibleMoveDestinations: Array<Phaser.GameObjects.Image> = [];
  public possibleMoveDestinationsShowerMech: Mech | null = null;
  public possibleAttackDestinations: Array<Phaser.GameObjects.Image> = [];
  // aliens
  public aliens: Array<Carb> = [];
  public aliensEmergeBoard: Array<Array<AliensEmerge | null>> = new Array<Array<AliensEmerge | null>>();
  public aliensEmerges: Array<AliensEmerge> = new Array<AliensEmerge>();
  // buildings
  public showerBuilding: Mech | null = null;
  // portraits and status
  public pilotKeys = [TextureKeys.PilotLeader, TextureKeys.PilotGenius, TextureKeys.PilotHotshot];
  public pilotBackgrounds = new Map();
  public currentPilotKey!: string | null;
  public currentPortraitAndAtkBtns!: Phaser.GameObjects.Group | null;
  public mechHpBars = new Map();

  constructor() {
    // 注册场景名称
    super(SceneKeys.Game);
  }

  public cntEmerges: number = 0;
  public cntAliens: number = 0;
  public gameHp: number = UnitProperties.GameHp;
  static isGameWin: boolean = false;
  static totalScore: number = 0;
  public isGameEnd: boolean = false;
  public cntAlienKill = 0;
  public cntPlayer = 3;

  create() {
    this.creatAnims();
    // 设置游戏背景色

    // this.setBackgroundColor();
    this.drawBackground();
    this.drawButton();
    this.buttonEvent();
    this.drawTime();
    this.drawTurn();
    // this.drawPortraitAndAttackBtn();
    // 先屏蔽绘制进度的
    // this.drawbloodEvent(1);

    // Board init
    this.createBoard();
    this.createMechs();
    this.createAliens();
    this.createBuilding();

    this.drawMechStatusList();

    // First turn
    this.alienMove();
    this.cntAliens = 3;
    this.time.addEvent({
      callback: () => {
        this.addAlienEmergePos();
      },
      delay: 3 * UnitProperties.MoveDelay * 6, // ms
      callbackScope: this,
      repeat: 0
    });
    this.cntEmerges = 2;
    this.time.addEvent({
      callback: () => {
        this.showEnvEffects();
      },
      delay: 3 * UnitProperties.MoveDelay * 6 + 2 * 1200, // ms
      callbackScope: this,
      repeat: 0
    });
    this.time.addEvent({
      callback: () => {
        this.playerMoveAndAttack();
      },
      delay: 3 * UnitProperties.MoveDelay * 6 + 2 * 1200 + 0, // ms
      callbackScope: this,
      repeat: 0
    });
  }

  update() {
    if (!this.isGameEnd) {
      if (this.Turn >= 0) {
        this.gameTurnLabel.setText(this.Turn.toString());
      }
      this.gameTimeLabel.setText(this.intoTime());
    }
  }

  drawBackground() {
    this._scale = getScale(width, height);
    const bloodScaling = 0.25;
    const bloodBgWidth = 1190 * bloodScaling * this._scale;
    const bloodBgHight = 304 * bloodScaling * this._scale;
    this.bloodBg = this.add.image(this.dotoX, height / 50, TextureKeys.Blood).setDisplaySize(bloodBgWidth, bloodBgHight).setOrigin(0, 0);

    const successScaling = 0.34;
    const successBgWidth = 630 * successScaling * this._scale;
    const successBgHight = 230 * successScaling * this._scale;
    this.bloodBg = this.add.image(this.dotoX, height / 2 - height / 20, TextureKeys.Success).setDisplaySize(successBgWidth, successBgHight).setOrigin(0, 0);

    const scaling = 1;
    const w = 56 * scaling * this._scale;
    const h = 74 * scaling * this._scale;
    const startX = width / 2 + width / 7;
    const startY = height / 8;
    const dx = w / 2;
    const dy = 21 * this._scale;
    for (let i = 0; i < 8; i++) {
      const x: number = startX - i * dx;
      this.mapBlock.push(this.add.image(x, startY + i * dy, TextureKeys.Ground).setDisplaySize(w, h).setOrigin(0.5, 0.5));
      this.map.push([x, startY + i * dy]);
      for (let j = 1; j < 8; ++j) {
        const y: number = startY + i * dy + j * dy;
        this.mapBlock.push(this.add.image(x + (j * w) / 2, y, TextureKeys.Ground).setDisplaySize(w, h).setOrigin(0.5, 0.5));
        this.map.push([x + (j * w) / 2, y]);
      }
    }

    for (let i = 0; i < this.BOARD_SIZE; i++) {
      this.boardWXCoords.push([]);
      for (let j = 0; j < this.BOARD_SIZE; j++) {
        const tempo: Array<number> = this.map[i * this.BOARD_SIZE + j];
        tempo[1] -= 16 * this._scale;
        this.boardWXCoords[i].push(tempo);
      }
    }
  }

  drawButton() {
    this._scale = getScale(width, height);
    const bloodScaling = 0.25;
    const bloodBgHight = 334 * bloodScaling * this._scale;
    const x = (width / 30) * this._scale;
    const y = (height / 50 + bloodBgHight / 2) * this._scale;
    this.ExitGameLabel = this.add.text(x + this.dotoX, y, '结束回合', {
      fontSize: '20px',
      color: '#ffffff',
      padding: { top: 5, bottom: 5 },
    }).setScrollFactor(0).setOrigin(0, 0);
  }

  buttonEvent() {
    this.ExitGameLabel.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.ExitGameLabel.width, this.ExitGameLabel.height), Phaser.Geom.Rectangle.Contains);
    this.ExitGameLabel.on('pointerdown', () => {
      if (this.isPlayerTurn) {
        if (this.Turn > -1) {
          this.Turn -= 1;
          this.doTurn();
        }
      }
    });
  }

  drawTime() {
    const successScaling = 0.34;
    const successBgWidth = 679 * successScaling * this._scale;
    const successBgHight = 639 * successScaling * this._scale;
    // this.bloodBg = this.add.image(0, height / 2 - height / 20, TextureKeys.Success).setDisplaySize(successBgWidth, successBgHight).setOrigin(0, 0);
    const x = successBgWidth / 2;
    const y = height / 2 - height / 20 + successBgHight / 40;
    this.gameTimeLabel = this.add.text(x + this.dotoX, y, '00:00', {
      fontSize: '14px',
      color: '#ffffff',
      padding: { top: 2, bottom: 2 },
    }).setScrollFactor(0).setOrigin(0, 0);
  }

  drawTurn() {
    const successScaling = 0.34;
    const successBgWidth = 679 * successScaling * this._scale;
    const successBgHight = 639 * successScaling * this._scale;
    // this.bloodBg = this.add.image(0, height / 2 - height / 20, TextureKeys.Success).setDisplaySize(successBgWidth, successBgHight).setOrigin(0, 0);
    const x = successBgWidth / 3.2;
    const y = height / 2 + successBgHight / 8;
    this.gameTurnLabel = this.add.text(x + this.dotoX, y, this.Turn.toString(), {
      fontSize: '20px',
      color: '#ffffff',
      padding: { top: 2, bottom: 2 },
    }).setScrollFactor(0).setOrigin(0, 0);
  }

  intoTime() {
    const dangTime = new Date().getTime();
    const time = new Date(dangTime - this.gameTime);
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    return `${minutes < 10 ? (`0${minutes}`) : minutes}:${seconds < 10 ? (`0${seconds}`) : seconds}`;
  }

  drawbloodEvent(i: number) {
    this._scale = getScale(width, height);
    const bloodScaling = 0.25;
    const bloodBgWidth = 1203 * bloodScaling * this._scale;
    const bloodBgHight = 334 * bloodScaling * this._scale;

    const x = this.dotoX + bloodBgWidth / 2 + bloodBgWidth / 20 - 2;
    const y = height / 50 + bloodBgHight / 9;

    const dx = bloodBgWidth / 30;
    const graphics = this.add.graphics();
    // graphics.fillStyle(0xffffff);
    graphics.fillStyle(0x0C0C17);
    graphics.fillRect(x - i * dx, y, bloodBgWidth / 30, bloodBgHight / 4);
  }

  drawPortraitAndAttackBtn(pilotKey: string) {
    this.currentPilotKey = pilotKey;
    // Portrait
    const margin = TextureProperties.Margin;
    const portraitY = height / 2 + height / 4;
    this.currentPortraitAndAtkBtns = this.add.group();
    this.currentPortraitAndAtkBtns.add(this.add.graphics()
      .fillStyle(Colors.MainPurple)
      .fillRect(this.dotoX, portraitY,
        TextureProperties.PilotWidth + margin * 2,
        TextureProperties.PilotHeight + margin * 2));
    this.currentPortraitAndAtkBtns.add(this.add.image(this.dotoX + margin, portraitY + margin, TextureKeys.PortraitBack1)
      .setOrigin(0, 0));
    this.currentPortraitAndAtkBtns.add(this.add.image(this.dotoX + margin, portraitY + margin, pilotKey)
      .setOrigin(0, 0));

    // Repair
    const padding = TextureProperties.Padding;
    const repairX = this.dotoX + margin * 2 + TextureProperties.PilotWidth + padding;
    const repairY = portraitY;
    const repairScale = TextureProperties.PilotHeight / TextureProperties.RepairHeight;
    this.currentPortraitAndAtkBtns.add(this.add.graphics()
      .fillStyle(Colors.MainPurple)
      .fillRect(repairX, repairY,
        TextureProperties.RepairWidth * repairScale + margin * 2,
        TextureProperties.RepairHeight * repairScale + margin * 2));
    this.currentPortraitAndAtkBtns.add(this.add.image(repairX + margin, repairY + margin, TextureKeys.Repair)
      .setScale(repairScale)
      .setOrigin(0, 0)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        if (this.selectedMech instanceof Mech) {
          this.selectedMech.repair();
        }
      }));

    // Weapon
    const weaponX = repairX + margin * 2 + TextureProperties.RepairWidth * repairScale + padding;
    const weaponY = portraitY;
    const weaponScale = TextureProperties.PilotHeight / TextureProperties.MechTankBruteHeight;
    this.currentPortraitAndAtkBtns.add(this.add.graphics()
      .fillStyle(Colors.MainPurple)
      .fillRect(weaponX, weaponY,
        TextureProperties.MechTankBruteWidth * weaponScale + margin * 2,
        TextureProperties.MechTankBruteHeight * weaponScale + margin * 2));
    this.currentPortraitAndAtkBtns.add(this.add.image(weaponX + margin, weaponY + margin, TextureKeys.MechTankBrute)
      .setScale(weaponScale)
      .setOrigin(0, 0)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        if (this.selectedMech instanceof Mech) {
          if (this.isPlayerTurn && this.selectedMech.hp > 0) {
            if (this.possibleAttackDestinations.length === 0) {
              this.selectedMech.showPossibleAttackDestinations();
            } else {
              this.selectedMech.clearAttackDestination();
            }
          }
        }
      }));
  }

  drawMechStatusList() {
    const margin = TextureProperties.Margin;
    const padding = TextureProperties.Padding;
    const innerPadding = margin / 2;
    const portraitY = height / 2 - height / 4 - height / 32;
    const hpBarY = portraitY + TextureProperties.PilotHeight + margin * 2 + padding;
    const hpSize = 8;
    for (let i = 0; i < this.pilotKeys.length; i++) {
      const currentX = this.dotoX + (TextureProperties.PilotWidth + padding + margin * 2) * i;
      // Portrait
      const portraitBackground = this.add.rectangle(currentX, portraitY,
        TextureProperties.PilotWidth + margin * 2,
        TextureProperties.PilotHeight + margin * 2, Colors.MainPurple)
        .setOrigin(0, 0);
      this.pilotBackgrounds.set(this.pilotKeys[i], portraitBackground);
      this.add.image(currentX + margin, portraitY + margin, TextureKeys.PortraitBack1)
        .setOrigin(0, 0);
      this.add.image(currentX + margin, portraitY + margin, this.pilotKeys[i])
        .setOrigin(0, 0)
        .setInteractive()
        .on(Phaser.Input.Events.POINTER_DOWN, () => {
          this.mechs[i].onClick();
        });
      // HP bar
      const currentHpBarX = currentX;
      const hpBarWidth = hpSize * this.mechs[i].maxHp + margin * 2;
      const hpBarHeight = hpSize + margin * 2;
      this.add.graphics()
        .fillStyle(Colors.MainPurple)
        .fillRect(currentHpBarX, hpBarY, hpBarWidth, hpBarHeight);
      this.add.graphics()
        .fillStyle(Colors.Black)
        .fillRect(currentHpBarX + margin, hpBarY + margin, hpBarWidth - margin * 2, hpBarHeight - margin * 2);
      this.mechHpBars.set(this.pilotKeys[i], new Map());
      for (let hpIndex = 0; hpIndex < this.mechs[i].maxHp; hpIndex++) {
        this.mechHpBars.get(this.pilotKeys[i]).set(hpIndex + 1, this.add.rectangle(currentHpBarX + margin + innerPadding + hpSize * hpIndex, hpBarY + margin + innerPadding,
          hpSize - innerPadding * 2, hpSize - innerPadding * 2, Colors.Green)
          .setOrigin(0, 0));
      }
    }
  }

  createBuilding() {
    const buildingJson = this.cache.json.get(LevelKeys.Building);
    for (let i = 0; i < buildingJson.initBuildingPos.length; i++) {
      const xCoord = buildingJson.initBuildingPos[i][0];
      const yCoord = buildingJson.initBuildingPos[i][1];
      if (this.board[xCoord][yCoord] != null) {
        // eslint-disable-next-line no-continue
        continue;
      }
      this.board[xCoord][yCoord] = Building.newUnit(this, new Coords(xCoord, yCoord), i % 2 === 0);
    }
  }

  createBoard() {
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      const tempo = new Array<Unit | null>();
      const tempo2 = new Array<AliensEmerge | null>();
      for (let j = 0; j < this.BOARD_SIZE; j++) {
        tempo.push(null);
        tempo2.push(null);
      }
      this.board.push(tempo);
      this.aliensEmergeBoard.push(tempo2);
    }
  }

  createMechs() {
    const levelJson = this.cache.json.get(LevelKeys.Level1);
    for (let i = 0; i < levelJson.initMechPos.length; i++) {
      const xCoord = levelJson.initMechPos[i][0];
      const yCoord = levelJson.initMechPos[i][1];
      const mech = Mech.newUnit(this, new Coords(xCoord, yCoord), this.pilotKeys[i]);
      this.board[xCoord][yCoord] = mech;
      this.mechs.push(mech);
    }
  }

  createAliens() {
    const carbScale = 0.8;
    const levelJson = this.cache.json.get(LevelKeys.Level1);
    for (let i = 0; i < levelJson.initAlienPos.length; i++) {
      const xCoord = levelJson.initAlienPos[i][0];
      const yCoord = levelJson.initAlienPos[i][1];
      this.board[xCoord][yCoord] = Carb.newUnit(this, new Coords(xCoord, yCoord));
    }
  }

  // Main game logic
  doTurn() {
    if (this.isGameEnd) {
      return;
    }
    // oneTurn: alienArise -> alienMove -> showAlienArisePos
    // -> showEnvEffects -> playerMove&Attack -> takeEnvEffects -> alienAttack
    console.log(this.cntAliens.toString());
    this.isPlayerTurn = false;
    this.takeEnvEffects();
    this.time.addEvent({
      callback: () => {
        this.alienAttack();
      },
      delay: 0, // ms
      callbackScope: this,
      repeat: 0
    });
    this.time.addEvent({
      callback: () => {
        this.alienEmerge();
      },
      delay: this.cntAliens * UnitProperties.ShotDelay * 12, // ms
      callbackScope: this,
      repeat: 0
    });
    this.time.addEvent({
      callback: () => {
        this.alienMove();
      },
      delay: this.cntAliens * UnitProperties.ShotDelay * 12 + this.cntEmerges * 1200, // ms
      callbackScope: this,
      repeat: 0
    });
    this.time.addEvent({
      callback: () => {
        this.addAlienEmergePos();
      },
      delay: this.cntAliens * UnitProperties.ShotDelay * 12 + this.cntEmerges * 1200 + (this.cntAliens + this.cntEmerges) * UnitProperties.MoveDelay * 6, // ms
      callbackScope: this,
      repeat: 0
    });
    this.time.addEvent({
      callback: () => {
        this.showEnvEffects();
      },
      delay: this.cntAliens * UnitProperties.ShotDelay * 12 + this.cntEmerges * 1200 + (this.cntAliens + this.cntEmerges) * UnitProperties.MoveDelay * 6 + (this.Turn % LevelProperties.EmergeMod == LevelProperties.EmergeRemainder ? LevelProperties.EmergeNum : 0) * 1200, // ms
      callbackScope: this,
      repeat: 0
    });
    this.time.addEvent({
      callback: () => {
        this.playerMoveAndAttack();
      },
      delay: this.cntAliens * UnitProperties.ShotDelay * 12 + this.cntEmerges * 1200 + (this.cntAliens + this.cntEmerges) * UnitProperties.MoveDelay * 6 + (this.Turn % LevelProperties.EmergeMod == LevelProperties.EmergeRemainder ? LevelProperties.EmergeNum : 0) * 1200, // ms
      callbackScope: this,
      repeat: 0
    });
  }

  alienEmerge() {
    this.aliensEmerges = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.aliensEmergeBoard[i][j] != null) {
          this.aliensEmerges.push(<AliensEmerge> this.aliensEmergeBoard[i][j]);
        }
      }
    }
    if (this.aliensEmerges.length > 0) {
      this.aliensEmerges[0].tryEmerge();
      let i = 1;
      this.time.addEvent({
        callback: () => {
          if (i != this.aliensEmerges.length) {
            this.aliensEmerges[i].tryEmerge();
            i++;
          }
        },
        delay: 1100, // ms
        callbackScope: this,
        repeat: this.aliensEmerges.length - 1
      });
    }
  }

  alienMove() {
    this.aliens = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] instanceof Alien) {
          this.aliens.push(<Carb> this.board[i][j]);
          this.aliens[this.aliens.length - 1].atkIntention = -1;
        }
      }
    }

    // eslint-disable-next-line eqeqeq
    if (this.aliens.length != 0) {
      this.aliens[0].moveAndPrepareForAttack();
      let i = 1;
      this.time.addEvent({
        callback: () => {
          // eslint-disable-next-line eqeqeq
          this.aliens[i - 1].showSpriteAfterMove(i);
          if (i != this.aliens.length) {
            this.aliens[i].moveAndPrepareForAttack();
            i++;
          }
        },
        delay: UnitProperties.MoveDelay * 5.5, // ms
        callbackScope: this,
        repeat: this.aliens.length - 1
      });
    }
  }

  addOneAlienEmergePos() {
    const choice: Array<Coords> = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] == null && this.aliensEmergeBoard[i][j] == null) {
          choice.push(new Coords(i, j));
        }
      }
    }
    // eslint-disable-next-line eqeqeq
    if (choice.length != 0) {
      let rand = Math.ceil(Math.random() * choice.length);
      // eslint-disable-next-line eqeqeq
      if (rand == choice.length) {
        rand--;
      }
      this.aliensEmergeBoard[choice[rand].x][choice[rand].y] = new AliensEmerge(this, choice[rand]);
    }
  }

  addAlienEmergePos() {
    // eslint-disable-next-line eqeqeq
    if (this.Turn % LevelProperties.EmergeMod == LevelProperties.EmergeRemainder) {
      this.addOneAlienEmergePos();
      let i = 1;
      this.time.addEvent({
        callback: () => {
          // eslint-disable-next-line eqeqeq
          if (i != LevelProperties.EmergeNum) {
            this.addOneAlienEmergePos();
            i++;
          } else {
            this.calCnt();
          }
        },
        delay: 1100, // ms
        callbackScope: this,
        repeat: LevelProperties.EmergeNum - 1
      });
    } else {
      this.calCnt();
    }
  }

  calCnt() {
    // count
    this.cntAliens = 0;
    this.cntEmerges = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.aliensEmergeBoard[i][j] != null) {
          this.cntEmerges++;
        }
        if (this.board[i][j] instanceof Alien) {
          this.cntAliens++;
        }
      }
    }
  }

  showEnvEffects() {

  }

  public isPlayerTurn: boolean = false;

  playerMoveAndAttack() {
    if (this.gameHp <= 0 || this.cntPlayer <= 0 || this.Turn === -1) {
      Game.isGameWin = !((this.gameHp <= 0 || this.cntPlayer <= 0));
      this.isGameEnd = true;
      Game.totalScore = (Game.isGameWin ? 10000 : 0) + this.cntPlayer * 500 + this.gameHp * 300 + this.cntAlienKill * 250;
      this.scene.run(SceneKeys.GameOver);
      return;
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] instanceof Mech) {
          (<Mech> this.board[i][j]).refreshState();
        }
      }
    }
    this.isPlayerTurn = true;
  }

  takeEnvEffects() {

  }

  alienAttack() {
    if (this.cntAliens !== 0) {
      let i = 0;
      while (i < this.aliens.length && this.aliens[i].hp <= 0) {
        i++;
      }
      this.aliens[i].attack();
      i++;
      this.time.addEvent({
        callback: () => {
          while (i < this.aliens.length && this.aliens[i].hp <= 0) {
            i++;
          }
          if (i < this.aliens.length) {
            this.aliens[i].attack();
            i++;
          }
        },
        delay: UnitProperties.ShotDelay * 10, // ms
        callbackScope: this,
        repeat: this.cntAliens - 1
      });
    }
  }

  creatAnims() {
    this.anims.create({
      key: 'mech-normal',
      frames: this.anims.generateFrameNumbers(TextureKeys.MechTankA, { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1
    });
    this.anims.create({
      key: 'carb-normal',
      frames: this.anims.generateFrameNumbers(TextureKeys.CarbA, { start: 0, end: 3 }),
      frameRate: 4,
      repeat: -1
    });
    this.anims.create({
      key: 'carb-death',
      frames: this.anims.generateFrameNumbers(TextureKeys.CarbDeath, { start: 0, end: 7 }),
      frameRate: 7.5,
      repeat: 1
    });
    this.anims.create({
      key: 'carb-emerge',
      frames: this.anims.generateFrameNumbers(TextureKeys.CarbEmerge, { start: 0, end: 9 }),
      frameRate: 9.5,
      repeat: 1
    });
    this.anims.create({
      key: 'building-death',
      frames: this.anims.generateFrameNumbers(TextureKeys.BuildingDeath, { start: 0, end: 11 }),
      frameRate: 11.5,
      repeat: 1
    });
    this.anims.create({
      key: 'mountain-death',
      frames: this.anims.generateFrameNumbers(TextureKeys.MountainDeath, { start: 0, end: 12 }),
      frameRate: 11.5,
      repeat: 1
    });
    this.anims.create({
      key: 'emerging-intro',
      frames: this.anims.generateFrameNumbers(TextureKeys.EmergingIntro, { start: 0, end: 3 }),
      frameRate: 3.5,
      repeat: 1
    });
    this.anims.create({
      key: 'emerging-normal',
      frames: this.anims.generateFrameNumbers(TextureKeys.EmergingLoop, { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });
    // Generate reachable grid texture
    this.add.graphics()
      .fillStyle(0x13E92A)
      .fillPoints([
        new Phaser.Geom.Point(28.5, 0),
        new Phaser.Geom.Point(0, 21.5),
        new Phaser.Geom.Point(28.5, 42),
        new Phaser.Geom.Point(56, 21.5)
      ], true, true)
      .setScale(this._scale)
      .setAlpha(0.3)
      .generateTexture(TextureKeys.ReachableGrid, 56, 42)
      .destroy();
    // Generate attack destination grid texture
    this.add.graphics()
      .fillStyle(Colors.Orange)
      .fillPoints([
        new Phaser.Geom.Point(28.5, 0),
        new Phaser.Geom.Point(0, 21.5),
        new Phaser.Geom.Point(28.5, 42),
        new Phaser.Geom.Point(56, 21.5)
      ], true, true)
      .setScale(this._scale)
      .setAlpha(0.3)
      .generateTexture(TextureKeys.AttackableGrid, 56, 42)
      .destroy();
    // Generate portrait background
    this.add.graphics()
      .fillStyle(Colors.MainPurple)
      .fillRect(0, 0, 120, 50)
      .setScale(this._scale)
      .generateTexture(TextureKeys.PortraitBackground, 120, 50)
      .destroy();
    // Ask BBY
    this.add.graphics()
      .fillStyle(0xAFAFAF)
      .fillPoints([
        new Phaser.Geom.Point(28.5, 0),
        new Phaser.Geom.Point(0, 21.5),
        new Phaser.Geom.Point(28.5, 42),
        new Phaser.Geom.Point(56, 21.5)
      ], true, true)
      .setScale(this._scale)
      .setAlpha(0.3)
      .generateTexture(TextureKeys.ActingGrid, 56, 42)
      .destroy();
  }

  dead(poorGuy: Mech | Building | Carb) {
    this.refreshAlienShotPredict();
    poorGuy.setAct(false);
    if (poorGuy instanceof Building) {
      if ((<Building>poorGuy).ruinFlag) {
        poorGuy.sprite.anims.play('building-death');
      } else {
        poorGuy.sprite.anims.play('mountain-death');
      }
      this.board[poorGuy.coords.x][poorGuy.coords.y] = null;
    }
    if (poorGuy instanceof Mech) {
      poorGuy.sprite.destroy(true);
      this.cntPlayer--;
      poorGuy.sprite = this.physics.add.sprite(this.boardWXCoords[poorGuy.coords.x][poorGuy.coords.y][0], this.boardWXCoords[poorGuy.coords.x][poorGuy.coords.y][1], TextureKeys.MechTankDeath)
        .setOrigin(0.5, 0.5)
        .setScale(this._scale, this._scale)
        .setInteractive();
      const tsprite = this.physics.add.sprite(this.boardWXCoords[poorGuy.coords.x][poorGuy.coords.y][0], this.boardWXCoords[poorGuy.coords.x][poorGuy.coords.y][1], TextureKeys.MechTankDeath)
        .setOrigin(0.5, 0.5)
        .setScale(this._scale, this._scale)
        .setInteractive()
        .setAlpha(0.5)
        .setBlendMode('ERASE');
      if (this.aliensEmergeBoard[poorGuy.coords.x][poorGuy.coords.y] != null) {
        this.aliensEmergeBoard[poorGuy.coords.x][poorGuy.coords.y]?.remove();
        this.cntEmerges--;
      }
    }
    if (poorGuy instanceof Carb) {
      poorGuy.sprite.anims.play('carb-death');
      this.cntAliens--;
      this.cntAlienKill++;
      this.board[poorGuy.coords.x][poorGuy.coords.y] = null;
    }
    this.time.addEvent({
      callback: () => {
        if (!(poorGuy instanceof Mech)) {
          poorGuy.sprite.destroy(true);
        }
      },
      delay: 1000, // ms
      callbackScope: this,
      repeat: 0
    });
  }

  getEmptySprite(coords: Coords) {
    return this.physics.add.sprite(this.boardWXCoords[coords.x][coords.y][0], this.boardWXCoords[coords.x][coords.y][1], TextureKeys.Empty)
      .setOrigin(0.5, 0.5)
      .setScale(1, 1)
      .setInteractive();
  }

  refreshAlienShotPredict() {
    for (let i = 0; i < this.aliens.length; i++) {
      this.aliens[i].refreshShotPredict();
    }
  }

  isShotPassable(i: Coords) {
    if (this.board[i.x][i.y] == null || (this.board[i.x][i.y] instanceof Mech && (<Unit> this.board[i.x][i.y]).hp <= 0)) {
      return true;
    }
    return false;
  }
}
