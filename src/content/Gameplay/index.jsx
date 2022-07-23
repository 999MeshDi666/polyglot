import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, orderByChild, query } from "firebase/database";

import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";

import sparklesTongue from "../../static/dictionaries/sparkles-tongue.json"




const synth = window.speechSynthesis;
let voices = [];
let currentWord;
let speakerName;
let myWord;


const getVoices = () => {
    voices = synth.getVoices();
    console.log(voices);
};
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}


const Gameplay = ({soundPlaying}) =>{

    const {roomIDFromUrl} = useParams();
    const [counter, setCounter] = useState(10);
    const [speechWord, setSpeechWord] = useState();
    const [synthWord, setSynthWord] = useState();
    const { speak } = useSpeechSynthesis();
    const {listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            setSpeechWord(result);
            console.log(result);
        
        },
        
    });

    const handleSynthWord = () => {
        let randWordIndex = Math.floor(Math.random() * sparklesTongue['rus'].length);
     
        speakerName = "Google русский";
        currentWord =  sparklesTongue['rus'][randWordIndex];
        voices.forEach((voice) => {
            if (speakerName === voice.name) {
                speak({ text: currentWord, voice: voice });
            }
        }); 
        setSynthWord(currentWord);

    }
    
 

    //downcount timer
    useEffect(() => {
        const timer =
          counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
      }, [counter]);

    return(
        <main className="gameplay"> 
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article className="gameplay__block content-block">
                    <div className="gameplay__userName-timer">
                        <h4 className="gameplay__user-name">говорит: Name</h4>
                        <span className="gameplay__timer">
                            <p className="gameplay__timer-nums">{counter}</p>
                        </span>
                    </div>
                    <div className="gameplay__main-content">
                        <div>
                            <div className="gameplay__cur-word-block">
                                <button className="repeat-btn gameplay__repeat-btn" title="Повторить" onClick={handleSynthWord}>
                                    <span className="icon-repeat-btn"></span>
                                </button>
                                <p className="gameplay__cur-word-title">Произнеси:</p>
                            </div>
                            <div className="content-block__body gameplay__word-container">
                                <p className="gameplay__cur-word">{synthWord}</p>
                            </div>
                        </div>
                        <button 
                            disabled={counter === 0 ? false : true}
                            className="gameplay__mic-btn" 
                            onMouseDown={listen} 
                            onMouseUp={stop} 
                            onTouchStart={listen} 
                            onTouchEnd={stop}
                        >
                            <span className="icon-mic"></span>
                        </button>
                        <div>
                            <p  className="gameplay__cur-word-title">Произнес:</p>
                            <div className="content-block__body gameplay__word-container">
                                <p className="gameplay__cur-word">{speechWord}</p>
                            </div>
                        </div>
                    </div>                
                </article>
            </Container>
           
        </main>
    )
}

export default Gameplay