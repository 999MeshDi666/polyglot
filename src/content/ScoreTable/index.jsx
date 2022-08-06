import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'

import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";

import {fbaseDB} from '../../utils/firebase-config'
import { ref,set, onValue, orderByChild, query, update  } from "firebase/database";


const ScoreTable = ({soundPlaying}) =>{

  
    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateToGameplay = useNavigate();
    
    const [isPlaying, setIsPlaying] = useState()
    const [users, setUsers] = useState();
    const [qcounter, setQCounter] = useState()

    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    const handleRedirectToGameplay = () =>{
        //update queueCounter
        const userSize = qcounter + 1
        set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue-counter/`), {
            queueCounter: userSize
        })

        update(query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}`), orderByChild('createdAt')),{isPlaying: false})
        
        onValue(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/score/`), (snapshot)=>{
    
            if(snapshot.val() === 20){
              
                const updateUsersPath = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`), orderByChild('createdAt'))
                set(updateUsersPath,{userPath: 'winners/'})  
                navigateToGameplay('winners/')
    
            }else{
                //update current users path 
                const updateUsersPath = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`), orderByChild('createdAt'))
                set(updateUsersPath,{userPath: ''})  
                navigateToGameplay('gameplay/${gameIDFromUrl}/')
            }
        })
       
       
    }

    useEffect(()=>{
      
        onValue(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/queue-counter/queueCounter`), (snapshot) => {
            setQCounter(snapshot.val())
        })

    },[roomIDFromUrl, qcounter])
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
                        <button className="next-page-btn" onClick={handleRedirectToGameplay}>Дальше</button> : 
                        null
                    }        
                </article>
                
            </Container>
        </main>

    )
}

export default ScoreTable;