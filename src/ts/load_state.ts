/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class LoadState extends Phaser.State {
        constructor() {
            super();
        }

        preload() {
            this.game.add.bitmapText(0, 400, 'carrier_command', "Loading... Please wait :)", 18);

            this.game.load.json('level1', 'levels/level1.json');
            this.game.load.image('background', 'assets/background.png');
            this.game.load.image('bed_legs', 'assets/bed_legs.png');
            this.game.load.spritesheet('wardrobe', 'assets/wardrobe.png', 500, 700);
            this.game.load.spritesheet('lamp', 'assets/lamp.png', 200, 200);
            this.game.load.image('player', 'assets/monstruo.png');
            this.game.load.spritesheet('enemy', 'assets/enemy.png', 150, 600);
            this.game.load.image('small-table', 'assets/small-table.png');
            this.game.load.image('bed', 'assets/bed.png');
            this.game.load.image('vase', 'assets/vase.png');
            this.game.load.image('door', 'assets/door.png');
            this.game.load.audio('music', 'assets/music.ogg');
            this.game.load.audio('jump', 'assets/jump.wav');
            this.game.load.audio('hide', 'assets/hide.wav');
        }

        create () {
            this.game.state.start('start');
        }
    }
}
