import * as faceapi from 'face-api.js';

const SSD_MOBILENETV1 = 'ssd_mobilenetv1';
const TINY_FACE_DETECTOR = 'tiny_face_detector';

let selectedFaceDetector = SSD_MOBILENETV1;
let minConfidence = 0.5;
let inputSize = 512;
let scoreThreshold = 0.5;

const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ageDisplay = document.getElementById('age');

// Función para cargar los modelos
async function loadModels() {
  const MODEL_URL = '/weights';

  if (selectedFaceDetector === SSD_MOBILENETV1) {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  } else {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  }

  await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
}

// Devuelve las opciones del detector facial actual
function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence })
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
}

// Inicializa la cámara
async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
}

// Detecta rostros en el video y muestra los resultados
async function detectFaces() {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, getFaceDetectorOptions())
      .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    if (detections.length > 0) {
      const { age } = detections[0];
      ageDisplay.textContent = Math.round(age);
    }
  }, 1000);
}

// Inicializa los controles dinámicos
function initControls() {
  const faceDetectorSelect = document.getElementById('selectFaceDetector');
  const minConfidenceInput = document.getElementById('minConfidence');
  const inputSizeInput = document.getElementById('inputSize');
  const scoreThresholdInput = document.getElementById('scoreThreshold');
  const tinyFaceDetectorControls = document.getElementById('tinyFaceDetectorControls');

  // Cambiar entre detectores faciales
  faceDetectorSelect.addEventListener('change', async (e) => {
    selectedFaceDetector = e.target.value;

    tinyFaceDetectorControls.style.display =
      selectedFaceDetector === TINY_FACE_DETECTOR ? 'block' : 'none';

    await loadModels(); // Recargar modelos al cambiar de detector
  });

  // Ajustar minConfidence
  minConfidenceInput.addEventListener('input', (e) => {
    minConfidence = parseFloat(e.target.value);
  });

  // Ajustar inputSize
  inputSizeInput.addEventListener('input', (e) => {
    inputSize = parseInt(e.target.value);
  });

  // Ajustar scoreThreshold
  scoreThresholdInput.addEventListener('input', (e) => {
    scoreThreshold = parseFloat(e.target.value);
  });
}

// Inicializa la aplicación
async function init() {
  await loadModels();
  await startVideo();

  video.addEventListener('play', () => {
    detectFaces();
  });

  initControls();
}

init();
