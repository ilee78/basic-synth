class EffectModule {
  constructor(context) {
    this._context = context;
    this.input = new GainNode(this._context);
    this.output = new GainNode(this._context);
    
    t

    this._convolver = new ConvolverNode(this._context);
    this._wet = new GainNode(this._context);
    this._dry = new GainNode(this._context);

    this._wet.gain.value = 0.5;
    this._dry.gain.value = 0.5;

    this.input.connect(this._convolver).connect(this._wet).connect(this.output);
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
      // const frequency = (userX / canvas.width) * 880 + 110;
  // const cutoff = (1 - userY / canvas.height) * 3520 + 440;
  // const later = context.currentTime + 0.04;
  // osc.frequency.exponentialRampToValueAtTime(frequency, later);
  // biquad.frequency.exponentialRampToValueAtTime(cutoff, later);
    

  }

  param2(value, when) {}
    // const scaledValue = value / 20;
    // const now = this._context.currentTime;
    // this._wet.gain.setTargetAtTime(scaledValue, now, 0.001);
    // this._dry.gain.setTargetAtTime(1.0 - scaledValue, now, 0.001);
  param3(value, when) {}
}

export default EffectModule;