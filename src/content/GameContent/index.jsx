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
    const [isPlaying, setIsPlaying] = useState()
    const [siwtchContent, setSwitchContent] = useState(false)

    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))


    const handleSwitchContent = () =>{

        setSwitchContent((prevState) => !prevState)
    }
  
    //get users playing state
    useEffect(()=>{

        const getPlayingData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isPlaying/`), orderByChild('createdAt'))
        onValue(getPlayingData, (snapshot) => {
            setIsPlaying(snapshot.val())
        })
    },[roomIDFromUrl.substring(1)])

    return(
        <main className="gameplay"> 
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article className="gameplay__block content-block" >
                    {siwtchContent?  <ScoreTable/>: <Gameplay/>}
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