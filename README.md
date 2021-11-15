## quickstart

## 源码目录介绍

```
./js
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── npc
│   └── enemy.js                           // 敌机类
├── player
│   ├── bullet.js                          // 子弹类
│   └── index.js                           // 玩家类
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态
└── main.js                                // 游戏入口主函数

```

{
"name": "phaser3-parcel-template",
"version": "1.0.0",
"description": "A typescript template project for Phaser 3 using Parceljs",
"scripts": {
"start": "parcel src/index.html -p 8000",
"build": "parcel build src/index.html --out-dir dist",
"test": "echo \"Error: no test specified\" && exit 1",
"lint": "eslint ./src --ext .js,.jsx,.ts,.tsx"
},
"author": "supertommy",
"license": "MIT",
"repository": {
"type": "git",
"url": "https://github.com/ourcade/phaser3-parcel-template.git"
},
"homepage": "https://github.com/ourcade/phaser3-parcel-template",
"devDependencies": {
"@typescript-eslint/eslint-plugin": "^2.29.0",
"@typescript-eslint/parser": "^2.29.0",
"eslint": "^6.8.0",
"minimist": ">=1.2.2",
"parcel-plugin-clean-easy": "^1.0.2",
"parcel-plugin-static-files-copy": "^2.4.3",
"typescript": "^3.8.3"
},
"dependencies": {
"phaser": "^3.50.1"
},
"parcelCleanPaths": [
"dist"
],
"staticFiles": {
"staticPath": "public",
"watcherGlob": "\*\*"
} }
