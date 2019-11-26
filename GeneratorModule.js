import Lib220a from './Lib220.js';

class GeneratorModule {
  // Constructor takes in audioContext from script.js.
  constructor(context) {
    this._context = context;
    
    // Outputs sound to a GainNode that will serve as input to EffectModule
    this.output = new GainNode(this._context);
    
    // Nodes for frequency and LFO parameters (param1 and param2)
    this._lfo = new OscillatorNode(this._context);
    this._depth = new GainNode(this._context);
    this._osc = new OscillatorNode(this._context);
    this._amp = new GainNode(this._context);
    this._osc.type = 'sine';

    this._amp.gain.value = 0.0;
    this._lfo.frequency.value = 8;
    this._depth.gain.value = 200;
    
    this._osc.connect(this._amp).connect(this.output);
    this._lfo.connect(this._depth).connect(this._osc.detune);
    this._osc.start();
    this._lfo.start();
    
    // Private variable to use throughout GeneratorModule class
    this._notePitch = null;
    this._osc.frequency.value = this._notePitch;
    
    this._volume = 1.0;
    this._currentPitches = [];
  }

  async initialize() {}
  

  // Takes in event keyCode from pressed key. Sets frequency and volume.
  noteOn(pitch, velocity, when) {
    const now = this._context.currentTime;
    console.log(pitch);
    this._osc.frequency.setTargetAtTime(this._notePitch, now, 0.001); 
    this._amp.gain.setTargetAtTime(this._volume, now, 0.0001);
  }
  
  // Handles event when key is unpressed. Sets volume to 0.
  noteOff(pitch, velocity, when) {
    const now = this._context.currentTime;
    this._amp.gain.setTargetAtTime(0.0, now, 0.0001);
  }

  /*
   * FREQUENCY PARAMETER
   * Takes in keyCode as value and scales pitch accordingly. Sets oscillator
   * frequency to new pitch.
   */
  param1(value, when) {
    const now = this._context.currentTime;
    this._notePitch = Math.floor(Lib220a.mtof(value) * 10, now, 0.001);
    this._osc.frequency.setTargetAtTime(this._notePitch, this._context.currentTime, 0.001);
    return this._notePitch;
  }
  
  /*
   * LFO PARAMETER
   * Takes in keyCode as value and scales oscillations accordingly. Changes rate
   * of rhythmic pulses or oscillations.
   */
  param2(value, when) {
    const now = this._context.currentTime;
    const scaledValue = (value / 100) * 10 + 1;
    this._lfo.frequency.setValueAtTime(scaledValue, now, 0.001);
  }

  /*
   * VOLUME PARAMETER
   * Takes in keyCode as value and scales volume accordingly. Sets amplitude
   * gain to new volume.
   */
  param3(value, when) {
    const now = this._context.currentTime;
    this._volume = value / 95.00;
    this._amp.gain.setTargetAtTime(this._volume, now, 0.001);
  }
}

export default GeneratorModule;