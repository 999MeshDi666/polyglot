import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update, child, increment} from "firebase/database";

import { useSpeechSynthesis, useSpeechRecognition } from "react-speech-kit";
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";



// const synth = window.speechSynthesis;
// let voices = [];



// const getVoices = () => {
//     voices = synth.getVoices();
//     console.log(voices)
// };
// if(synth.onvoiceschanged !== undefined) {
//     synth.onvoiceschanged = getVoices;
// }


const Gameplay = ({soundPlaying}) =>{

  
    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateToScoreTable = useNavigate();

    const [isPlaying, setIsPlaying] = useState()
    const [counter, setCounter] = useState(10);
    const [quserNickname, setquserNickname] = useState('')
    const [userWord, setUserWord] = useState('')

    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))
    const [queue, setQueue] = useState()
    const [score, setScore] = useState()

    const [synthWord, setSynthWord] = useState(null);
    const [voiceIndex, setVoiceIndex] = useState(null);
    const [lang, setLang] = useState(null)
   
    const [speechWord, setSpeechWord] = useState();
    const { speak, voices } = useSpeechSynthesis();
    // console.log('voices', voices)
    let curVoice = voices[voiceIndex] || null

    const handleRedirectToScoreTable = () =>{
        //update current users path 
        const updateUsersPath = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`), orderByChild('createdAt'))
        set(updateUsersPath,{userPath: `scores/`})    

    }

    const onResult = (result) => {
        setSpeechWord(result);
        setUserWord(result)
        console.log(result); 
    }
    const onEnd = ()=>{
        if(userWord.toLocaleLowerCase() === synthWord.toLocaleLowerCase()){
            alert('nice')


            let userList = []
            onValue(usersDataRef, (snapshot)=>{
                snapshot.forEach((child) =>{
                    userList.push(child.val())
                })
            })
            update(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userList[queue]['uuid']}/`), {
                score: increment(10)
            })

        }else{
            alert('Woooooooooooo')
        }
        
    }
    
  

    const {listen, stop } = useSpeechRecognition({
        onResult,
        onEnd
    });

 
    //redirect to scores table
    useEffect(()=>{

        const startGameData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/userPath/`), orderByChild('createdAt'));
        onValue(startGameData, (snapshot)=>{
            if(snapshot.val() === 'scores/'){
                navigateToScoreTable(snapshot.val())
            }
           
        })
    },[roomIDFromUrl, userID])


   //get users playing state
   useEffect(()=>{
        const getPlayingData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isPlaying/`), orderByChild('createdAt'))
        onValue(getPlayingData, (snapshot) => {
            setIsPlaying(snapshot.val())
        })
    },[roomIDFromUrl, userID])
    

    const setNewQueue = (userList, totalUserSize) =>{
        onValue(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue-counter/queueCounter`), (snapshot) => {
               
            if(snapshot.val() === totalUserSize){
                // const updateUserPlaying = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userList[0]['uuid']}`), orderByChild('createdAt'))
                // update(updateUserPlaying , {isPlaying: true}) 
                set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue-counter/`), {
                    queueCounter: 0
                })
                //set queue of users
                set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue/`), userList[0])
            }
        })
    }
    const createQueue = () =>{
        let userList = []

        onValue(usersDataRef, (snapshot) => {
            let totalUserSize = snapshot.size
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })

            let qCounter;
            onValue(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue-counter/queueCounter`), (snapshot) => {
                qCounter = snapshot.val()
                setQueue(snapshot.val())

            })

            //update next isPlaying on true 
            // const updateUserPlaying = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userList[qCounter]['uuid']}/`), orderByChild('createdAt'))
            // update(updateUserPlaying ,{isPlaying: true}) 

            //set queue of users
            set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue/`), userList[qCounter])

            setNewQueue(userList, totalUserSize)    
        });
    }
    
    useEffect(()=>{

        //update hasStarted on true 
        set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/start-game/`), {hasStarted: true})

        onValue(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue/`), (snapshot)=>{
            const quser = snapshot.val()
            setquserNickname(quser['nickname'])
        })

        //set queue again
        createQueue()
    
    },[roomIDFromUrl])

    
    const setRandomWord = (langList) =>{
        let randLangIndex = Math.floor(Math.random() * langList.length);
        let chosenRandLang = langList[randLangIndex]
                
        const getGameplayData = ref(fbaseDB, `polyglot/gameplay/${gameIDFromUrl}/${chosenRandLang}`)
        onValue(getGameplayData, (snapshot) => {
            const gameData = snapshot.val()
            let randWordIndex = Math.floor(Math.random() * gameData['words'].length);
            console.log(gameData['words'][randWordIndex])
            set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-word/`), {
                word: gameData['words'][randWordIndex],
                voiceIndex: gameData['voiceIndex'],
                lang: gameData['lang']
            }).then(()=>{
                console.info('current word has been sended')
            }).catch((error)=>{
                console.error(error)
            })
                    
        })

    }
    //get game data
    useEffect(()=>{
        const getLangList = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/langs/chosenLangs`)
        onValue(getLangList, (snapshot) => {
            const langListData = snapshot.val()
    
            console.log('langListData', langListData)
            
            if(langListData[0] === 'all'){
                const getGameplayData = ref(fbaseDB, `polyglot/gameplay/${gameIDFromUrl}/`)
                let langKeys = []
                onValue(getGameplayData, (snapshot)=>{
                    snapshot.forEach((child)=>{
                        langKeys.push(child.key)
                    })
                    console.log('langKeys', langKeys)
                })
                setRandomWord(langKeys)
            }else{
                setRandomWord(langListData)
            }
        });
    
    },[roomIDFromUrl, gameIDFromUrl])

    useEffect(()=>{
        let currentWordData;
        const getCurrentWord = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-word/`)
        onValue(getCurrentWord, (snapshot) => { 
            currentWordData = snapshot.val();
        
            // console.log('voicess',{voices});
            setSynthWord(currentWordData['word']); 
            setLang(currentWordData['lang'])
            setVoiceIndex(currentWordData['voiceIndex'])
            // voices.forEach((voice) => {
            //     if (currentWordData['speakerIndex'] === voice.name) {
            //         setSpeaker(voice)
            //     }
            // }); 
           
            
        })
        
    },[roomIDFromUrl])

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
                        <h4 className="gameplay__user-name">говорит: {quserNickname}</h4>
                        <span className="gameplay__timer">
                            <p className="gameplay__timer-nums">{counter}</p>
                        </span>
                    </div>
                    <div className="gameplay__main-content">
                        <div className="mb-4">
                            <div className="gameplay__cur-word-block">
                                <button className="repeat-btn gameplay__repeat-btn" title="Повторить" onClick={()=> speak({ text: synthWord, voice: curVoice })}>
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
                            </button>: 
                            null
                        }               
                        <div className="mt-4">
                            <p  className="gameplay__cur-word-title">Произнес:</p>
                            <div className="content-block__body gameplay__word-container">
                                <p className="gameplay__cur-word">{speechWord}</p>
                            </div>
                        </div>
                    </div>     
                    {isPlaying ? 
                        <button className="next-page-btn" onClick={handleRedirectToScoreTable}>Дальше</button> : 
                        null
                    }             
                </article>
            </Container>
           
        </main>
    )
}

export default Gameplay