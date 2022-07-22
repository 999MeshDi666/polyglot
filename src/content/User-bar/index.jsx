import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, remove,} from "firebase/database";


const UserBar = ({users, userID}) =>{

    const navigateToMain = useNavigate();
    const {roomIDFromUrl} = useParams();
    
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