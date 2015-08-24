/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ld33;
(function (ld33) {
    var PlayState = (function (_super) {
        __extends(PlayState, _super);
        function PlayState() {
            _super.call(this);
            this.lights = [];
            this.texts = [];
            this.PLAYER_VELOCITY_X = 300;
            this.PLAYER_VELOCITY_Y = -400;
        }
        PlayState.prototype.init = function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.world.setBounds(0, 0, 3200, 650);
        };
        PlayState.prototype.preload = function () {
            this.game.load.json('level1', '/levels/level1.json');
            this.game.load.image('background', '/assets/background.png');
            this.game.load.spritesheet('wardrobe', '/assets/wardrobe.png', 500, 700);
            this.game.load.spritesheet('lamp', '/assets/lamp.png', 200, 200);
            this.game.load.image('small-table', '/assets/small-table.png');
            this.game.load.image('bed', '/assets/bed.png');
            this.game.load.image('vase', '/assets/vase.png');
            this.game.load.image('door', '/assets/door.png');
            this.game.load.audio('music', '/assets/music.ogg');
            this.game.load.bitmapFont('carrier_command', '/assets/fonts/carrier_command.png', '/assets/fonts/carrier_command.xml');
        };
        PlayState.prototype.create = function () {
            var spaceKey;
            this.levelConfig = this.cache.getJSON('level1');
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.game.add.image(0, 0, 'background');
            this.graphics = this.game.add.graphics(0, 0);
            this.music = this.game.add.audio('music');
            this.music.volume = 0.4;
            this.music.loop = true;
            this.music.play();
            this.objects = this.game.add.group();
            this.levelConfig.objects.forEach(function (object) {
                var sprite = this.objects.create(object.position.x, object.position.y, object.sprite);
                var bodyHeight, bodyOffsetY;
                sprite.anchor.setTo(0, 1);
                if (object.hideable) {
                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(this.hide, this);
                    sprite.hideable = true;
                }
                switch (object.sprite) {
                    case 'lamp':
                        sprite.polygon = new Phaser.Polygon(object.polygon);
                        this.graphics.beginFill(0xFFFFFF);
                        this.graphics.alpha = 0.1;
                        this.graphics.drawPolygon(sprite.polygon.points);
                        this.graphics.endFill();
                        this.lights.push(sprite.polygon);
                        sprite.animations.add('light', [0, 1, 2, 3, 3, 3, 2, 1, 0], 8, true);
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
                        }
                        else {
                            bodyHeight += object.collisionBounds.height;
                        }
                    }
                    bodyOffsetY = object.collisionBounds && object.collisionBounds.offsetY ? object.collisionBounds.offsetY : 0;
                    sprite.body.setSize(sprite.width, bodyHeight, 0, bodyOffsetY);
                    sprite.body.immovable = true;
                }
            }, this);
            this.levelConfig.texts.forEach(function (text) {
                var textAdvice = {
                    text: this.game.add.bitmapText(text.minX, 300, 'carrier_command', text.text, 18),
                    min: text.minX,
                    max: text.maxX
                };
                textAdvice.text.visible = false;
                this.texts.push(textAdvice);
            }, this);
            this.player = this.game.add.sprite(this.levelConfig.player.position.x, this.levelConfig.player.position.y, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.gravity.y = 500;
            this.camera.bounds.height = 700;
            this.camera.follow(this.player);
            this.player.alpha = 0;
            this.player.body.allowGravity = false;
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.spaceKey.onDown.add(function (e) {
                this.objects.forEach(function (sprite) {
                    this.hide(sprite, this.player);
                }, this);
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function (e) {
                if (this.music.isPlaying) {
                    this.music.pause();
                }
                else {
                    this.music.resume();
                }
            }, this);
        };
        PlayState.prototype.update = function () {
            this.game.physics.arcade.collide(this.player, this.objects);
            this.objects.forEach(function (sprite) {
                if (sprite.body) {
                    this.game.debug.body(sprite);
                }
            }, this);
            this.playerCanBeSeen = false;
            this.lights.forEach(function (light) {
                if (light.contains(this.player.x, this.player.y)) {
                    this.playerCanBeSeen = true;
                }
            }, this);
            this.texts.forEach(function (textAdvice) {
                if (this.player.position.x > textAdvice.min && this.player.position.x < textAdvice.max) {
                    textAdvice.text.visible = true;
                }
                else {
                    textAdvice.text.visible = false;
                }
            }, this);
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
                    }
                }
            }
            if (this.spaceKey.justDown) {
                if (this.player.alpha === 1 && !this.playerCanBeSeen && (this.player.body.onFloor() || this.player.body.touching.down)) {
                    this.player.alpha = 0.5;
                }
                else if (this.player.alpha === 0.5) {
                    this.player.alpha = 1;
                }
            }
        };
        PlayState.prototype.hide = function (sprite, event) {
            if (sprite.hideable) {
                if (Phaser.Rectangle.intersects(this.player.getBounds(), sprite.getBounds())) {
                    sprite.frame = (sprite.frame + 1) % 2;
                    if (this.player.alpha === 1) {
                        this.player.position.x = sprite.x + sprite.width / 2;
                        this.player.position.y = this.game.world.height - sprite.height / 3;
                        this.player.body.velocity.x = 0;
                        this.player.body.velocity.y = 0;
                        this.player.body.allowGravity = false;
                        this.player.alpha = 0;
                    }
                    else {
                        this.player.body.allowGravity = true;
                        this.player.alpha = 1;
                    }
                }
            }
        };
        return PlayState;
    })(Phaser.State);
    ld33.PlayState = PlayState;
})(ld33 || (ld33 = {}));
