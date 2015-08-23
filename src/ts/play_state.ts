/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    interface LevelObject {
        sprite: String;
        position: {
            x: number,
            y: number
        }
    }

    interface LevelConfig {
        player: {
          position: {
            x: number,
            y: number
          }
        }
        objects: Array<LevelObject>;
    }

    export class PlayState extends Phaser.State {
        levelConfig: LevelConfig;
        background: Phaser.Image;
        player: Phaser.Sprite;
        cursors: Phaser.CursorKeys;
        objects: Phaser.Group;
        PLAYER_VELOCITY: number = 500;

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
            this.game.load.spritesheet('wardrobe', '/assets/wardrobe.png', 500, 700);
            this.game.load.image('small-table', '/assets/small-table.png');
            this.game.load.image('bed', '/assets/bed.png');
        }

        create() {
            this.levelConfig = this.cache.getJSON('level1');

            //Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 300;

            // Add background
            this.background = this.game.add.image(0, 0, 'background');

            // Add objects
            this.objects = this.game.add.group();
            this.levelConfig.objects.forEach(function (object: LevelObject) {
                this.objects.create(object.position.x, object.position.y, object.sprite);
                this.objects.setAll('anchor.x', 0);
                this.objects.setAll('anchor.y', 1);
            }, this);

            //Player creation
            this.player = this.game.add.sprite(this.levelConfig.player.position.x, this.levelConfig.player.position.y, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;

            //Camera
            this.camera.bounds.height = 700;
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
