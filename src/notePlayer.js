class NotePlayer {

  play(context, instrument, frequency, length, maxvol=0.3) {
    var oscillator = context.createOscillator();
    oscillator.type = parseInt(instrument);
    oscillator.frequency.value = frequency;

    var gainNode = context.createGainNode();

    var filterNode = context.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = 300;

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);

    gainNode.connect(context.destination);

    gainNode.gain.value = 0.0;
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + length / 1000);

    oscillator.start();
    return setTimeout((function() {return oscillator.stop(); }), length);
  }
}

const notePlayer = new NotePlayer()

export default notePlayer;
