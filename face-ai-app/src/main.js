import * as faceapi from 'face-api.js';
import "./style.css";

const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ageDisplay = document.getElementById('age');

// Cargar modelos
const loadModels = async () => {
  const MODEL_URL = '/weights';
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
};

// Iniciar la cámara
const startVideo = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;
};

// Detectar caras y mostrar resultados
const detectFaces = async () => {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video)
      .withAgeAndGender();

    // Redimensionar resultados al tamaño del video
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // Limpiar el canvas y dibujar nuevas detecciones
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);

    // Mostrar la edad estimada
    if (detections.length > 0) {
      const { age } = detections[0];
      ageDisplay.textContent = Math.round(age);
    }
  }, 1000); // Actualizar cada segundo
};

// Inicializar la aplicación
const init = async () => {
  await loadModels();
  await startVideo();

  video.addEventListener('play', () => {
    detectFaces();
  });
};

init();
