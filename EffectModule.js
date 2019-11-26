class EffectModule {
  constructor(context) {
    this._context = context;
    this.input = new GainNode(this._context);
    this.output = new GainNode(this._context);
    
    this._convolver = new ConvolverNode(this._context);
    this._wet = new GainNode(this._context);
    this._dry = new GainNode(this._context);
    
    this._panner = new PannerNode(this._context);
    this.input.connect(this._panner).connect(this._wet).connect(this.output);
    this._panner.panningModel = "HRTF";
    this._panner.positionY.value = 0.1;
    this.x;
    
    this._osc = new OscillatorNode(this._context);

    this._biquad = new BiquadFilterNode(this._context);
    this._biquad.type = 'peaking';
    //this._osc.connect(this._biquad).connect(this._wet).connect(this.output);
    
    this._wet.gain.value = 0.5;
    this._dry.gain.value = 0.5;

    //this.input.connect(this._wet).connect(this.output);
    this.input.connect(this._biquad).connect(this._wet).connect(this.output);
    
    this.input.connect(this._convolver).connect(this._wet).connect(this.output);
    this.input.connect(this._dry).connect(this.output);
  }

  async initialize() {
    const file = 'https://cdn.glitch.com/c44791c8-02d2-4f00-87fb-fa398dfbec75%2Fwater-swirl.wav?v=1574729613476';
    //const file = 'https://cdn.glitch.com/c44791c8-02d2-4f00-87fb-fa398dfbec75%2Fbreath.wav?v=1574729612779';
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    this._convolver.buffer = await this._context.decodeAudioData(arrayBuffer);
    
  }
  
  close() {}

  param1(value, when) {
    this.x = value;
    const later = this._context.currentTime + 0.07;
    this._panner.positionX.linearRampToValueAtTime(Math.sin(this.x), later);
    this._panner.positionZ.linearRampToValueAtTime(Math.cos(this.x), later);
  }

  param2(value, when) {
    const now = this._context.currentTime;
    const scaledValue = value / 100;
    this._wet.gain.setTargetAtTime(scaledValue, now, 0.001);
    this._dry.gain.setTargetAtTime(1.0 - scaledValue, now, 0.001);
  }

  param3(event, userX, userY) {
    const rect = event.target.getBoundingClientRect();
    userX = event.clientX - rect.left;
    userY = event.clientY - rect.top;

    const x = (userX - 100)
    const z = (userY - 100)
    this._panner.positionX.linearRampToValueAtTime
    
    const frequency = (userX / 200) * 880 + 110;
    const cutoff = (1 - userY / 200) * 3520 + 440;
    const later = this._context.currentTime + 0.04;
    //this.input.gain.exponentialRampToValueAtTime(frequency, later);
    this._biquad.frequency.exponentialRampToValueAtTime(frequency, later);
  }
}

export default EffectModule;