/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class PlayState extends Phaser.State {
        player: Phaser.Sprite;
        cursors: Phaser.CursorKeys;
        wardrobe: Phaser.Sprite;
        PLAYER_VELOCITY: number = 100;

        constructor() {
            super();
        }

        preload() {
            this.game.load.spritesheet('wardrobe', '/assets/wardrobe.png', 500, 700);
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

            // Add wardrobe
            this.wardrobe = this.game.add.sprite(this.game.world.width, this.game.world.height, 'wardrobe');
            this.wardrobe.anchor.setTo(1);
            this.game.time.events.loop(Phaser.Timer.SECOND * 2, function () {
                this.wardrobe.frame += 1 % 2;
            }, this);

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
