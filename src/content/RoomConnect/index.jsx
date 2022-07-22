import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'

import Room from "../Room"
import Gameplay from '../Gameplay'
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";

import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue,  update, orderByChild, query} from "firebase/database";


const RoomConnect = ({soundPlaying}) =>{

    const [users, setUsers] = useState();
    const {roomIDFromUrl} = useParams();
    const [startGame, setStartGame]= useState()
    const [ownerPermissions, setOwnerPermissions] = useState()
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))



    const handleStartGame = () =>{
        onValue(usersDataRef, (snapshot) => {
        
            snapshot.forEach((child) =>{
                const newOwnerData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${child.key}/`), orderByChild('createdAt'))
                update(newOwnerData,{isPlaying: true})                 
            })
           
        });
        
    }
    useEffect(()=>{
       
        onValue(usersDataRef, (snapshot) => {

            const userList = []
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })

            // if(userList[0]['uuid'] === userID){
            //     const user = {
            //         uid: userList[0]['uuid'],
            //         isOwner: userList[0]['isOwner'],
            //         isPlaying: userList[0]['isPlaying'],
            //     }
            //     sessionStorage.setItem('current-user', JSON.stringify(user))
            //     setOwnerPermissions(JSON.parse(sessionStorage.getItem('current-user'))['isOwner'])
            // } 
            setUsers(userList)
            const newOwnerData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userList[0]['uuid']}/`), orderByChild('createdAt'))
            update(newOwnerData,{isOwner: true}) 
            console.log('currentOwner:', userList[0]['uuid']) 
           

           
        });
    },[roomIDFromUrl.substring(1)])

    useEffect(()=>{
        const startGameData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isOwner/`), orderByChild('createdAt'));
        onValue(startGameData, (snapshot)=>{
            setOwnerPermissions(snapshot.val())
        })

    },[])

    useEffect(()=>{
        const startGameData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isPlaying/`), orderByChild('createdAt'));
        onValue(startGameData, (snapshot)=>{
            setStartGame(snapshot.val())
        })
    },[])

    return(
        <main className="room-gameplay gameplay room"> 
            <UserBar users={users} userID={userID} />
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                {startGame ?  <Gameplay/> :   <Room ownerPermissions={ownerPermissions} handleStartGame = {handleStartGame}/>}
               
               
            </Container>
        </main>

    )    
}

export default RoomConnect