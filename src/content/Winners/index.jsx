import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update, child} from "firebase/database";


import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";

const WinnersPage = ({soundPlaying}) =>{

    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateToRoom = useNavigate();
    const [isPlaying, setIsPlaying] = useState()
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

   

    //get users playing state
    useEffect(()=>{
        const getPlayingData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isPlaying/`), orderByChild('createdAt'))
        onValue(getPlayingData, (snapshot) => {
            setIsPlaying(snapshot.val())
        })
    },[roomIDFromUrl, userID])

    return (
        <main className="winners">
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article className="winners__block content-block">
                    <h1 className="content-block__title">Победители</h1>
                    <div>
                        
                    </div>
                    {isPlaying ? 
                        <button className="next-page-btn">Дальше</button> : 
                        null
                    }        
                </article>

            </Container>

        </main>
    )
}
export default WinnersPage