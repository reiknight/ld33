/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="play_state.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ld33;
(function (ld33) {
    var SimpleGame = (function (_super) {
        __extends(SimpleGame, _super);
        function SimpleGame() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content');
            this.state.add('play', new ld33.PlayState());
            this.state.start('play');
        }
        return SimpleGame;
    })(Phaser.Game);
    ld33.SimpleGame = SimpleGame;
    new SimpleGame();
})(ld33 || (ld33 = {}));
