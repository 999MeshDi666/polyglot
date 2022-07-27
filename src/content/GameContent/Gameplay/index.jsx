import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {fbaseDB} from '../../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update } from "firebase/database";
import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";



const synth = window.speechSynthesis;
let voices = [];

let myWord;

const getVoices = () => {
    voices = synth.getVoices();
    console.log(voices);
};
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}


const Gameplay = ({ synthWord, speaker, isPlaying}) =>{

   
    const {roomIDFromUrl} = useParams();
    const [counter, setCounter] = useState(10);
    const [speechWord, setSpeechWord] = useState();
    const { speak } = useSpeechSynthesis();

    const {listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            setSpeechWord(result);
            console.log(result); 
        },
    });

    const handleSynthWord = () => {
        voices.forEach((voice) => {
            if (speaker === voice.name) {
                speak({ text: synthWord, voice: voice });
            }
        }); 
    }
   
  


    //downcount timer
    useEffect(() => {
        const timer =
          counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
        return () => clearInterval(timer);
    }, [counter]);

    return(
        <div>
            <div className="gameplay__userName-timer">
                <h4 className="gameplay__user-name">говорит: Name</h4>
                <span className="gameplay__timer">
                    <p className="gameplay__timer-nums">{counter}</p>
                </span>
            </div>
            <div className="gameplay__main-content">
                <div className="mb-4">
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
                {isPlaying ? 
                    <button 
                        disabled={counter === 0 ? false : true}
                        className="gameplay__mic-btn" 
                        onMouseDown={listen} 
                        onMouseUp={stop} 
                        onTouchStart={listen} 
                        onTouchEnd={stop}
                    >
                        <span className="icon-mic"></span>
                    </button> : null}
                
                <div className="mt-4">
                    <p  className="gameplay__cur-word-title">Произнес:</p>
                    <div className="content-block__body gameplay__word-container">
                        <p className="gameplay__cur-word">{speechWord}</p>
                    </div>
                </div>
            </div>  
        </div>
    )
}
export default Gameplay