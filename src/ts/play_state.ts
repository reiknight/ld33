/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    export class PlayState extends Phaser.State {
        background: Phaser.Image;
        player: Phaser.Sprite;
        cursors: Phaser.CursorKeys;
        wardrobe: Phaser.Sprite;
        smallTable: Phaser.Sprite;
        PLAYER_VELOCITY: number = 500;

        constructor() {
            super();
        }

        init () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.world.setBounds(0, 0, 3200, 700);
        }

        preload() {
            this.game.load.spritesheet('wardrobe', '/assets/wardrobe.png', 500, 700);
            this.game.load.image('background', '/assets/background.png');
            this.game.load.image('small-table', '/assets/small-table.png');
        }

        create() {
            //Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 300;

            // Add background
            this.background = this.game.add.image(0, 0, 'background');

            // Add wardrobe
            this.wardrobe = this.game.add.sprite(2810, this.game.world.height, 'wardrobe');
            this.wardrobe.anchor.setTo(0, 1);

            // Add small table
            this.smallTable = this.game.add.sprite(2080, this.game.world.height, 'small-table');
            this.smallTable.anchor.setTo(0, 1);

            //Player creation
            this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;

            this.camera.follow(this.player);
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
