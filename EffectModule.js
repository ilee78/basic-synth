class EffectModule {
  // Constructor takes in audioContext from script.js
  constructor(context) {
    // Takes in input from GeneratorModule GainNode
    this._context = context;
    this.input = new GainNode(this._context);
    this.output = new GainNode(this._context);
    
    // Nodes for delay parameter (param1)
    this._delay = new DelayNode(this._context);
    this._lfo = new OscillatorNode(this._context);
    this._feedback = new GainNode(this._context);
    this._depth = new GainNode(this._context);
    this.input.connect(this._delay).connect(this.output);
    this._lfo.connect(this._depth).connect(this._delay.delayTime);
    
    // Nodes for dry/wet parameter (param2)
    this._convolver = new ConvolverNode(this._context);
    this._wet = new GainNode(this._context);
    this._dry = new GainNode(this._context);
    
    // Nodes for panner parameter (param3)
    this._panner = new PannerNode(this._context);
    this.input.connect(this._panner).connect(this._wet).connect(this.output);
    this.input.connect(this._panner).connect(this._dry).connect(this.output);
    this._panner.panningModel = "HRTF";
    this._panner.positionY.value = 0.1;
    
    this._wet.gain.value = 0.5;
    this._dry.gain.value = 0.5;
    
    // Outputs to audioContext destination --> speakers
    this.input.connect(this._convolver).connect(this._wet).connect(this.output);
    this.input.connect(this._dry).connect(this.output);
  }

  /*
   * INITIALIZATION
   * Takes in impulse file and decodes audio in preparation for ConvolverNode.
   * The file that is used currently is a breath impulse. You can use a water impulse
   * if you comment out the current file and uncomment the file in the previous line.
   */
  async initialize() {
    // water impulse:
    //const file = 'https://cdn.glitch.com/c44791c8-02d2-4f00-87fb-fa398dfbec75%2Fwater-swirl.wav?v=1574729613476';
    
    // breath impulse:
    const file = 'https://cdn.glitch.com/c44791c8-02d2-4f00-87fb-fa398dfbec75%2Fbreath.wav?v=1574729612779';
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    this._convolver.buffer = await this._context.decodeAudioData(arrayBuffer);
  }
  
  close() {}

  /*
   * DELAY PARAMETER
   * Takes in keyCode as value and scales delay time value accordingly. Feedback gain,
   * LFO frequency value, depth gain value optimized for flanging effect.
   */
  param1(value, when) {
    this._lfo.start();
    this._delay.delayTime.value = value * 0.05;
    this._feedback.gain.value = 0.25;
    this._lfo.frequency.value = 0.2;
    this._depth.gain.value = 0.006;
  }

  /*
   * DRY/WET PARAMETER
   * Takes in keyCode as value and distrubtes dry/wet ratio accordingly.
   */
  param2(value, when) {
    const now = this._context.currentTime;
    const scaledValue = value / 100;
    this._wet.gain.setTargetAtTime(scaledValue, now, 0.001);
    this._dry.gain.setTargetAtTime(1.0 - scaledValue, now, 0.001);
  }

  /*
   * PANNER PARAMETER
   * Takes in x and y coordinates of user's mouse as values and scales positions
   * sound source in space accordingly.
   */
  param3(event, userX, userY) {
    const rect = event.target.getBoundingClientRect();
    const later = this._context.currentTime + 0.07;
    userX = event.clientX - rect.left;
    userY = event.clientY - rect.top;

    const x = (30 * 3.14 * (-1))/ (userX - 100);
    const z = (30 * 3.14) / (userY - 100);
    const y = (userX - 100) / 100;
    this._panner.positionX.linearRampToValueAtTime(Math.sin(x), later);
    this._panner.positionZ.linearRampToValueAtTime(Math.cos(z), later);
    this._panner.positionY.linearRampToValueAtTime(y, later);
  }
}

export default EffectModule;