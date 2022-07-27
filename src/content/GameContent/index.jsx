import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update } from "firebase/database";


import ScoreTable from './ScoreTable';
import Gameplay from "./Gameplay";
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";




const GameContent = ({soundPlaying}) =>{
   

    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();

    const [isPlaying, setIsPlaying] = useState()
    const [siwtchContent, setSwitchContent] = useState(false)

    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    const [speaker, setSpeaker] = useState();
    const [synthWord, setSynthWord] = useState();

    console.log()
    useEffect(()=>{

        const getLangList = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/langs/chosenLangs`)
        onValue(getLangList, (snapshot) => {
            const langListData = []
            snapshot.forEach((child) =>{
                langListData.push(child.val())
            })
            
            let randLangIndex = Math.floor(Math.random() * langListData.length);
            let chosenRandLang = langListData[randLangIndex]
            console.log('chosenRandLang',chosenRandLang)

          
            const getGameplayData = ref(fbaseDB, `polyglot/gameplay/${gameIDFromUrl}/${chosenRandLang}`)
            onValue(getGameplayData, (snapshot) => {

                const gameData = snapshot.val()
                let randWordIndex = Math.floor(Math.random() * gameData['words'].length);

                set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-word/`), {
                    word: gameData['words'][randWordIndex],
                    speaker: gameData['speaker']
                }).then(()=>{
                    console.info('current word has been sended')
                }).catch((error)=>{
                    console.error(error)
                })
                
            })
            
        });
    
    },[roomIDFromUrl, gameIDFromUrl])

    useEffect(()=>{
       const getCurrentWord = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-word/`)
       onValue(getCurrentWord, (snapshot) => { 
            const currentWordData = snapshot.val();
            setSpeaker(currentWordData['speaker'])
            setSynthWord(currentWordData['word']);
          
       })
    
    },[roomIDFromUrl])
    

   
    const handleSwitchContent = () =>{
        setSwitchContent((prevState) => !prevState)
    }
  

    //get users playing state
    useEffect(()=>{
        const getPlayingData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isPlaying/`), orderByChild('createdAt'))
        onValue(getPlayingData, (snapshot) => {
            setIsPlaying(snapshot.val())
        })
    },[roomIDFromUrl, userID])
    
    return(
        <main className="gameplay"> 
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article className="gameplay__block content-block" >
                    {siwtchContent  ?  

                        <ScoreTable/> : 
                        <Gameplay synthWord = {synthWord} speaker = {speaker}/>}
                    {isPlaying ? 
                        <a className="gameplay__nextPage" onClick={handleSwitchContent}>Дальше</a> : 
                        null
                    }           
                </article>
            </Container>
           
        </main>
    )
}

export default GameContent