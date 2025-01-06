import faceapi from "./vendor/face-api-wrapper";

const loadModels = async () => {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.ageGenderNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
  ]);
  console.log("Modelos cargados");
};

const startVideoFeed = async (visorEl) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      //video: { width: 340, height: 260 },
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
