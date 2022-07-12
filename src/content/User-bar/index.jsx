import { useParams, useNavigate } from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, remove, onDisconnect, orderByChild, query} from "firebase/database";
import { useEffect, useState } from 'react';
import crown from '../../static/images/other-icons/crown2.png'

const UserBar = () =>{

    const [users, setUsers] = useState();
    const {roomIDFromUrl} = useParams();
    const [userID] = useState(sessionStorage.getItem('current-user-id'))
    const navigateToMain = useNavigate();
  
    useEffect(()=>{
        const getUserData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'));
        onValue(getUserData, (snapshot) => {
            // const user = snapshot.val()
            const userList = []
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })
            
            // for (let key in user){
            //     userList.push(user[key])
            // }
            setUsers(userList) 
        });
        
      
    },[roomIDFromUrl.substring(1)])
  

    const handleRemoveUser = () =>{
        remove(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/` + userID)) 
        sessionStorage.removeItem('current-user-id')
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
                            <img src={crown} style={user.isOwner ? {display: 'inline'} : {display: 'none'}} className='user-bar__owner-crown' ></img>
                        </span>
                    )): ' '}
    
                </div>

            </header>

        </Container>
        
    )
}

export default UserBar