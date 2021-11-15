import SceneKeys from '../consts/SceneKeys';
import TextureKeys from '../consts/TextureKeys';
import {getScale} from '../utils/index';
import AnimationKeys from '../consts/AnimationKeys';

export default class Game extends Phaser.Scene {
    constructor() {
        // 注册场景名称
        super(SceneKeys.Game);
        this.floor_h = 157;
        this.bookcases = [];
        this.windows = [];
        this.score = 0;
    }

    init() {
        this.score = 0;
    }

    create() {
        const {
            width,
            height
        } = this.game.scale;
        this._scale = getScale(width, height);
        console.log(this._scale);
        // this.add.image(画布x, 画布y, 图片key)
        // 将背景图加载到 Game 场景中，在Phaser 3 中，所有游戏对象的定位都默认基于它们自己的中心点
        // 注意：默认图片是以自己的中心点开始在画布(x,y)显示，即图片的中心在(x,y) 而不是在图片的左上角
        // 因此：(170, 320)，该位置刚好在图片的中心点，展示完整的图片，而(0,0)，只能展示图片的右下部分(四分之一)
        // 可以 setOrigin(0，0)，把图像的绘制定位点重置为左上角
        // this.add.image(0, 0, TextureKeys.Background).setOrigin(0, 0);
        // 设置图片固定大小
        // this.background = this.add.image(0, 0, TextureKeys.Background).setDisplaySize(width, height).setOrigin(0, 0);
        // 重复背景图片和地板，并随着视线滚动
        // this.background = this.add.tileSprite(0, 0, width, height, TextureKeys.Background).setOrigin(0);
        this.background = this.add
            .tileSprite(0, 0, width, height, TextureKeys.Background)
            .setOrigin(0)
            .setScrollFactor(0, 0); // 滚动
        // 放在底部
        this.floor = this.add
            .tileSprite(0, height - this.floor_h, width, this.floor_h, TextureKeys.Floor)
            // .setScale(this._scale)
            .setOrigin(0)
            .setScrollFactor(0, 0); // 滚动
        // 创建动画
        this.anims.create({
            key: AnimationKeys.RocketMouseRun,
            // generateFrameNames, 生成每一帧的映射，rocketmouse_run01.png ~ rocketmouse_run04.png
            frames: this.anims.generateFrameNames(TextureKeys.RocketMouse, {
                prefix: 'rocketmouse_run',
                start: 1,
                end: 4,
                zeroPad: 2,
                suffix: '.png',
            }),
            // 也可以不使用 generateFrameNames，而使用直接手动指定方式
            // frames: [
            //   { key: TextureKeys.RocketMouse, frame: 'rocketmouse_run01.png' },
            //   { key: TextureKeys.RocketMouse, frame: 'rocketmouse_run02.png' },
            //   { key: TextureKeys.RocketMouse, frame: 'rocketmouse_run03.png' },
            //   { key: TextureKeys.RocketMouse, frame: 'rocketmouse_run04.png' },
            // ],
            frameRate: 10,
            repeat: -1, // 告诉动画要循环播放
        });
        // this.mouseHole = this.add.image(Phaser.Math.Between(500, 1500), 501, TextureKeys.MouseHole);
        this.mouseHole = this.add
            .image(Phaser.Math.Between(500, 800), height - 92, TextureKeys.MouseHole)
            .setOrigin(0.5, 1)
            .setScale(this._scale);
        this.window1 = this.add.image(Phaser.Math.Between(300, 1000), 200, TextureKeys.Window1)
            .setScale(this._scale);
        this.window2 = this.add.image(Phaser.Math.Between(1300, 1500), 200, TextureKeys.Window2)
            .setScale(this._scale);
        this.windows = [this.window1, this.window2];
        this.bookcase1 = this.add
            .image(Phaser.Math.Between(1000, 1500), height - 60, TextureKeys.Bookcase1)
            .setOrigin(0.5, 1)
            .setScale(this._scale);
        this.bookcase2 = this.add
            .image(Phaser.Math.Between(2000, 2500), height - 60, TextureKeys.Bookcase2)
            .setOrigin(0.5, 1)
            .setScale(this._scale);
        this.bookcases = [this.bookcase1, this.bookcase2];
        // 给小熊加上动画
        // this.mouse = this.add
        //   .sprite(width * 0.5, height * 0.5, TextureKeys.RocketMouse, 'rocketmouse_fly01.png')
        //   .setScale(this._scale)
        //   .play(AnimationKeys.RocketMouseRun);
        // 给小熊加上物理引擎
        this.mouse = this.physics.add
            .sprite(width * 0.5, height - 30, TextureKeys.RocketMouse, 'rocketmouse_fly01.png')
            .setOrigin(0.5, 1)
            .setScale(this._scale)
            .play(AnimationKeys.RocketMouseRun);
        // this.bgm = this.sound.add(TextureKeys.Bgm);
        // this.bgm.play({ loop: true });
        // this.coins = this.physics.add.staticGroup();
        // this.spawnCoins();
        // // create a 🐻
        // this.mouse = new RocketMouse(this, width * 0.5, height - 30);
        // this.add.existing(this.mouse);
        // // this.mouse.setBounce()
        // // create a 激光
        // this.laserObstacle = new LaserObstacle(this, 900, 100);
        // this.add.existing(this.laserObstacle);
        // 给 player 设置物理碰撞，让 player 向前跑起来
        const body = this.mouse.body;
        body.setCollideWorldBounds(true);
        // 设置横向速度，move right
        body.setVelocityX(100);
        // this.scoreLabel = this.add
        //   .text(10, 10, `Score: ${this.score}`, {
        //     fontSize: '24px',
        //     color: '#080808',
        //     backgroundColor: '#F8E71C',
        //     shadow: { fill: true, blur: 0, offsetY: 0 },
        //     padding: { left: 15, right: 15, top: 10, bottom: 10 },
        //   })
        //   .setScrollFactor(0);
        // 设置物理世界的边界，让player距离地面 55px
        this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height - 30); // x,y width, height
        // 视线随着 rocket mouse 移动而移动
        this.cameras.main.startFollow(this.mouse);
        // 设置 相机的可视范围
        this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, height);
        // /** 碰撞地面 */
        // this.physics.add.collider(this.mouse, this.background);
        // /** 碰撞激光 */
        // this.physics.add.overlap(this.laserObstacle, this.mouse, this.handleOverlapLaser, undefined, this);
        // /** 碰撞金币 */
        // this.physics.add.overlap(this.coins, this.mouse, this.handleCollectCoin, undefined, this);
    }

    update() {
        this.wrapMouseHole();
        this.wrapWindows();
        this.wrapBookcases();
        // this.wrapLaserObtacle();
        // scroll the background
        this.background.setTilePosition(this.cameras.main.scrollX);
        this.floor.setTilePosition(this.cameras.main.scrollX);
        // this.teleportBackwards();
    }

    wrapMouseHole() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;
        if (this.mouseHole.x + this.mouseHole.width < scrollX) {
            this.mouseHole.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 500);
        }
    }

    wrapWindows() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;
        let width = this.window1.width * 2;
        if (this.window1.x + width < scrollX) {
            this.window1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);
            // 防止窗户与书架重合
            const overlap = this.bookcases.find(bc => Math.abs(this.window1.x - bc.x) <= this.window1.width);
            this.window1.visible = !overlap;
        }
        width = this.window2.width;
        if (this.window2.x + width < scrollX) {
            this.window2.x = Phaser.Math.Between(this.window1.x + width, this.window1.x + width + 800);
            // 防止窗户与书架重合
            const overlap = this.bookcases.find(bc => Math.abs(this.window2.x - bc.x) <= this.window2.width);
            this.window2.visible = !overlap;
        }
    }

    wrapBookcases() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;
        let width = this.bookcase1.width * 2;
        if (this.bookcase1.x + width < scrollX) {
            this.bookcase1.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 800);
            const overlap = this.windows.find(win => Math.abs(this.bookcase1.x - win.x) <= win.width);
            this.bookcase1.visible = !overlap;
        }
        width = this.bookcase2.width;
        if (this.bookcase2.x + width < scrollX) {
            this.bookcase2.x = Phaser.Math.Between(this.bookcase1.x + width, this.bookcase1.x + width + 800);
            const overlap = this.windows.find(win => Math.abs(this.bookcase2.x - win.x) <= win.width);
            this.bookcase2.visible = !overlap;
            // this.spawnCoins();
        }
    }

    wrapLaserObtacle() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;
        const body = this.laserObstacle.body;
        // let width = this.laserObstacle.width;
        // if (this.laserObstacle.x + width < scrollX) {
        //   this.laserObstacle.x = Phase r.Math.Between(rightEdge + width, rightEdge + width + 1000);
        //   this.laserObstacle.y = Phaser.Math.Between(0, 300);
        // }
        const width = body.width;
        if (this.laserObstacle.x + width < scrollX) {
            this.laserObstacle.x = Phaser.Math.Between(rightEdge + width, rightEdge + width + 1000);
            this.laserObstacle.y = Phaser.Math.Between(0, 300);
            body.position.x = this.laserObstacle.x + body.offset.x;
            body.position.y = this.laserObstacle.y;
        }
    }

    handleOverlapLaser(obj1, obj2) {
        const mouse = obj2; // as RocketMouse;
        mouse.kill();
    }

    handleCollectCoin(obj1, obj2) {
        const coin = obj2;
        this.coins.killAndHide(coin);
        coin.body.enable = false;
        this.score += 1;
        this.scoreLabel.text = `Score: ${this.score}`;
    }

    spawnCoins() {
        this.coins.children.each(child => {
            const coin = child;
            this.coins.killAndHide(coin);
            coin.body.enable = false;
        });
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;
        let x = rightEdge + 100;
        const numCoins = Phaser.Math.Between(1, 20);
        for (let i = 0; i < numCoins; i++) {
            const coin = this.coins.get(x, Phaser.Math.Between(100, this.scale.height - 100), TextureKeys.Coin);
            coin.setVisible(true);
            coin.setActive(true);
            const body = coin.body;
            body.setCircle(body.width * 0.5);
            body.enable = true;
            body.updateFromGameObject();
            x += coin.width * 1.5;
        }
    }

    // 传送
    teleportBackwards() {
        const scrollX = this.cameras.main.scrollX;
        const maxX = 2380;
        if (scrollX > maxX) {
            this.mouse.x -= maxX;
            this.mouseHole.x -= maxX;
            this.windows.forEach(win => {
                win.x -= maxX;
            });
            this.bookcases.forEach(bc => {
                bc.x -= maxX;
            });
            this.laserObstacle.x -= maxX;
            const laserBody = this.laserObstacle.body;
            laserBody.x -= maxX;
            this.spawnCoins();
            this.coins.children.each(child => {
                const coin = child;
                if (!coin.active) {
                    return;
                }
                coin.x -= maxX;
                const body = coin.body;
                body.updateFromGameObject();
            });
        }
    }
}
