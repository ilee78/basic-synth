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
    
    this._waveshaper = new WaveShaperNode(this._context);
    this._send = new GainNode(this._context);
    this._delay = new DelayNode(this._context);
    this._feedback = new GainNode(this._context);
    this._plate = new ConvolverNode(this._context);
    this._cabinet = new ConvolverNode(this._context);
    
    this._waveshaper.connect(this._cabinet).connect(this._wet);
    this._waveshaper.connect(this._send);
    this._send.connect(this._delay).connect(this._feedback).connect(this._delay);
    this._delay.connect(this._plate)
    
    // this._compressor = new DynamicsCompressorNode(this._context);
    // this._makeup = new GainNode(this._context);
    // this._compressor.connect(this._makeup).connect(this.output);
    
    this._wet.gain.value = 0.5;
    this._dry.gain.value = 0.5;

    this.input.connect(this._wet).connect(this.output);
    //this.input.connect(this._convolver).connect(this._wet).connect(this.output);
    this.input.connect(this._dry).connect(this.output);
  }

  async initialize() {
    const file = 'https://cdn.glitch.com/c44791c8-02d2-4f00-87fb-fa398dfbec75%2Fpapercrumble.wav.crdownload.wav?v=1574717761204';
    const response = await fetch(file);
    const arrayBuffer = await response.arrayBuffer();
    this._convolver.buffer = await this._context.decodeAudioData(arrayBuffer);
  }

  close() {}

  param1(value, when) {
    this.x = value;
    const later = this._context.currentTime + 0.07;
    this._panner.positionX.linearRampToValueAtTime(Math.sin(this.x), later);
    this._panner.positionZ.linearRampToValueAtTime(Math.cos(this.x + 2.00), later);
  }


  param2(value, when) {
    
    
    // const scaledValue = value / 400.0;
    // this._compressor.threshold.value = 20;
    // this._compressor.ratio.value = scaledValue;
    // this._makeup.gain.value = Math.pow(10.0, scaledValue);
    //const now = this._context.currentTime;
    //this._wet.gain.setTargetAtTime(scaledValue, now, 0.001);
    //this._dry.gain.setTargetAtTime(1.0 - scaledValue, now, 0.001);
  }

  param3(value, when) {}
}

export default EffectModule;