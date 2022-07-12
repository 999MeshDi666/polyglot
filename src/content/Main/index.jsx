import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, set, onValue } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid'
import SoundBtn  from "../SoundController/index"


import reaper from "../../static/images/character-icons/character01.png"
import dogy from "../../static/images/character-icons/character02.png"
import wizard from "../../static/images/character-icons/character03.png"
import witch from "../../static/images/character-icons/character04.png"
import tin_man from "../../static/images/character-icons/character05.png"
import super_girl from "../../static/images/character-icons/character06.png"
import pinocchio from "../../static/images/character-icons/character07.png"
import knight from "../../static/images/character-icons/character08.png"
import ghost from "../../static/images/character-icons/character09.png"
import frogy from "../../static/images/character-icons/character10.png"
import next_arrow from "../../static/images/other-icons/arrow-next.png"



let characterList = [ reaper, dogy, wizard, witch, tin_man, super_girl, pinocchio, knight, ghost, frogy ];
let randNicknameNum = Math.floor(Math.random() * 1000)

const Main = ({isPlaying}) =>{
   
    const [characterCounter, setCharacterCounter] = useState(0)
    const [userName, setUserName] = useState(`Roly-Poly${randNicknameNum}`);
    const [code, setCode] = useState('')
    const [roomList, setRoomList] = useState()
    const [userSize, setUserSize] = useState()
    const [switchContent, setSwitchContent] = useState(true);
    const navigateToRoom = useNavigate();
  
    const handleSwitchToCreate = ()=>{  
        setSwitchContent(true)
    }
    const handleSwitchToJoin = ()=>{  
        setSwitchContent(false)
    }
    
    const handleChangeCharacter = (e)=>{
        e.preventDefault();
        
        setCharacterCounter((prevChar)=>{
            if(prevChar===9){
                prevChar = 0;
            }
            else {
                prevChar = prevChar + 1;
            }
            return prevChar;
        })
    }
    const handleUserName = (event) =>{
        setUserName(event.target.value)
    }
    const handleGetRoomCode = (event) =>{
        setCode(event.target.value)

    } 
    useEffect(()=>{
        const getRoomData = ref(fbaseDB, `polyglot/rooms/`);
        onValue(getRoomData, (snapshot) => {
            const roomData = snapshot.val()
            // const roomDataSize = snapshot.size
            let roomDataList = []
            for (let key in roomData){
                roomDataList.push(key)
            }
            console.log(roomDataList)
            // console.log(roomDataSize)
            // setUserSize(Object.values(Object.values(roomData)[0]['users']).length )
            // console.log(Object.values(Object.values(roomData)[0]['users']).length )
            setRoomList(roomDataList) 
        });
    },[])
    const handleCreateUser = (e) =>{
        e.preventDefault()
       
        if(userName.length === 0){
            alert('Поле псевдонима не должно быть пустым')
        }
        else if(userName.length > 14){
            alert('Псевдоним не должен превышать 14 символов')
        }
        else{
            let uid = nanoid()
            let rid = nanoid()
            if(switchContent === true){
                set(ref(fbaseDB, `polyglot/rooms/${rid}/users/${uid}`), {
                    uuid: uid,
                    image: characterList[characterCounter],
                    nickname: userName,
                    isOwner: switchContent
                }).then(()=>{
                    console.info('user has been created')
                }).catch((error)=>{
                    console.error(error)
                })
                sessionStorage.setItem('current-user-id', uid)
                navigateToRoom(`/room/:${rid}`);
    
            }else{
                if(code.length === 0){
                    alert('Поле кода не должно быть пустым')
                }else{
                    if(roomList.includes(code)){
                        const getUserSize = ref(fbaseDB, `polyglot/rooms/${code}/users/`);
                        let userSizeData; 
                        onValue(getUserSize, (snapshot) => {
                            userSizeData = snapshot.size
                            console.log('userSizeData:',userSizeData)
                        });
                        if(userSizeData === 5){
                            alert('Комната имеет достаточное количество игроков')
                        }else{
                            set(ref(fbaseDB, `polyglot/rooms/${code}/users/` + uid), {
                                uuid: uid,
                                image: characterList[characterCounter],
                                nickname: userName,
                                isOwner: switchContent
                            }).then(()=>{
                                console.info('user has been created')
                            }).catch((error)=>{
                                console.error(error)
                            })
                            sessionStorage.setItem('current-user-id', uid)
                            navigateToRoom(`/room/:${code}`);
                        }
                    }else{
                        alert('Введенный код не существует')
                    }
                }
            }
        
        }
       

    }

    return(
        <Container>
            <main className='main'>
                <div className='main__switch-btns-block'>
                    <button 
                        className={`main__switch-btns main__switch-btns_border-left ${!switchContent && 'switch-btn_checked'} }`} 
                        onClick={handleSwitchToCreate}>Создать игру
                    </button>
                    <button 
                        className={`main__switch-btns  main__switch-btns_border-right ${switchContent && 'switch-btn_checked'} }`} 
                        onClick={ handleSwitchToJoin}>Присоединиться
                    </button>
                </div>
                <div className='main__contents'>
                    <h1 className='main__title'>
                        Выбери персонажа и <br/> напиши псевдоним
                    </h1> 
                    <form className="main__auth-form auth-form">
                        <fieldset className="main__chg-img-block">
                            <img src={characterList[characterCounter]} name="characters" id="characters"/>
                            <button className="main__chg-img-btn" onClick={handleChangeCharacter}>
                                <img src={next_arrow}/>
                            </button>
                        </fieldset>
                        <input 
                            type="text" 
                            name="nickname" 
                            id="nickname" 
                            className="auth-form__input" 
                            placeholder="Введите псевдоним"
                            value={userName}
                            onChange={handleUserName} 
                            />
                        <input 
                            type="text" 
                            name="join_code" 
                            id="join-code" 
                            className="auth-form__input" 
                            placeholder="Введите код"
                            value = {code}
                            onChange = {handleGetRoomCode}
                            style={switchContent ? {display: 'none'} : {display: 'inline'}}
                            />
                        <button 

                            className="auth-form__submit"
                            onClick = {handleCreateUser} 
                            >
                            {switchContent ? 'Создать': 'Присоединиться'}
                        </button>
                    </form>

                </div>
                <SoundBtn isPlaying = {isPlaying}></SoundBtn>
                    
            </main>
          
        </Container>
        
      
        

    )
}
export default Main