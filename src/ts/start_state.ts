/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class StartState extends Phaser.State {
        constructor() {
            super();
        }

        create() {
            this.game.add.bitmapText(0, 100, 'carrier_command', "My planet needs me!", 18);

            this.game.add.bitmapText(0, 400, 'carrier_command', "Press ENTER to start", 18);

            this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function(e) {
                this.game.state.start('how_to_play');
            }, this);
        }
    }
}
