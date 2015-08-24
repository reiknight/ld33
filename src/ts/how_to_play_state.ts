/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class HowToPlayState extends Phaser.State {
        constructor() {
            super();
        }

        create() {
            this.game.add.bitmapText(0, 100, 'carrier_command', "Your name is 'Monstruo' and you must", 18);
            this.game.add.bitmapText(0, 150, 'carrier_command', "escape unseen. Follow the in-game", 18);
            this.game.add.bitmapText(0, 200, 'carrier_command', "instructions. Good luck!", 18);
            
            this.game.add.bitmapText(0, 400, 'carrier_command', "Press ENTER to continue", 18);

            this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function(e) {
                this.game.state.start('play');
            }, this);
        }
    }
}
