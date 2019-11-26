import Lib220a from './Lib220.js';

class GeneratorModule {
  constructor(context) {
    this._context = context;
    this.output = new GainNode(this._context);
    
    this._lfo = new OscillatorNode(this._context);
    this._depth = new GainNode(this._context);
    this._osc = new OscillatorNode(this._context);
    this._amp = new GainNode(this._context);

    this._osc.type = 'sine';
    this._notePitch = null;
    this._osc.frequency.value = this._notePitch;

    this._amp.gain.value = 0.0;
    this._lfo.frequency.value = 8;
    this._depth.gain.value = 200;

    this._osc.connect(this._amp).connect(this.output);
    this._lfo.connect(this._depth).connect(this._osc.detune);
    this._osc.start();
    this._lfo.start();
    
    this._volume = 1.0;
    this._currentPitches = [];
  }

  async initialize() {}

  noteOn(pitch, velocity, when) {
    const now = this._context.currentTime;
    console.log(pitch);
    this._osc.frequency.setTargetAtTime(this._notePitch, now, 0.001); 
    this._amp.gain.setTargetAtTime(this._volume, now, 0.0001);
  }

  noteOff(pitch, velocity, when) {
    const now = this._context.currentTime;
    this._amp.gain.setTargetAtTime(0.0, now, 0.0001);
  }

  param1(value, when) {
    const now = this._context.currentTime;
    this._notePitch = Math.floor(Lib220a.mtof(value) * 10, now, 0.001);
    this._osc.frequency.setTargetAtTime(this._notePitch, this._context.currentTime, 0.001);
    return this._notePitch;
  }
  
  param2(value, when) {
    const now = this._context.currentTime;
    const scaledValue = (value / 100) * 10 + 1;
    this._lfo.frequency.setValueAtTime(scaledValue, now, 0.001);
  }

  param3(value, when) {
    const now = this._context.currentTime;
    this._volume = value / 95.00;
    this._amp.gain.setTargetAtTime(this._volume, now, 0.001);
  }
}

export default GeneratorModule;