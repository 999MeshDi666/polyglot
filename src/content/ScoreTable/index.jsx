import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'

import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";

import {fbaseDB} from '../../utils/firebase-config'
import { ref,set, onValue, orderByChild, query, update, increment } from "firebase/database";


const ScoreTable = ({soundPlaying}) =>{

  
    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateToGameplay = useNavigate();
    const navigateToRoom = useNavigate();
    const [isPlaying, setIsPlaying] = useState()
    const [users, setUsers] = useState();
    const [score, setScore] = useState()

    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    const handleRedirect = () =>{

       
        //update queueCounter
        set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue-counter/`), {
           queueCounter: increment(1)
        })
  
        if(score === 20){
            const updateUsersPath = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`)
            set(updateUsersPath,{userPath: 'winners/'})  

        }else{
            const updateUsersPath = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`)
            set(updateUsersPath,{userPath: `gameplay/${gameIDFromUrl}/`})  
        }
        update(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}`),{isPlaying: false})
       
    }

    useEffect(()=>{
        const startGameData = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/userPath/`);
        onValue(startGameData, (snapshot)=>{
            if(snapshot.val() === 'winners/'){
                navigateToRoom(snapshot.val())
            }
            else if(snapshot.val() === `gameplay/${gameIDFromUrl}`){
                navigateToGameplay(-1)
                
            }
        })
    },[roomIDFromUrl])

    useEffect(()=>{
      
        onValue(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/score/`), (snapshot)=>{
            setScore(snapshot.val())
        })

    },[roomIDFromUrl])

    //get users data
    useEffect(()=>{
        onValue(usersDataRef, (snapshot) => {

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

    return(
        <main className="score-table"> 
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article className="score-table__block content-block">
                    <h1 className="content-block__title">Таблица очков</h1>
                    <div>
                        <span className="score-table__subtitles">
                            <p>Игроки</p>
                            <p>Счет</p>
                        </span>
                        <div>
                            {users ? users.map((user)=>(
                                <div className = "score-table__user-score" key={user.nickname}>
                                    <div className = "score-table__user">
                                        <div className='user-crown-pos'>
                                            <img src={user.image} className="user-image"/>
                                            <span style={user.isOwner ? {display: 'inline'} : {display: 'none'}} className='owner-crown icon-crown'/>
                                        </div>
                                        <h4 className="score-table__user-nickname">{user.nickname}</h4>
                                    </div>
                                    
                                    <p className="score-table__score">{user.score}</p>
                                   
                                </div>

                            )): ' '}
                            
                        </div>
                    </div>
                    {isPlaying ? 
                        <button className="next-page-btn" onClick={handleRedirect}>Дальше</button> : 
                        null
                    }        
                </article>
                
            </Container>
        </main>

    )
}

export default ScoreTable;