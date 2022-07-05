import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {Container} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';
import {fbaseDB, fbAuth} from '../../utils/firebase-config'
import { signInAnonymously } from "firebase/auth";
import { ref, set } from "firebase/database";

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
    const [switchContent, setSwitchContent] = useState(true);
    const navigate = useNavigate();

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

    const handleCreateUser = (e) =>{
        e.preventDefault()
        
        if(userName.length === 0){
            alert('Поле псевдонима не должно быть пустым')
        }
        else if(userName.length > 14){
            alert('Псевдоним не должен превышать 14 символов')
        }
        else{
            let uuid = uuidv4()
            set(ref(fbaseDB, 'users/' + uuid), {
                uid: uuid,
                image: characterList[characterCounter],
                nickname: userName,
                isOwner: switchContent
            }).then(()=>{
                console.info('data has been created')
            }).catch((error)=>{
                console.error(error)
            })
            navigate('room');
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