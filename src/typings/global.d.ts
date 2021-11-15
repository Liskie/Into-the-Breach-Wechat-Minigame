// eslint-disable-next-line import/no-extraneous-dependencies
import * as WX from '@types/wechat-miniprogram';

declare global {
  interface Window {
    wx: WX;
    canvas: HTMLCanvasElement;
  }
}
