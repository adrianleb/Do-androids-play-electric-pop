import _ from 'lodash';
import Tone from 'tone';
import NotePlayer from './notePlayer';

class SoundMachine {

  constructor() {

    this.sounds = {
      kick : '/sounds/kick.wav',
      snare : '/sounds/snare.wav',
      hihat : '/sounds/hihat.wav'
    };

    this.preloaded = {};
    this.note_index = 0;
    this.move_up = false;
    this.octave = 5;
  }

  preload(callback){
    this.synth = new Tone.SimpleSynth().toMaster();
    this.bassSynth = new Tone.SimpleSynth().toMaster();

    Tone.Buffer.onload = () => {
      if (callback) return callback();
    }

    return _.each(this.sounds, (path, key) => {
      this.preloaded[key] = new Tone.Player(path).toMaster();
      this.preloaded[key].retrigger = true;
    });
  }

  play(sound_key) {
    const play = this.preloaded[sound_key];

    play.start();
  }

  play_note(instrument, frequency, length, maxvol) {
    if (frequency) {
      this.synth.triggerAttackRelease(frequency, length);
    }
  }

  play_bass(instrument, frequency, length, maxvol) {
    // 2 SYNTHS
    this.bassSynth.triggerAttackRelease('A1', '8n');
    // this.synth.triggerAttackRelease(frequency, '8n');
  }
};

export default SoundMachine
