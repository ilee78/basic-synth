import GeneratorModule from './GeneratorModule.js';
import EffectModule from './EffectModule.js';

const context = new AudioContext();
const gen = new GeneratorModule(context);
const efx = new EffectModule(context);

gen.output.connect(efx.input);
efx.output.connect(context.destination);

const handleStartButtonClick = (event) => {
  context.resume();
  event.srcElement.disabled = true;
};

const handleLfoFreqSlider = (event) => {
  gen.param1(event.srcElement.valueAsNumber);
};

const handleLfoDepthSlider = (event) => {
  gen.param2(event.srcElement.valueAsNumber);
};

const handleReverbMixSlider = (event) => {
  efx.param1(event.srcElement.valueAsNumber);
};

const handleKeyDownEvent = (event) => {
  gen.noteOn(event.keyCode);
};

const handleKeyUpEvent = (event) => {
  gen.noteOff(event.keyCode);
};

const setup = async () => {
  await gen.initialize();
  await efx.initialize();

  const buttonElement = document.querySelector('#button-start');
  const freqSliderElement = document.querySelector('#slider-1');
  const depthSliderElement = document.querySelector('#slider-2');
  const reverbSliderElement = document.querySelector('#slider-3');
  
  buttonElement.addEventListener('click', handleStartButtonClick, {once: true});
  freqSliderElement.addEventListener('input', handleLfoFreqSlider);
  depthSliderElement.addEventListener('input', handleLfoDepthSlider);
  reverbSliderElement.addEventListener('input', handleReverbMixSlider);

  window.addEventListener('keydown', handleKeyDownEvent);
  window.addEventListener('keyup', handleKeyUpEvent);

  // Everything is ready to go. Let's activate the start button.
  buttonElement.disabled = false;
};

window.addEventListener('load', setup, {once: true});