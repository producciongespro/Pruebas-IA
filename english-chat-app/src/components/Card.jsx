import  { useState, useEffect } from 'react';
import play from "../assets/play.png";
import avatar from "../assets/avatar.png";
import micOff from "../assets/microphone_off.png";
import micOn from "../assets/microphone_on.png";


export default function Card({current, recognition,  isListening }) {
    

    return (
        <div className="card">
        <div className="card-title">
          <h4> {current.title} </h4>
        </div>
        <div className="card-body">
          <img src={avatar} alt="Avatar" className="img-fluid" />
          <p>
            {current.desc}
          </p>
        </div>

        <div className="card-footer">
          <div className="row">
            <div className="col-6">
              <img
                src={play}
                alt="botón play"
                role={"button"}
                onClick={ ()=> current.audio.play() }
              />
            </div>

            <div className="col-6">
              <img
                src={isListening ? micOn : micOff}
                alt="botón play"
                role={"button"}
                onClick={ ()=> recognition.start() }
              />
            </div>
          </div>
        </div>
      </div>
    )
    
};
