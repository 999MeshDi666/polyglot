import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import {Container} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, set, onValue } from "firebase/database";
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



let characterList = [ reaper, dogy, wizard, witch, tin_man, super_girl, pinocchio, knight, ghost, frogy ];
let randNicknameNum = Math.floor(Math.random() * 1000)

const Main = ({soundPlaying}) =>{
   
    const [characterCounter, setCharacterCounter] = useState(0)
    const [userName, setUserName] = useState(`Roly-Poly${randNicknameNum}`);
    const [code, setCode] = useState('')
    const [roomList, setRoomList] = useState()
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
        
            let roomDataList = []
            for (let key in roomData){
                roomDataList.push(key)
            }
            setRoomList(roomDataList) 
        });
    },[])

    const createUser = (rid, uid) =>{
        set(ref(fbaseDB, `polyglot/rooms/${rid}/users/${uid}`), {
            uuid: uid,
            image: characterList[characterCounter],
            nickname: userName,
            isOwner: switchContent,
            isPlaying: false,
            score: 0,
            createdAt: Date.now(),
        }).then(()=>{
            console.info('user has been created')
        }).catch((error)=>{
            console.error(error)
        })
        const user = {
            uid: uid,
        }
        sessionStorage.setItem('current-user', JSON.stringify(user))
        navigateToRoom(`/room/:${rid}`);

    }

    const codeValidation = (code, uid) =>{
        if(code.length === 0){
            alert('Поле кода не должно быть пустым')
        }else{
            if(roomList.includes(code)){
                const getUserSize = ref(fbaseDB, `polyglot/rooms/${code}/users/`);
                let userSizeData; 
                onValue(getUserSize, (snapshot) => {
                    userSizeData = snapshot.size
                });
                if(userSizeData === 5){
                    alert('Комната имеет достаточное количество игроков')
                }else{
                    createUser(code, uid)
                }
            }else{
                alert('Введенный код не существует')
            }
        }
        
    }
    // const checkStartGame = (code, uid) =>{
    //     const getUserSize = ref(fbaseDB, `polyglot/rooms/${code}/start-game/hasStarted/`);
    //     onValue(getUserSize, (snapshot) => {
    //         if(snapshot.val() === true){
    //             alert('Вы не можете присоедениться к данной комнате так, как игра уже началась')
    //         }else{
    //             codeValidation(code, uid)
    //         }
    //     });
    // }
    const userValidation = () =>{
        if(userName.length === 0){
            alert('Поле псевдонима не должно быть пустым')
        }
        else if(userName.length > 12){
            alert('Псевдоним не должен превышать 12 символов')
        }
        else{
            let uid = nanoid()
            let rid = nanoid()

            if(switchContent === true){
                createUser(rid, uid)
                set(ref(fbaseDB, `polyglot/rooms/${rid}/langs/`), {
                    chosenLangs: ['all'],
                })
            }else{
                if(code.length === 0){
                    alert('Поле кода не должно быть пустым')
                }else{
                    codeValidation(code, uid)
                }
            }
        }

    }

    const handleCreateUser = (e) =>{
        e.preventDefault()
        userValidation()
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
                        onClick={handleSwitchToJoin}>Присоединиться
                    </button>
                </div>
                <div className='main__contents'>
                    <h1 className='main__title'>
                        Выбери персонажа и <br/> напиши псевдоним
                    </h1> 
                    <form className="main__auth-form auth-form">
                        <fieldset className="main__chg-img-block">
                            <img src={characterList[characterCounter]} name="characters" id="characters"/>
                            <button className="chg-img-btn" onClick={handleChangeCharacter}>
                                <span className="icon-arrow-next"></span>
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
                <SoundBtn soundPlaying = {soundPlaying}></SoundBtn> 
            </main>
        </Container>
    )
}
export default Main