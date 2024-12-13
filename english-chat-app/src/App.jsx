import { useState, useEffect } from "react";
import Preloader from "./components/Preloader";
import Home from "./components/Home";
import items from "../data/items.json";


export default function App() {
  const [audios, setAudios] = useState(null);
  const [feedBackAudios, setFeedBackAudios] = useState(null);

  useEffect(() => {
    setup();
  }, []);

  const setup = () => {

    setFeedBackAudios (
      {
        correct: new Audio("./audios/correct.mp3"),
        incorrect: new Audio("./audios/incorrect.mp3")
      }
    )


    const tmpAudios = [];
    items.forEach((item) => {
      const newAudio = {
        id: item.id,
        title: item.title,
        desc: item.desc,
        phrase: item.phrase,
        audio: new Audio(`./audios/${item.audioFile}.${item.ext}`),
      };
      tmpAudios.push(newAudio);
    });    

    
    setTimeout(() => {
      setAudios(tmpAudios);
    }, 500);
  };



  return (
    <div className="contanier">
      {(audios && feedBackAudios ) ? (
        <Home
          audios={audios}
          feedBackAudios={feedBackAudios}
        />
      ) : (
        <Preloader />
      )}
    </div>
  );
}
