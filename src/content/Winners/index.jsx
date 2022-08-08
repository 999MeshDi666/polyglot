import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, set, orderByChild, query, update, child, remove, limitToLast} from "firebase/database";


import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";


const WinnersPage = ({soundPlaying}) =>{

    let userSize;
    const {roomIDFromUrl} = useParams();
    const {gameIDFromUrl} = useParams();
    const navigateResetToRoom = useNavigate();
    const [isPlaying, setIsPlaying] = useState()
    const [users, setUsers] = useState();
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    
    const handleRedirectToRoom = () =>{
        
        const updateUsersPath = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/`), orderByChild('createdAt'))
        set(updateUsersPath,{userPath: ' '})    
    }

    useEffect(()=>{
        const redirectToRoom = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/current-path/userPath/`), orderByChild('createdAt'));
        onValue(redirectToRoom, (snapshot)=>{
            if(snapshot.val() === ' '){
                navigateResetToRoom(`/room/:${roomIDFromUrl.substring(1)}`);
                const resetScore = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/`);
                update(resetScore, {score: 0})
            }
        })
    },[roomIDFromUrl])

    //get users data
    useEffect(()=>{
        onValue(query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`),orderByChild('score'),limitToLast(3)), (snapshot) => {
            userSize = snapshot.size
            const userList = []
            const winnerList = [
                {
                    nickname: "",
                    image: "",
                    stand: "winners__stand-third"
                   
                },
                {
                    nickname: "",
                    image: "",
                    stand: "winners__stand-second"
                },
                {
                    nickname: "",
                    image: "",
                    stand: "winners__stand-first"
                   
                }
            ]
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })
            for(let i = 0; i < userList.length; i++){
                winnerList[i]['nickname'] = userList[i]['nickname']
                winnerList[i]['image'] = userList[i]['image']
            }
            setUsers(winnerList.reverse())
        });
    },[roomIDFromUrl])
    console.log('users', users)
    
    //get users playing state
    useEffect(()=>{
        const getPlayingData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isPlaying/`), orderByChild('createdAt'))
        onValue(getPlayingData, (snapshot) => {
            setIsPlaying(snapshot.val())
        })
    },[roomIDFromUrl, userID])

    let showWinners = users ? users.map((user)=>(
        <div className="winners__winners-block" key={user.uuid}>
            <div className="winners__winner">
                <img className="winners__winners-img" src={user.image}/>
                <h4 className="winners__winners-name">{user.nickname}</h4>
            </div>
            <div className={`winners__stand ${user.stand}`}></div>
          
        </div>
    )): ' ';

    let showWinner =  users ? 
        userSize === 2 ? 
        <div className="winners__winner">
            <img className="winners__winner-img" src={users[1]['image']}/>
            <h4 className="winners__winner-name">{users[1]['nickname']}</h4>
        </div> : 
        <div className="winners__winner">
            <img className="winners__winner-img" src={users[2]['image']}/>
            <h4 className="winners__winner-name">{users[2]['nickname']}</h4>
        </div> : ' ';

    return (
        <main className="winners">
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article className="winners__block content-block">
                    <h1 className="content-block__title">{userSize <  3 ? 'Победители' : 'Победитель'}</h1>
                    <div className="winners__wrapper">
                        {userSize <  3 ? showWinners : showWinner}
                    </div>
                    {isPlaying ? 
                        <button className="next-page-btn winners__next-page-btn" onClick = {handleRedirectToRoom}>Дальше</button> : 
                        null
                    }        
                </article>

            </Container>

        </main>
    )
}
export default WinnersPage