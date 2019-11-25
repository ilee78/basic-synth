class EffectModule {
  constructor(context) {
    this._context = context;
    this.input = new GainNode(this._context);
    this.output = new GainNode(this._context);

    this._convolver = new ConvolverNode(this._context);
    this._wet = new GainNode(this._context);
    this._dry = new GainNode(this._context);

    this._wet.gain.value = 0.5;
    this._dry.gain.value = 0.5;

    this.input.connect(this._convolver).connect(this._wet).connect(this.output);
    this.input.connect(this._dry).connect(this.output);
  }

  async initialize() {
    const response = await fetch('./samples/reverb-ir.mp3');
    const arrayBuffer = await response.arrayBuffer();
    this._convolver.buffer = await this._context.decodeAudioData(arrayBuffer);
  }

  close() {}

  param1(value, when) {
    const scaledValue = value / 100;
    const now = this._context.currentTime;
    this._wet.gain.setTargetAtTime(scaledValue, now, 0.001);
    this._dry.gain.setTargetAtTime(1.0 - scaledValue, now, 0.001);
  }

  param2(value, when) {}

  param3(value, when) {}
}

export default EffectModule;