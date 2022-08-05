import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update, child, remove} from "firebase/database";


import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";

const WinnersPage = ({soundPlaying}) =>{

    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateResetToRoom = useNavigate();
    const [isPlaying, setIsPlaying] = useState()
    const [users, setUsers] = useState();
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    
    
    const handleRedirectToRoom = () =>{
        const resetScore = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/`);
        update(resetScore, {score: 0})
        const updateUsersPath = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`), orderByChild('createdAt'))
        set(updateUsersPath,{userPath: ''})    
    }

    useEffect(()=>{
        const redirectToRoom = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/userPath/`), orderByChild('createdAt'));
        onValue(redirectToRoom, (snapshot)=>{
            if(snapshot.val() === ''){
                navigateResetToRoom(`/room/:${roomIDFromUrl.substring(1)}`);
            }
        })
    },[])

    //get users data
    useEffect(()=>{
        onValue(query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/score/`), orderByChild('score')), (snapshot) => {
            const userList = []
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })
            setUsers(userList)
        });
    },[])

   

    

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
                        <button className="next-page-btn" onClick = {handleRedirectToRoom}>Дальше</button> : 
                        null
                    }        
                </article>

            </Container>

        </main>
    )
}
export default WinnersPage