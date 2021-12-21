import { screenWidth as width, screenHeight as height } from '../utils/index';

class Button extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, text: string, cb: () => void) {
    super(scene);

    const textObj = scene.add
      .text(width * 0.5, height * 0.5, text, {
        fontSize: '24px',
        color: '#FFFFFF',
        backgroundColor: '#000000',
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
