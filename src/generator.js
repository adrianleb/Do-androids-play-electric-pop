import _ from 'lodash';

class Generator {

  constructor(tempo=90, length=200, use_scale='a_minor') {

    this.probs = {
      // 'kick'    : {type: 'simple',   probs: [ 1, 0, 1, 0, 1, 0, 1, 0 ]}, // 1, 0, 1, 0, 1, 0, 1, 0
      // 'kick'    : {type: 'simple',   probs: [ 0.5, 0, 0, 0, 0, 0, 0, 0 ]},
      'kick'    : {type: 'simple',   probs: [ 1, 0, 0, 0, 0.1, 0, 0, 0 ]},



      'snare'   : {type: 'simple',   probs: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0]},
      // 'snare'   : {type: 'simple',   probs: [ 0, 0, 0.5, 0, 1, 0, 0.1, 0.2]},



      'hihat'   : {type: 'simple',   probs: [ 0, 0.1, 0.1 ,0.1]},

      // 'hihat'   : {type: 'simple',   probs: [ 0, 0, 0, 0,   0, 0.1, 1 ,0.1]},

      // 'hihat'   : {type: 'simple',   probs: [ 0, 1, 0 , 1]},
      // 'bass'    : {type: 'bass',   probs: [ 0, 0.7, 0.9, 1]},
      '0' : {type: 'harmonic', maxvol: 0.01, octave: 1, probs: [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]},
      '1' : {type: 'harmonic', maxvol: 0.01, octave: 2, probs: [ 1, 0, 0, 0 ]},//[ 1,   0,   0.3,   0,   0.8,   0,   0.1,   0,   1,   0,   0.5,   0.2  ]
      '3' : {type: 'harmonic', maxvol: 0.6, octave: 2, probs: [ 0, 0, 0, 0,  1, 0, 0, 0,  0, 0, 0, 0, 0, 0, 0, 0]},// [1 ,0   0.3,   0,   0.8,   0,   0.1,   0,   1,   0,   0.5,   0.2  ]
      '4' : {type: 'harmonic', maxvol: 0.6, octave: 1, probs: [ 0, 0, 0, 0,  0, 0, 0, 0,  1, 0, 0, 0, 0, 0, 0, 0]},// [1 ,0   0.3,   0,   0.8,   0,   0.1,   0,   1,   0,   0.5,   0.2  ]


      '2' : {type: 'harmonic', maxvol: 0.6, octave: 1, probs: [ 1, 0, 0, 0, 0, 0, 0, 0]},
      '2' : {type: 'harmonic', maxvol: 0.6, octave: 0, probs: [ 0, 0.7, 0.9, 1]},
      // 'speak' : {type: 'voice', maxvol: 0.6, octave: 1, probs: [ 1, 0, 0, 0, 0, 0, 0, 0]},

    };

    this.acme = {};
    this.period     = null;
    this.midi_table = null;
    this.length     = null;
    this.scale = {'a_minor': [21,23,24,26,28,29,31]};
    this.length = length;
    this.tempo = tempo;
    this.use_scale = use_scale;
    this.period = (60 / tempo) / 4; // sixteenth notes
    this.midi_table = ((() => {
      var result = [];
      for (var i = 0; i <= 127; i++) {
        result.push(this.midi_to_freq(i));
      }
      return result;
    })());
  }

  test() {
    return console.log(this.midi_table);
  }

  generate() {
    console.log("Generating music!");
    return _.each(this.probs, (lane, instrument) => {

      if (lane['type'] === 'simple') {
        this.acme[instrument] = this.generate_simple_lane(lane, instrument);
      }

      if (lane['type'] === 'bass') {
        this.acme[instrument] = this.generate_bass_lane(lane, instrument);
      }

      if (lane['type'] === 'harmonic') {
        this.acme[instrument] = this.generate_harmonic_lane(lane, instrument);
      }

      if (lane['type'] === 'voice') {
        this.acme[instrument] = this.generate_speak_lane(lane, instrument);
      }
    });
  }


  generate_simple_lane(lane, instrument) {
    let t = 0.0;
    let result = [];

    _.times(Math.ceil(this.length / (this.period * lane['probs'].length)), () => {
      _.each(lane['probs'], (prob) => {

        if (Math.random() <= prob) {
          result.push({start: t, action: 'play', arguments: [instrument]});
        }

        t = t + this.period;
      });

    });
    return result;
  }

  generate_speak_lane(lane, instrument) {
    let t = 0.0;
    let result = [];

    _.times(Math.ceil(this.length / (this.period * lane['probs'].length)), () => {
      _.each(lane['probs'], (prob) => {

        if (Math.random() <= prob) {
          result.push({start: t, action: 'play_voice', arguments: [instrument]});
        }

        t = t + this.period;
      });

    });
    return result;
  }

  generate_bass_lane(lane, instrument) {
    let t = 0.0;
    let result = [];

    _.times(Math.ceil(this.length / (this.period * lane['probs'].length)), () => {
      _.each(lane['probs'], (prob) => {

        if (Math.random() <= prob) {
          result.push({start: t, action: 'play_bass', arguments: [instrument]});
        }

        t = t + this.period;
      });

    });


    return result;
  }

  generate_harmonic_lane(lane, instrument) {
    var t = 0;
    var result = [];

    while (t <= this.length) {
      _.each(lane['probs'], (prob) => {
        if (Math.random() <= prob) {
          var note_length = Math.floor((Math.random()*4)+4)*this.period;
          t += note_length;
          var note = this.scale[this.use_scale][Math.floor((Math.random()*this.scale[this.use_scale].length)+1)] + (lane['octave']*12);
          console.log(this.midi_table[note], 'here');

          return result.push({start: t, action: 'play_note', arguments: [instrument, this.midi_table[note], note_length, lane['maxvol']]});
        } else {
          return t+=this.period;
        }
      });
    }

    return result;
  }


  generate_speech_lane(lane, instrument) {
    var t = 0;
    var result = [];

    while (t <= this.length) {
      // _.each(one.dictionary, (word) => {
      //   result.push({start: t, action: 'play', arguments: [word.name]});
      //   return t += parseFloat(word.sound_duration) + 0.3;
      // });
    }

    return result;
  }

  midi_to_freq(n) {
    return Math.pow( 2, ( (n - 69) / 12) ) * 440;
  }
}


console.log(Generator);
export default Generator;
