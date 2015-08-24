/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class CreditsState extends Phaser.State {
        constructor() {
            super();
        }

        create() {
            this.game.add.bitmapText(0, 100, 'carrier_command', "Thank you for playing!", 18);
            this.game.add.bitmapText(0, 200, 'carrier_command', "Created by @ReikVal and @beagleknight", 18);

            this.game.add.bitmapText(0, 400, 'carrier_command', "Press ENTER to continue", 18);

            this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(function(e) {
                this.game.state.start('start');
            }, this);
        }
    }
}
