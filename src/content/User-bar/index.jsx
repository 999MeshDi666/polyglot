import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, remove, update, orderByChild, query} from "firebase/database";
import { useEffect, useState } from 'react';
import crown from '../../static/images/other-icons/crown2.png'

const UserBar = () =>{

    const [users, setUsers] = useState();
    const {roomIDFromUrl} = useParams();
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const navigateToMain = useNavigate();
    
    useEffect(()=>{
        const getUserData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'));
        onValue(getUserData, (snapshot) => {
            // const user = snapshot.val()
             // for (let key in user){
            //     userList.push(user[key])
            // }
            const userList = []
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })
            
           setUsers(userList)
            const newOwnerData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userList[0]['uuid']}/`), orderByChild('createdAt'))
            update(newOwnerData,{isOwner: true}) 
        
            console.log('currentOwner:', userList[0]['uuid']) 

            // window.addEventListener('beforeunload', alertUser)
            // window.addEventListener('unload', handleTabClosing)
            // return () => {
            //     window.removeEventListener('beforeunload', alertUser)
            //     window.removeEventListener('unload', handleTabClosing)
            // }
           
           
        });
    },[roomIDFromUrl.substring(1)])

    // const handleTabClosing = () => {
    //     let removableUser = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/` + userID)
    //     remove(removableUser) 
    //     sessionStorage.removeItem('current-user')
      
        
    //     // removePlayerFromGame()
    // }
    
    // const alertUser = (event:any) => {
    //     event.preventDefault()
    //     console.log('event',event)
    //     console.log('reload page')


    //     event.returnValue = ''
    // }
    

    const handleRemoveUser = () =>{
        let removableUser = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/` + userID)
        remove(removableUser) 
        sessionStorage.removeItem('current-user')
        navigateToMain(`/`);
    }
    return(
        <Container fluid className='userbar-container'>
            <header className="user-bar__header">
                <a href='#' className="user-bar__leave-btn general-btn" onClick={handleRemoveUser}>Выйти</a>
                <div className="user-bar__user-list">
                    {users ? users.map((user)=>(
                        <span key={user.nickname} className="user-bar__new-user">
                            <img src={user.image} className="user-bar__user-image"/>
                            <h4  className="user-bar__user-nickname">{user.nickname}</h4>
                            <span style={user.isOwner ? {display: 'inline'} : {display: 'none'}} className='user-bar__owner-crown icon-crown'/>
                        </span>
                    )): ' '}
    
                </div>

            </header>

        </Container>
        
    )
}

export default UserBar