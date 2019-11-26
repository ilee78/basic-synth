import GeneratorModule from './GeneratorModule.js';
import EffectModule from './EffectModule.js';

const context = new AudioContext();
const gen = new GeneratorModule(context);
const efx = new EffectModule(context);

gen.output.connect(efx.input);
efx.output.connect(context.destination);

let toggleState = false;
let canvas = null;
let context2D = null;
let taskId = null;
let userX = null;
let userY = null;

const handleStartButtonClick = (event) => {
  context.resume();
  event.srcElement.disabled = true;
};

const handleFreqSlider = (event) => {
  gen.param1(event.srcElement.valueAsNumber);
}

const handleLfoSlider = (event) => {
  gen.param2(event.srcElement.valueAsNumber);
}

const handleVolSlider = (event) => {
  gen.param3(event.srcElement.valueAsNumber);
}

const handlePanSlider = (event) => {
  efx.param1(event.srcElement.valueAsNumber);
}

const handleDryWetSlider = (event) => {
  efx.param2(event.srcElement.valueAsNumber);
}

const handleCanvas = (event) => {
  const rect = event.target.getBoundingClientRect();
  userX = event.clientX - rect.left;
  userY = event.clientY - rect.top;
  efx.param3(event, userX, userY);
}

const render = () => {
  context2D.clearRect(0, 0, canvas.width, canvas.height);
  context2D.fillRect(userX - 5, userY - 5, 10, 10);
  taskId = requestAnimationFrame(render);
}

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
  const lfoSliderElement = document.querySelector('#slider-2');
  const volSliderElement = document.querySelector('#slider-3');
  
  const panSliderElement = document.querySelector('#slider-4');
  const dryWetSliderElement = document.querySelector('#slider-5');
  canvas = document.getElementById('xy-pad');
  context2D = canvas.getContext('2d');
  
  buttonElement.addEventListener('click', handleStartButtonClick, {once: true});
  freqSliderElement.addEventListener('input', handleFreqSlider);
  lfoSliderElement.addEventListener('input', handleLfoSlider);
  volSliderElement.addEventListener('input', handleVolSlider);
  
  panSliderElement.addEventListener('input', handlePanSlider);
  dryWetSliderElement.addEventListener('input', handleDryWetSlider);
  canvas.addEventListener('mousemove', handleCanvas);
  render();

  window.addEventListener('keydown', handleKeyDownEvent);
  window.addEventListener('keyup', handleKeyUpEvent);

  buttonElement.disabled = false;
};

window.addEventListener('load', setup, {once: true});