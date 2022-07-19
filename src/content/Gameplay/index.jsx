import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import { useState, useEffect } from "react"
import UserBar from "../User-bar"
import { Container } from "react-bootstrap"
import press from "../../static/audio/press.mp3"
import release from "../../static/audio/release.mp3"

const voicePress = new Audio(press);
const voiceRelease = new Audio(release);

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
const Gameplay = () =>{

    const [speechWord, setSpeechWord] = useState();
    const [synthWord, setSynthWord] = useState();
    const { speak } = useSpeechSynthesis();
    const {listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            setSpeechWord(result);
            console.log(result);
        
        },
        
    });
    return(
        <main className="gameplay">
             <UserBar/>
             <Container>
                <article className="gameplay__block content-block">
                    <div className="gameplay__userName-timer">
                        <h4 className="gameplay__user-name">говорит: Name</h4>
                        <span className="gameplay__timer">
                            <p className="gameplay__timer-nums">10</p>
                        </span>
                    </div>
                    <div className="gameplay__main-content">
                        <div>
                            <div className="gameplay__cur-word-block">
                                <button className="repeat-btn gameplay__repeat-btn" title="Повторить">
                                    <span className="icon-repeat-btn"></span>
                                </button>
                                <p className="gameplay__cur-word-title">Произнеси:</p>
                            </div>
                            <div className="content-block__body gameplay__word-container">
                                <p className="gameplay__cur-word">Никотинамидадениндинуклеотидфосфатгидрин</p>
                            </div>
                        </div>
                        <button className="gameplay__mic-btn" onMouseDown={listen} onMouseUp={stop} onTouchStart={listen} onTouchEnd={stop}>
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