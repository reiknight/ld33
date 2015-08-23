/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

module ld33 {
    interface LevelObject {
        sprite: String;
        collision: boolean;
        collisionBounds: {
            height: number,
            offsetY: number
        }
        hideable: boolean;
        castShadow: boolean;
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
        spaceKey: Phaser.Key;
        objects: Phaser.Group;
        PLAYER_VELOCITY_X: number = 300;
        PLAYER_VELOCITY_Y: number = -400;

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
            this.game.load.spritesheet('lamp', '/assets/lamp.png', 200, 200);
            this.game.load.image('small-table', '/assets/small-table.png');
            this.game.load.image('bed', '/assets/bed.png');
            this.game.load.image('vase', '/assets/vase.png');
            this.game.load.image('door', '/assets/door.png');
        }

        create() {
            var spaceKey;
            this.levelConfig = this.cache.getJSON('level1');

            //Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Add background
            this.background = this.game.add.image(0, 0, 'background');

            // Add objects
            this.objects = this.game.add.group();
            this.levelConfig.objects.forEach(function (object: LevelObject) {;
                var sprite = this.objects.create(object.position.x, object.position.y, object.sprite);
                var bodyHeight,
                    bodyOffsetY;
                sprite.anchor.setTo(0, 1);

                if (object.hideable) {
                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(this.hide, this);
                    sprite.hideable = true;
                }

                sprite.castShadow = object.castShadow;

                switch (object.sprite) {
                    case 'lamp':
                      sprite.animations.add('light', [0,1,2,3,3,3,2,1,0], 8, true);
                      sprite.play('light');
                      break;
                }

                if (object.collision) {
                    this.debugSprite = sprite;
                    this.game.physics.arcade.enableBody(sprite);
                    bodyHeight = sprite.height;
                    if (object.collisionBounds && object.collisionBounds.height) {
                        if (object.collisionBounds.height > 0) {
                            bodyHeight = object.collisionBounds.height;
                        } else {
                            bodyHeight += object.collisionBounds.height;
                        }
                    }
                    bodyOffsetY = object.collisionBounds && object.collisionBounds.offsetY ? object.collisionBounds.offsetY : 0;
                    sprite.body.setSize(sprite.width, bodyHeight, 0, bodyOffsetY);
                    sprite.body.immovable = true;
                }
            }, this);

            //Player creation
            this.player = this.game.add.sprite(this.levelConfig.player.position.x, this.levelConfig.player.position.y, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.gravity.y = 500;

            //Camera
            this.camera.bounds.height = 700;
            this.camera.follow(this.player);

            //Initial state for player
            this.player.alpha = 0;
            this.player.body.allowGravity = false;

            //Creating input
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.spaceKey.onDown.add(function(e) {
                this.objects.forEach(function(sprite) {
                    this.hide(sprite, this.player);
                }, this);
            }, this);
        }

        update() {
            //Checking collisions
            this.game.physics.arcade.collide(this.player, this.objects);

            this.objects.forEach(function(sprite) {
                if(sprite.body) {
                    this.game.debug.body(sprite);
                }
            }, this);
            //Checking input
            this.player.body.velocity.x = 0;

            if(this.player.alpha === 1) {
                if(this.cursors.left.isDown) {
                    this.player.body.velocity.x -= this.PLAYER_VELOCITY_X;
                }

                if(this.cursors.right.isDown) {
                    this.player.body.velocity.x += this.PLAYER_VELOCITY_X;
                }

                if(this.player.body.onFloor() || this.player.body.touching.down) {
                    if(this.cursors.up.isDown) {
                        this.player.body.velocity.y = this.PLAYER_VELOCITY_Y;
                    }
                }
            }
        }
        hide(sprite, event) {
            if (sprite.hideable) {
                if (Phaser.Rectangle.intersects(this.player.getBounds(), sprite.getBounds())) {
                    sprite.frame = (sprite.frame + 1) % 2;
                    if(this.player.alpha === 1) {
                        this.player.position.x = sprite.x + sprite.width/2;
                        this.player.position.y = this.game.world.height - sprite.height/3;
                        this.player.body.velocity.x = 0;
                        this.player.body.velocity.y = 0;
                        this.player.body.allowGravity = false;
                        this.player.alpha = 0;
                    } else {
                        this.player.body.allowGravity = true;
                        this.player.alpha = 1;
                    }
                }
            } else if (sprite.castShadow) {
                if (Phaser.Rectangle.intersects(this.player.getBounds(), sprite.getBounds()) && this.player.body.onFloor()) {
                    if(this.player.alpha === 1) {
                        this.player.alpha = 0.5;
                    } else {
                        this.player.alpha = 1;
                    }
                }
            }
        }
    }
}
