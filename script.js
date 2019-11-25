import GeneratorModule from './GeneratorModule.js';
import EffectModule from './EffectModule.js';

const context = new AudioContext();
const gen = new GeneratorModule(context);
const efx = new EffectModule(context);

let canvas = null;
let context2D = null;
let taskId = null;
let userX = null;
let userY = null;

gen.output.connect(efx.input);
efx.output.connect(context.destination);

const handleStartButtonClick = (event) => {
  context.resume();
  event.srcElement.disabled = true;
};

const handleFreqSlider = (event) => {
  gen.param1(event.srcElement.valueAsNumber);
  //gen.noteOn(gen.param1(event.srcElement.valueAsNumber));
}

const handleLfoSlider = (event) => {
  gen.param2(event.srcElement.valueAsNumber);
}

const handleVolSlider = (event) => {
  gen.param3(event.srcElement.valueAsNumber);
}

const handleCanvas = (event) => {
  const rect = event.target.getBoundingClientRect();
  const width = canvas.width;
  const height = canvas.height;
  userX = event.clientX - rect.left;
  userY = event.clientY - rect.top;
  efx.param1(rect, width, height, userX, userY);
  // const frequency = (userX / canvas.width) * 880 + 110;
  // const cutoff = (1 - userY / canvas.height) * 3520 + 440;
  // const later = context.currentTime + 0.04;
  // osc.frequency.exponentialRampToValueAtTime(frequency, later);
  // biquad.frequency.exponentialRampToValueAtTime(cutoff, later);
}

// const handleLfoFreqSlider = (event) => {
//   gen.param1(event.srcElement.valueAsNumber);
// };

// const handleLfoDepthSlider = (event) => {
//   gen.param2(event.srcElement.valueAsNumber);
// };

// const handleReverbMixSlider = (event) => {
//   efx.param1(event.srcElement.valueAsNumber);
// };

const handleKeyDownEvent = (event) => {
  gen.noteOn(event.keyCode);
};

const handleKeyUpEvent = (event) => {
  gen.noteOff(event.keyCode);
};

const render = () => {
  context2D.clearRect(0, 0, canvas.width, canvas.height);
  context2D.fillRect(userX - 5, userY - 5, 10, 10);
  taskId = requestAnimationFrame(render);
};

const setup = async () => {
  await gen.initialize();
  await efx.initialize();

  const buttonElement = document.querySelector('#button-start');
  const freqSliderElement = document.querySelector('#slider-1');
  const lfoSliderElement = document.querySelector('#slider-2');
  const volSliderElement = document.querySelector('#slider-3');
  //const depthSliderElement = document.querySelector('#slider-2');
  //const reverbSliderElement = document.querySelector('#slider-3');
  
  buttonElement.addEventListener('click', handleStartButtonClick, {once: true});
  freqSliderElement.addEventListener('input', handleFreqSlider);
  lfoSliderElement.addEventListener('input', handleLfoSlider);
  volSliderElement.addEventListener('input', handleVolSlider);
  //freqSliderElement.addEventListener('input', handleLfoFreqSlider);
  //depthSliderElement.addEventListener('input', handleLfoDepthSlider);
  //reverbSliderElement.addEventListener('input', handleReverbMixSlider);
  
  canvas = document.getElementById('xy-pad');
  context2D = canvas.getContext('2d');
  canvas.addEventListener('mousemove', handleCanvas);
  render();

  window.addEventListener('keydown', handleKeyDownEvent);
  window.addEventListener('keyup', handleKeyUpEvent);

  // Everything is ready to go. Let's activate the start button.
  buttonElement.disabled = false;
};

window.addEventListener('load', setup, {once: true});