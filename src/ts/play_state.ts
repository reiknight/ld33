/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class PlayState extends Phaser.State {
        player: Phaser.Sprite;
        cursors: Phaser.CursorKeys;
        PLAYER_VELOCITY: number = 100;

        constructor() {
            super();
        }

        preload() {
            this.game.load.image('logo', 'phaser2.png');
        }

        create() {
            //Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 300;

            //Player creation
            this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;

            //Creating input
            this.cursors = this.game.input.keyboard.createCursorKeys();
        }

        update() {
            //Checking input
            this.player.body.velocity.x = 0;

            if(this.cursors.left.isDown) {
                this.player.body.velocity.x -= this.PLAYER_VELOCITY;
            }

            if(this.cursors.right.isDown) {
                this.player.body.velocity.x += this.PLAYER_VELOCITY;
            }
        }
    }
}
