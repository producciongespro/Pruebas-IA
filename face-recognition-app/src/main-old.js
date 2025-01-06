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

const startVideoFeed = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    const videoFeedEl = document.getElementById("video-feed");
    videoFeedEl.srcObject = stream;

    videoFeedEl.onloadedmetadata = () => {
      const canvas = document.getElementById("canvas");
      canvas.width = videoFeedEl.videoWidth;
      canvas.height = videoFeedEl.videoHeight;
      processVideo(videoFeedEl, canvas);
      console.log("Video cargado");
    };
  } catch (error) {
    console.error("Error al acceder a la cámara:", error);
  }
};

const processVideo = async (videoFeedEl, canvas) => {
  const faceAIData = await faceapi
    .detectAllFaces(videoFeedEl)
    //.withFaceLandmarks()
    //.withFaceDescriptors()
    .withAgeAndGender();
  //.withFaceExpressions();

  // Aquí verificamos lo que contiene `faceAIData`
  console.log(faceAIData);

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  const resizedData = faceapi.resizeResults(faceAIData, videoFeedEl);
  faceapi.draw.drawDetections(canvas, resizedData);
  //faceapi.draw.drawFaceLandmarks(canvas, resizedData);
  //faceapi.draw.drawFaceExpressions(canvas, resizedData);

    // Opcional: dibujar edad y género en el canvas
    resizedData.forEach(face => {
      const { age, gender } = face;
      const text = `           Edad: ${Math.round(age)} años, Género: ${gender}`;
      const box = face.detection.box;

      context.font = "16px Arial";
      context.fillStyle = "red";
      context.fillText(text, box.x, box.y - 10); // Mostrar texto sobre la caja de detección
  });

  requestAnimationFrame(() => processVideo(videoFeedEl, canvas));
};

const run = async () => {
  await loadModels();
  await startVideoFeed();
};

run();
