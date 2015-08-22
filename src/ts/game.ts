/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>

class SimpleGame {
    game: Phaser.Game;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', new PlayState());
    }

    preload() {
        this.game.load.image('logo', 'phaser2.png');
    }
    create() {

    }
    update() {

    }
}

var game = new SimpleGame();
