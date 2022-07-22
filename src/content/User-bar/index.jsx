import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, remove, onValue, update, orderByChild, query} from "firebase/database";


const UserBar = () =>{

    const navigateToMain = useNavigate();
    const {roomIDFromUrl} = useParams();
    const [users, setUsers] = useState();
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))

    const handleRemoveUser = () =>{
        let removableUser = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/` + userID)
        remove(removableUser) 
        sessionStorage.removeItem('current-user')
        navigateToMain(`/`);
    }

    //get users data
    useEffect(()=>{
       
        onValue(usersDataRef, (snapshot) => {

            const userList = []
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })

            setUsers(userList)
            const newOwnerData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userList[0]['uuid']}/`), orderByChild('createdAt'))
            update(newOwnerData,{isOwner: true}) 
            console.log('currentOwner:', userList[0]['uuid'])   
        });
    },[roomIDFromUrl.substring(1)])

    return(
        <Container fluid className='userbar-container'>
            <header className="user-bar__header">
                <a className="user-bar__leave-btn general-btn" onClick={handleRemoveUser}>Выйти</a>
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