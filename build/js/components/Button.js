class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, cb) {
        super(scene);
        const textObj = scene.add
            .text(x, y, "", {
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#FFFFFF',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 15, right: 15, top: 10, bottom: 10 },
        })
            .setOrigin(0.5)
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, cb);
        this.add(textObj);
    }
}
export default Button;
