import * as faceapi from "face-api.js";

const loadModels = async () => {
  await Promise.all([
    //Detecta la cara y devuelve las coordenadas de la cara. Es el modelo más ligero y rápido
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models").then(() => console.log("SSD MobileNet cargado")),
    //Detecta la cara y devuelve las coordenadas de la cara 
    faceapi.nets.faceLandmark68Net.loadFromUri("./models").then(() => console.log("Face Landmark cargado")),
    //Compara la cara detectada con las caras conocidas (base de datos) y devuelve el nombre de la persona embeddings
    //faceapi.nets.faceRecognitionNet.loadFromUri("./models").then(() => console.log("Face Recognition cargado")),
    //Detecta la edad y el género de la persona detectada. Es un modelo muy ligero y rápido
    faceapi.nets.ageGenderNet.loadFromUri("./models").then(() => console.log("Age & Gender cargado")),
    //Detecta la expresión facial de la persona detectada. Emociones como felicidad, tristeza, enojo, sorpresa, neutral, miedo y asco
    //faceapi.nets.faceExpressionNet.loadFromUri("./models").then(() => console.log("Face Expression cargado")),
  ]);
  
};

const startVideoFeed = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 320, height: 240 },
      video: true,
      audio: false,
    });
    const videoFeedEl = document.getElementById("video-feed");
    const visorEl = document.getElementById("visor");
    videoFeedEl.srcObject = stream;
    

    videoFeedEl.onloadedmetadata = () => {      
      processVideo(videoFeedEl,  visorEl );
      console.log("Video cargado");
    };
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);
  }
};

// Historial de edades para estabilizar la detección
const ageHistory = [];
const maxHistorySize = 15;

const processVideo = async (videoFeedEl,  visorEl) => {
  const faceAIData = await faceapi
    .detectAllFaces(videoFeedEl)
    .withAgeAndGender();

  console.log(faceAIData);

  

  const resizedData = faceapi.resizeResults(faceAIData, videoFeedEl);
  

  resizedData.forEach((face) => {
    const { age, gender } = face;

    // Agregar la edad al historial
    ageHistory.push(age);
    if (ageHistory.length > maxHistorySize) {
      ageHistory.shift(); // Eliminar el valor más antiguo
    }

    // Calcular el promedio de las edades
    const smoothedAge =
      ageHistory.reduce((sum, a) => sum + a, 0) / ageHistory.length;

    // Dibujar texto en el canvas
    const text = `Edad: ${Math.round(smoothedAge)} años, Género: ${gender === "male" ?  "Masculino" :  "Femenino" }`;
    visorEl.innerHTML = text;
    

    
  });

  requestAnimationFrame(() => processVideo(videoFeedEl,  visorEl ));
  
};

const run = async () => {  
  await loadModels();
  await startVideoFeed();
};

run();
