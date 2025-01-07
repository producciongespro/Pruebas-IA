import "./style.css";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";


let model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function loadModel() {
  model = await cocoSsd.load();
  // Show demo section now model is ready to use.
  document.getElementById("webcamButton").classList.remove("invisible");
  document.getElementById("mensaje").classList.add("invisible");
}

loadModel();

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  const enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", handleEnableCam);
} else {
  console.warn("getUserMedia() no es soportado por el navegador.");
}

async function startWebcam() {
  // getUsermedia parameters.
  const constraints = {
    video: true,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    video.addEventListener("loadeddata", () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      predictWebcam();
    });
  } catch (error) {
    console.error("Error accessing webcam: ", error);
  }
}




// Enable the live webcam view and start classification.
function handleEnableCam(event) {
  if (!model) {
    alert ("Un momento por favor. El modelo no está cargado todavía.");
    return;
  }

  // Hide the button.
  event.target.classList.add("invisible");

  

  // Activate the webcam stream.
  startWebcam();
}

// Prediction loop!
function predictWebcam() {
  // Now let's start classifying the stream.
  model.detect(video).then(function (predictions) {
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        console.log(predictions[n].class);
        //console.log(predictions[n].bbox[0]);
        const [x, y, width, height] = predictions[n].bbox;
        const confidence = Math.round(predictions[n].score * 100);
        // Dibujar rectángulo con borde verde
        
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Color verde semitransparente
        ctx.fillRect(x, y, width, height);
        
        ctx.strokeStyle = "red";        
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        ctx.font = "24px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(
          `${predictions[n].class} ${confidence}%`,
          x,
          y + 20 
        );
      }
    }

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}
