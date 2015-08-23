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
            this.game.load.image('vase', '/assets/vase.png');
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
                var sprite = this.objects.create(object.position.x, object.position.y, object.sprite);
                sprite.anchor.setTo(0, 1);

                if (object.sprite === 'wardrobe') {
                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(function(sprite, event) {
                        sprite.frame = (sprite.frame + 1) % 2;
                        if(this.player.alpha === 1) {
                            this.player.position.x = sprite.x + 250;
                            this.player.position.y = this.game.world.centerY;
                            this.player.body.allowGravity = false;
                            this.player.alpha = 0;
                        } else {
                            this.player.body.allowGravity = true;
                            this.player.alpha = 1;
                        }
                    }, this);
                }
            }, this);

            //Player creation
            this.player = this.game.add.sprite(this.levelConfig.player.position.x, this.levelConfig.player.position.y, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;

            //Camera
            this.camera.bounds.height = 700;
            this.camera.follow(this.player);

            //Initial state for player
            this.player.alpha = 0;
            this.player.body.allowGravity = false;

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
