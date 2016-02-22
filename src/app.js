import React from 'react'
import Generator from './generator';
import NotePlayer from './notePlayer.js';
import SoundMachine from './soundMachine';
import SpeechSynthesis from './speechSynthesis';
import Speech from 'react-speech';
import Tone from 'tone';

window.generator = new Generator();
window.machine = new SoundMachine();


class App extends React.Component {

  componentDidMount() {
    window.canPlay = true;

    this.speechSynthesis = new SpeechSynthesis({
      autostart: false,
      text:"Ye",
      pitch:"1",
      rate:"2",
      volume:"1",
      lang:"en-GB",
      voice:"Google UK English Male"
    });

    this.speechSynthesis2 = new SpeechSynthesis({
      autostart: false,
      text:"Yo",
      pitch:"2",
      rate:"2",
      volume:"1",
      lang:"en-GB",
      voice:"Google UK English Male"
    });

    this.speechSynthesis.onend();
    this.speechSynthesis.onerror();

    machine.preload(() => {
      this.soundsPreloaded = true

      generator.generate();

      this.acmeLoader();
      // this.speechSynthesis.speak();
      this.checker();
    });
  }

  checker(timestamp) {
    if (this.soundsPreloaded) {
      window.requestAnimationFrame(() => {
        const timestamp = Date.now();

        if (window.canPlay) {
          return this.checker(timestamp);
        }
      });

      this.currentTime = (timestamp - this.startTime) / 1000;
      return this.acmeChecker();
    }
  }


  acmeLoader(hash=generator.acme) {
    this.startTime = Date.now();
    this.currentTime = 0;

    let iterable = Object.keys(hash);
    for (let i = 0, c; i < iterable.length; i++) {
      c = iterable[i];
      hash[c].current = 0;
    }
    console.log(hash);
  }


  acmeChecker(hash=generator.acme) {
    return (() => {
      let result = [];
      let iterable = Object.keys(hash);

      for (let i = 0, c; i < iterable.length; i++) {
        c = iterable[i];
        result.push((() => {
          if (typeof hash[c] === 'object') {
            let index =  hash[c].current;
            if (!!(hash[c][index] != null)) {
              if (hash[c][index].start <= this.currentTime) {
                hash[c].current += 1;
                return this.acmeAct(hash[c]);
              }
            }
          }
        })());
      }
      return result;
    })();
  }

  acmeAct(channel) {
    if (!channel[channel.current]) return null;

    let action = channel[channel.current].action;
    let args = channel[channel.current].arguments;

    console.log('will play', action);
    if (['play', 'show_word', 'show_image'].indexOf(action) > -1) {
      machine[action](args[0]);
    } else if (action === 'play_note') {
      machine[action](args[0], args[1], args[2]);
    } else if (action === 'play_bass') {
      machine[action](args[0]);
    } else if (action === 'play_voice') {
      console.log('wat')
      if (Math.random() < 0.5) {
        this.speechSynthesis.speak();
      } else {
        this.speechSynthesis2.speak();
      }
    }
  }



  render () {
    return (
      <div className='container'>
        Yo
        <Speech text="speech" />
      </div>
    )
  }
}

export default App;
