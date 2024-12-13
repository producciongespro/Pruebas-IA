import { useState, useEffect } from "react";
import Card from "./Card";
import arrow from "../assets/arrow.png";
import correct from "../assets/correct.png";
import incorrect from "../assets/incorrect.png";

let index = 0;
export default function Home({ audios, feedBackAudios }) {
  const [isListening, setIsListening] = useState(false);
  const [current, setCurrent] = useState(audios[0]);
  const [recognition, setRecognition] = useState(null);
  const [showFeed, setShowFeed] = useState(false);
  const [result, setResult] = useState(false);
  const MAX_ITEMS = audios.length - 1;

  useEffect(() => {
    setupListening();
  }, []);

  useEffect(() => {
   // console.log("current", current);
  }, [current]);

  useEffect(() => {
    if (recognition) {
      let transcript;

      recognition.onstart = () => {
        setIsListening(true);
        console.log("Escuchando...");
      };

      recognition.onresult = (event) => {
        transcript = event.results[0][0].transcript;
        console.log("Texto reconocido:", transcript);
      };

      recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz:", event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        assesAnswer(transcript);
        console.log("Reconocimiento de voz terminado.");
      };
    }
  }, [recognition]);

  const setupListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Tu navegador no soporta el reconocimiento de voz.");
      return;
    }

    const tmpRecognition = new window.webkitSpeechRecognition();
    tmpRecognition.lang = "en-US"; // Configura el idioma, en este caso español
    tmpRecognition.continuous = false; // Detener después de una frase
    tmpRecognition.interimResults = false; // Solo resultados finales
    setRecognition(tmpRecognition);
  };

  const assesAnswer = (answer) => {
    console.log("index", index);

    const regex = new RegExp(audios[index].phrase, "i");
    const tmpResult = regex.test(answer);
    setResult(tmpResult)

    setShowFeed(true)

    if (tmpResult) {
      feedBackAudios.correct.play();
    } else {
      feedBackAudios.incorrect.play();
    }

    setTimeout(() => {
      setShowFeed(false)
    }, 1500);
  };

  const handleChangeCard = (direction) => {
    console.log(index, MAX_ITEMS);

    if (direction === "r") {     
      index < MAX_ITEMS &&  index++;      
    } else if (direction === "l") {
      index > 0 && index--
    }
    setCurrent(audios[index]);
  };

  return (
    <div className="container">
      <div className="row mt-2">
        <div className="col-6">
          <h1> Chat with Jimena </h1>
        </div>
        <div className="col-6">
          {
            showFeed && <img src= { result ?  correct : incorrect } alt="result" className="img-fluid" />
          }
        </div>
      </div>

      <div className="row">
        <div className="col-4 text-end">
        <img
            src={arrow}
            alt="flecha atrás"
            className="img-fluid mt-5 horizontal"
            role={"button"}
            onClick={() => handleChangeCard("l")}
          />
        </div>
        <div className="col-4">
          <Card
            current={current}
            recognition={recognition}
            isListening={isListening}
          />
        </div>
        <div className="col-4">
          <img
            src={arrow}
            alt="flecha adelante"
            className="img-fluid mt-5"
            role={"button"}
            onClick={() => handleChangeCard("r")}
          />
        </div>
      </div>
    </div>
  );
}
