import GeneratorModule from './GeneratorModule.js';
import EffectModule from './EffectModule.js';

const context = new AudioContext();
const gen = new GeneratorModule(context);
const efx = new EffectModule(context);

// AnalyserNode reference credits to music220a/09-nonlinear-effects GitHub
// https://github.com/ccrma/music220a/blob/master/09-nonlinear-effects/analyser/script.js
const ana = new AnalyserNode(context);
const waveformData = new Float32Array(2048);
const frequencyData = new Float32Array(2048);

// GeneratorModule output -> EffectModule input -> EffectModule output -> audioContext destination
gen.output.connect(efx.input);
// Connects EffectModule output to analyzer to render waveform visualization
efx.output.connect(ana);
efx.output.connect(context.destination);

// Variables to be used throughout the program
let toggleState = false;
let canvas = null;
let context2D = null;
let taskId = null;
let userX = null;
let userY = null;
let analyzer = null;
let contextAnalyzer = null;

/*
 * Handles when start button is clicked. Disables button after one click.
 * Renders the waveform analyzer.
 */
const handleStartButtonClick = (event) => {
  context.resume();
  event.srcElement.disabled = true;
  renderAnalyzer();
};

/*
 * Handles when frequency slider is changed. Passes in event element value as number, 
 * calls function from GeneratorModule to change frequency.
 */
const handleFreqSlider = (event) => {
  gen.param1(event.srcElement.valueAsNumber);
}

/*
 * Handles when LFO slider is changed. Passes in event element value as number, 
 * calls function from GeneratorModule to change oscillation/pulse rate.
 */
const handleLfoSlider = (event) => {
  gen.param2(event.srcElement.valueAsNumber);
}

/*
 * Handles when volume slider is changed. Passes in event element value as number, 
 * calls function from GeneratorModule to change loudness of sound.
 */
const handleVolSlider = (event) => {
  gen.param3(event.srcElement.valueAsNumber);
}

/*
 * Handles when delay slider is changed. Passes in event element value as number, 
 * calls function from EffectModule to change delay time.
 */
const handleDelaySlider = (event) => {
  efx.param1(event.srcElement.valueAsNumber);
}

/*
 * Handles when dry/wet slider is changed. Passes in event element value as number, 
 * calls function from EffectModule to change ratio of dry/wet sound.
 */
const handleDryWetSlider = (event) => {
  efx.param2(event.srcElement.valueAsNumber);
}

/*
 * Handles when panner pad is changed. Passes in user mouse position as set of coordinates,
 * calls function from EffectModule to change source of sound in space.
 */
const handleCanvas = (event) => {
  const rect = event.target.getBoundingClientRect();
  userX = event.clientX - rect.left;
  userY = event.clientY - rect.top;
  efx.param3(event, userX, userY);
}

// Recursive function that renders the rectangle that follows user's mouse on panner pad.
const render = () => {
  context2D.clearRect(0, 0, canvas.width, canvas.height);
  context2D.fillRect(userX - 5, userY - 5, 10, 10);
  context2D.fillStyle = "#ffffff";
  taskId = requestAnimationFrame(render);
}

// Recursive function that renders the analyzer according to output from EffectModule
const renderAnalyzer = () => {
  contextAnalyzer.clearRect(0, 0, analyzer.width, analyzer.height);
  renderWaveform();
  renderSpectrum();
  requestAnimationFrame(renderAnalyzer);
}

// Renders the spectrum of the sound from EffectModule output
const renderSpectrum = () => {
  ana.getFloatFrequencyData(frequencyData);
  const inc = analyzer.width / (frequencyData.length * 0.5);
  contextAnalyzer.beginPath();
  contextAnalyzer.moveTo(0, analyzer.height);
  for (let x = 0, i = 0; x < analyzer.width; x += inc, ++i)
    contextAnalyzer.lineTo(x, -frequencyData[i]);
  contextAnalyzer.strokeStyle = "#ffffff";
  contextAnalyzer.stroke();
}

// Renders the waveform of the sound from EffectModule output
const renderWaveform = () => {
  ana.getFloatTimeDomainData(waveformData);
  const inc = analyzer.width / waveformData.length;
  contextAnalyzer.beginPath();
  contextAnalyzer.moveTo(0, analyzer.height * 0.5);
  for (let x = 0, i = 0; x < analyzer.width; x += inc, ++i)
    contextAnalyzer.lineTo(x, (waveformData[i] * 0.5 + 0.5) * analyzer.height);
  contextAnalyzer.strokeStyle = "#ffffff";
  contextAnalyzer.stroke();
}

// Handles when key is pressed, calls function from GeneratorModule and passes in keyCode
const handleKeyDownEvent = (event) => {
  gen.noteOn(event.keyCode);
};

// Handles when key is unpressed, calls function from GeneratorModule and passes in keyCode
const handleKeyUpEvent = (event) => {
  gen.noteOff(event.keyCode);
};

/*
 * SET UP
 * Initializes GeneratorModule and EffectModule. Creates variables that are linked
 * to the button, slider, and canvas elements. Adds event listeners that will call
 * functions above. Renders panner pad and waveform analysis visualization.
 */
const setup = async () => {
  await gen.initialize();
  await efx.initialize();

  const buttonElement = document.querySelector('#button-start');
  
  const freqSliderElement = document.querySelector('#slider-1');
  const lfoSliderElement = document.querySelector('#slider-2');
  const volSliderElement = document.querySelector('#slider-3');
  
  const delaySliderElement = document.querySelector('#slider-4');
  const dryWetSliderElement = document.querySelector('#slider-5');
  canvas = document.getElementById('xy-pad');
  context2D = canvas.getContext('2d');
  
  buttonElement.addEventListener('click', handleStartButtonClick, {once: true});
  freqSliderElement.addEventListener('input', handleFreqSlider);
  lfoSliderElement.addEventListener('input', handleLfoSlider);
  volSliderElement.addEventListener('input', handleVolSlider);
  
  delaySliderElement.addEventListener('input', handleDelaySlider);
  dryWetSliderElement.addEventListener('input', handleDryWetSlider);
  canvas.addEventListener('mousemove', handleCanvas);
  render();
  
  analyzer = document.querySelector('#visualization');
  contextAnalyzer = analyzer.getContext('2d');
  
  window.addEventListener('keydown', handleKeyDownEvent);
  window.addEventListener('keyup', handleKeyUpEvent);

  buttonElement.disabled = false;
};

window.addEventListener('load', setup, {once: true});