let instance: any;

/**
 * 统一的音效管理器
 */
export default class Music {
  private bgmAudio!: HTMLAudioElement;

  constructor() {
    if (instance) return instance;

    instance = this;

    this.bgmAudio = new Audio();
    this.bgmAudio.loop = true;
    this.bgmAudio.src = 'audio/bgm.mp3';

    this.playBgm();
  }

  playBgm() {
    this.bgmAudio.play();
  }
}
