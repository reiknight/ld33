/// <reference path="../../bower_components/phaser/typescript/phaser.d.ts"/>
/// <reference path="./preload_state.ts"/>
/// <reference path="./start_state.ts"/>
/// <reference path="./how_to_play_state.ts"/>
/// <reference path="./play_state.ts"/>
/// <reference path="./credits_state.ts"/>

module ld33 {
  export class SimpleGame extends Phaser.Game {
      constructor() {
          super(800, 600, Phaser.AUTO, 'content');
          this.state.add('preload', new PreloadState());
          this.state.add('start', new StartState());
          this.state.add('how_to_play', new HowToPlayState());
          this.state.add('credits', new CreditsState());
          this.state.add('play', new PlayState());
          this.state.start('preload');
      }
  }

  new SimpleGame();
}
