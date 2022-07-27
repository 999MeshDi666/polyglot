import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update } from "firebase/database";

import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";





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


const Gameplay = ({soundPlaying}) =>{

  
    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateToScoreTable = useNavigate();

    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    const [counter, setCounter] = useState(10);
    const [synthWord, setSynthWord] = useState();
    const [speaker, setSpeaker] = useState();
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

    const handleRedirectScorePage = () =>{
       
       
    }
  


    //get game data
    // useEffect(()=>{

    //     const getLangList = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/langs/chosenLangs`)
    //     onValue(getLangList, (snapshot) => {
    //         const langListData = []
    //         snapshot.forEach((child) =>{
    //             langListData.push(child.val())
    //         })
            
    //         let randLangIndex = Math.floor(Math.random() * langListData.length);
    //         let chosenRandLang = langListData[randLangIndex]
    //         console.log('chosenRandLang',chosenRandLang)

          
    //         const getGameplayData = ref(fbaseDB, `polyglot/gameplay/${gameIDFromUrl}/${chosenRandLang}`)
    //         onValue(getGameplayData, (snapshot) => {

    //             const gameData = snapshot.val()
    //             let randWordIndex = Math.floor(Math.random() * gameData['words'].length);

    //             set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-word/`), {
    //                 word: gameData['words'][randWordIndex],
    //                 speaker: gameData['speaker']
    //             }).then(()=>{
    //                 console.info('current word has been sended')
    //             }).catch((error)=>{
    //                 console.error(error)
    //             })
                
    //         })
            
    //     });
      

    // },[roomIDFromUrl.substring(1), gameIDFromUrl])

    // useEffect(()=>{
    //    const getCurrentWord = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-word/`)
    //    onValue(getCurrentWord, (snapshot) => { 
    //         const currentWordData = snapshot.val();
    //         setSpeaker(currentWordData['speaker'])
    //         setSynthWord(currentWordData['word']);
    //         handleSynthWord()
          
    //    })
    
    // },[roomIDFromUrl.substring(1), speak])


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
                    <a className="gameplay__nextPage" onClick={handleRedirectScorePage}>Дальше</a>           
                </article>
            </Container>
           
        </main>
    )
}

export default Gameplay