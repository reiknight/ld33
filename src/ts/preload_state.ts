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
            this.game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        }

        create () {
            this.game.state.start('load');
        }
    }
}
