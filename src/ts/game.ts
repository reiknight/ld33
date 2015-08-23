/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="play_state.ts" />

module ld33 {
  export class SimpleGame extends Phaser.Game {
      constructor() {
          super(800, 600, Phaser.AUTO, 'content');
          this.state.add('play', new PlayState());
          this.state.start('play');
      }
  }

  new SimpleGame();
}
