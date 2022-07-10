import {Link, useParams} from 'react-router-dom'
import {Container} from 'react-bootstrap'
import {fbaseDB, fbAuth} from '../../utils/firebase-config'
import { ref, onValue, remove} from "firebase/database";
import { useEffect, useState } from 'react';
import crown from '../../static/images/other-icons/crown2.png'

const UserBar = () =>{

    const [users, setUsers] = useState();
    const {roomIDFromUrl} = useParams();
  
    useEffect(()=>{
        const getUserData = ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`);
        onValue(getUserData, (snapshot) => {
            const user = snapshot.val()
            const userList = []
            for (let key in user){
                userList.push(user[key])
            }
            console.log(userList)
            setUsers(userList) 
        });
      
    },[roomIDFromUrl.substring(1)])
    
    const handleRemoveUser = () =>{
        let user = fbAuth.currentUser;
        user.delete()  
        remove(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/` + user.uid))  
    }
    return(
        <Container fluid className='userbar-container'>
            <header className="user-bar__header">
                <Link to='/' className="user-bar__leave-btn general-btn" onClick={handleRemoveUser}>Выйти</Link>
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