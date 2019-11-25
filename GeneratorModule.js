import Lib220a from './Lib220.js';

class GeneratorModule {
  constructor(context) {
    this._context = context;
    this._lfo = new OscillatorNode(this._context);
    this._depth = new GainNode(this._context);
    this._osc = new OscillatorNode(this._context);
    this._amp = new GainNode(this._context);
    this.output = new GainNode(context);

    this._osc.type = 'triangle';
    this._osc.frequency.value = Lib220a.mtof(60);
    this._amp.gain.value = 0.0;
    this._lfo.frequency.value = 8;
    this._depth.gain.value = 100;

    this._osc.connect(this._amp).connect(this.output);
    this._lfo.connect(this._depth).connect(this._osc.detune);
    this._osc.start();
    this._lfo.start();

    this._currentPitches = [];
  }

  async initialize() {}

  close() {
    this._osc.stop();
    this._lfo.stop();
  }

  noteOn(pitch, velocity, when) {
    // Q: What does this code do?
    const noteOnPitch = Math.floor(pitch);
    if (!this._currentPitches.includes(noteOnPitch))
      this._currentPitches.push(noteOnPitch);
    
    const now = this._context.currentTime;
    this._osc.frequency.setTargetAtTime(Lib220a.mtof(noteOnPitch), now, 0.001);

    // Q: What does `1` mean?
    if (this._currentPitches.length === 1)
      this._amp.gain.setTargetAtTime(1.0, now, 0.001);
  }

  noteOff(pitch, velocity, when) {
    // Q: What does this code do?
    const noteOffPitch = Math.floor(pitch);
    const index = this._currentPitches.indexOf(noteOffPitch);
    if (index > -1)
      this._currentPitches.splice(index, 1);
    
    // Q: What does `0` mean?
    if (this._currentPitches.length === 0) 
      this._amp.gain.setTargetAtTime(0.0, this._context.currentTime, 0.001);
  }

  param1(value, when) {
    const scaledValue = (value / 100) * 20 + 2;
    this._lfo.frequency.setTargetAtTime(
        scaledValue, this._context.currentTime, 0.001);
  }
  
  param2(value, when) {
    const scaledValue = (value / 100) * 1000 + 10;
    this._depth.gain.setTargetAtTime(
        scaledValue, this._context.currentTime, 0.001);
  }

  param3(value, when) {
    // TODO
  }
}

export default GeneratorModule;