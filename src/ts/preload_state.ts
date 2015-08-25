/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class PreloadState extends Phaser.State {
        constructor() {
            super();
        }

        init () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.world.setBounds(0, 0, 3200, 650);
        }

        preload() {
            this.game.load.json('level1', '/levels/level1.json');
            this.game.load.image('background', '/assets/background.png');
            this.game.load.image('bed_legs', '/assets/bed_legs.png');
            this.game.load.spritesheet('wardrobe', '/assets/wardrobe.png', 500, 700);
            this.game.load.spritesheet('lamp', '/assets/lamp.png', 200, 200);
            this.game.load.image('player', '/assets/monstruo.png');
            this.game.load.spritesheet('enemy', '/assets/enemy.png', 150, 600);
            this.game.load.image('small-table', '/assets/small-table.png');
            this.game.load.image('bed', '/assets/bed.png');
            this.game.load.image('vase', '/assets/vase.png');
            this.game.load.image('door', '/assets/door.png');
            this.game.load.audio('music', '/assets/music.ogg');
            this.game.load.audio('jump', '/assets/jump.wav');
            this.game.load.audio('hide', '/assets/hide.wav');
            this.game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
        }

        create () {
            this.game.state.start('start');
        }
    }
}
