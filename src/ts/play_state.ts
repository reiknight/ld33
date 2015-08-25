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
        end: boolean;
        polygon: Array<number>;
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
        texts: Array<TextAdvice>;
    }

    interface TextAdvice {
        text: string;
        minX: number;
        maxX: number;
    }

    export class PlayState extends Phaser.State {
        levelConfig: LevelConfig;
        background: Phaser.Sprite;
        bedLegs: Phaser.Image;
        player: Phaser.Sprite;
        enemy: Phaser.Sprite;
        playerCanBeSeen: boolean;
        cursors: Phaser.CursorKeys;
        spaceKey: Phaser.Key;
        objects: Phaser.Group;
        graphics: Phaser.Graphics;
        lights: Array<Phaser.Polygon> = [];
        music: Phaser.Sound;
        jumpSound: Phaser.Sound;
        hideSound: Phaser.Sound;
        texts: Array<{text: Phaser.Text, min: number, max: number}> = [];
        enemyVision: Phaser.Polygon;
        enemyDirection: number = 1;
        PLAYER_VELOCITY_X: number = 300;
        PLAYER_VELOCITY_Y: number = -400;

        constructor() {
            super();
        }

        init () {

        }

        create() {
            var spaceKey;
            this.levelConfig = this.cache.getJSON('level1');

            //Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Add background
            this.background = this.game.add.image(0, 0, 'background');
            this.graphics = this.game.add.graphics(0, 0);

            //Add music and FX
            this.music = this.game.add.audio('music');
            this.music.volume = 0.4;
            this.music.loop = true;
            this.jumpSound = this.game.add.audio('jump');
            this.jumpSound.volume = 0.2;
            this.hideSound = this.game.add.audio('hide');
            this.hideSound.volume = 0.2;
            /*this.music.play();*/

            // Add objects
            this.objects = this.game.add.group();
            this.levelConfig.objects.forEach(function (object: LevelObject) {
                var sprite = this.objects.create(object.position.x, object.position.y, object.sprite);
                var bodyHeight,
                    bodyOffsetY;
                sprite.anchor.setTo(0, 1);

                if (object.hideable) {
                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(this.hide, this);
                    sprite.hideable = true;
                }
                sprite.end = object.end;
                switch (object.sprite) {
                    case 'lamp':
                      sprite.polygon = new Phaser.Polygon(object.polygon);
                      this.graphics.beginFill(0xcacaee);
                      this.graphics.alpha = 0.1;
                      this.graphics.drawPolygon(sprite.polygon.points);
                      this.graphics.endFill();
                      this.lights.push(sprite.polygon);
                      sprite.animations.add('light', [0,1], 8, true);
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

            //Add texts
            this.levelConfig.texts.forEach(function (text: TextAdvice) {
                var textAdvice = {
                    text: this.game.add.bitmapText(text.minX, 300, 'carrier_command', text.text, 18),
                    min: text.minX,
                    max: text.maxX
                };
                textAdvice.text.visible = false;
                this.texts.push(textAdvice);
            }, this);

            //Player creation
            this.player = this.game.add.sprite(this.levelConfig.player.position.x, this.levelConfig.player.position.y, 'player');
            this.player.anchor.setTo(0.5, 1);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.gravity.y = 500;

            // Add bed legs in front
            var bedConfig = this.levelConfig.objects.filter(function (object: LevelObject) {
                return object.sprite === 'bed';
            })[0];
            this.bedLegs = this.game.add.sprite(bedConfig.position.x, bedConfig.position.y, 'bed_legs');
            this.bedLegs.anchor.setTo(0, 1);

            //Enemy creation
            this.enemy = this.game.add.sprite(300, 400, 'enemy');
            this.enemy.anchor.setTo(0.5);
            this.enemyVision = new Phaser.Polygon([100, 350, 800, -200, 800, 900]);

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

            this.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(e) {
                if (this.music.isPlaying) {
                    this.music.pause();
                } else {
                    this.music.resume();
                }
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function(e) {
                if (this.player.scale.y === 0.35) {
                    this.player.scale.setTo(1);
                } else {
                    this.player.scale.setTo(0.35);
                }
            }, this);
        }

        update() {
            this.game.physics.arcade.collide(this.player, this.objects);
            this.game.physics.arcade.overlap(this.player, this.objects, function(player) {
                player.scale.setTo(0.35);
            });
            if (this.enemy.position.x > 1250) {
                this.enemyDirection = -1;
                this.enemy.scale.setTo(-1, 1);
            } else if(this.enemy.position.x < 500) {
                this.enemyDirection = 1;
                this.enemy.scale.setTo(1);
            }
            this.enemy.position.x += this.enemyDirection*5;
            this.enemyVision.setTo([
              this.enemy.position.x,
              this.enemy.top + 100,
              this.enemy.position.x + this.enemyDirection * 800,
              this.enemy.top - 900,
              this.enemy.position.x + this.enemyDirection * 800,
              this.enemy.top + 1100
            ]);


            this.graphics.clear();
            this.graphics.beginFill(0x000000);
            this.graphics.drawPolygon(this.enemyVision.points);
            this.graphics.endFill();

            /*this.objects.forEach(function(sprite) {
                if(sprite.body) {
                    this.game.debug.body(sprite);
                }
            }, this);*/

            this.playerCanBeSeen = false;
            this.lights.forEach(function(light){
                this.graphics.beginFill(0xFFFFFF);
                this.graphics.drawPolygon(light.points);
                this.graphics.endFill();
                if (light.contains(this.player.x, this.player.y)) {
                    this.playerCanBeSeen = true;
                }
            }, this);

            this.graphics.alpha = 0.3;

            if (this.enemyVision.contains(this.player.x, this.player.y) && this.player.alpha === 1) {
                this.game.state.start('play', true, false);
            }
            //Showing texts
            this.texts.forEach(function(textAdvice) {
                if (this.player.position.x > textAdvice.min && this.player.position.x < textAdvice.max) {
                    textAdvice.text.visible = true;
                } else {
                    textAdvice.text.visible = false;
                }
            }, this);
            //Checking input
            this.player.body.velocity.x = 0;

            if (this.player.alpha === 1) {
                if (this.cursors.left.isDown) {
                    this.player.body.velocity.x -= this.PLAYER_VELOCITY_X;
                }

                if (this.cursors.right.isDown) {
                    this.player.body.velocity.x += this.PLAYER_VELOCITY_X;
                }

                if (this.player.body.onFloor() || this.player.body.touching.down) {
                    if (this.cursors.up.isDown) {
                        this.player.body.velocity.y = this.PLAYER_VELOCITY_Y;
                        this.jumpSound.play();
                    }
                }
            }
            if (this.spaceKey.justDown) {
                if (this.player.alpha === 1 && !this.playerCanBeSeen && (this.player.body.onFloor() || this.player.body.touching.down)) {
                    this.player.alpha = 0.5;
                    this.hideSound.play();
                } else if(this.player.alpha === 0.5) {
                    this.player.alpha = 1;
                    this.hideSound.play();
                }
            }
        }

        hide(sprite, event) {
            if (sprite.hideable) {
                if (Phaser.Rectangle.intersects(this.player.getBounds(), sprite.getBounds())) {
                    sprite.frame = (sprite.frame + 1) % 2;
                    this.hideSound.play();
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
            } else if (sprite.end) {
                if (Phaser.Rectangle.intersects(this.player.getBounds(), sprite.getBounds())) {
                    this.game.state.start('credits');
                }
            }
        }
    }
}
