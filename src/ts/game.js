/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', new PlayState());
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('logo', 'phaser2.png');
    };
    SimpleGame.prototype.create = function () {
    };
    SimpleGame.prototype.update = function () {
    };
    return SimpleGame;
})();
var game = new SimpleGame();
