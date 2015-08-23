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
            this.PLAYER_VELOCITY = 500;
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
            this.game.load.image('small-table', '/assets/small-table.png');
            this.game.load.image('bed', '/assets/bed.png');
            this.game.load.image('vase', '/assets/vase.png');
        };
        PlayState.prototype.create = function () {
            this.levelConfig = this.cache.getJSON('level1');
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 300;
            this.background = this.game.add.image(0, 0, 'background');
            this.objects = this.game.add.group();
            this.levelConfig.objects.forEach(function (object) {
                var sprite = this.objects.create(object.position.x, object.position.y, object.sprite);
                sprite.anchor.setTo(0, 1);
                if (object.sprite === 'wardrobe') {
                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(function (sprite, event) {
                        sprite.frame = (sprite.frame + 1) % 2;
                        if (this.player.alpha === 1) {
                            this.player.position.x = sprite.x + 250;
                            this.player.position.y = this.game.world.centerY;
                            this.player.body.allowGravity = false;
                            this.player.alpha = 0;
                        }
                        else {
                            this.player.body.allowGravity = true;
                            this.player.alpha = 1;
                        }
                    }, this);
                }
            }, this);
            this.player = this.game.add.sprite(this.levelConfig.player.position.x, this.levelConfig.player.position.y, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;
            this.camera.bounds.height = 700;
            this.camera.follow(this.player);
            this.player.alpha = 0;
            this.player.body.allowGravity = false;
            this.cursors = this.game.input.keyboard.createCursorKeys();
        };
        PlayState.prototype.update = function () {
            this.player.body.velocity.x = 0;
            if (this.cursors.left.isDown) {
                this.player.body.velocity.x -= this.PLAYER_VELOCITY;
            }
            if (this.cursors.right.isDown) {
                this.player.body.velocity.x += this.PLAYER_VELOCITY;
            }
        };
        return PlayState;
    })(Phaser.State);
    ld33.PlayState = PlayState;
})(ld33 || (ld33 = {}));
