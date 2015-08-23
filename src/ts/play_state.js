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
            this.game.world.setBounds(0, 0, 3200, 700);
        };
        PlayState.prototype.preload = function () {
            this.game.load.spritesheet('wardrobe', '/assets/wardrobe.png', 500, 700);
            this.game.load.image('background', '/assets/background.png');
            this.game.load.image('small-table', '/assets/small-table.png');
            this.game.load.image('bed', '/assets/bed.png');
        };
        PlayState.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 300;
            this.background = this.game.add.image(0, 0, 'background');
            this.wardrobe = this.game.add.sprite(2810, this.game.world.height, 'wardrobe');
            this.wardrobe.anchor.setTo(0, 1);
            this.smallTable = this.game.add.sprite(2080, this.game.world.height, 'small-table');
            this.smallTable.anchor.setTo(0, 1);
            this.bed = this.game.add.sprite(1177, this.game.world.height, 'bed');
            this.bed.anchor.setTo(0, 1);
            this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.player.anchor.setTo(0.5);
            this.game.physics.arcade.enableBody(this.player);
            this.player.body.collideWorldBounds = true;
            this.camera.follow(this.player);
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
