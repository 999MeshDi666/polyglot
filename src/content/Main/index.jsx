import {useState, useEffect} from 'react';
import SoundBtn  from "../SoundController/index";

import {Link} from 'react-router-dom'


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

const Main = ({isPlaying}) =>{
    const [characterCounter, setCharacterCounter] = useState(0)
    const [userName, setUserName] = useState('');
    const [switchContent, setSwitchContent] = useState(true);

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

    const handleUserSession = (isPlaying) =>{
   
        const userSession = {
            image: characterList[characterCounter],
            name: userName,
            isOwner: switchContent,
        }
        sessionStorage.setItem('user', JSON.stringify(userSession))
        setUserName('')
      

    }

    return(
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
                        required/>
                    <input 
                        type="text" 
                        name="join_code" 
                        id="join-code" 
                        className="auth-form__input" 
                        placeholder="Введите код"
                        style={switchContent ? {display: 'none'} : {display: 'inline'}}
                        required/>
                    <Link 
                        to = "room"
                        className="auth-form__submit" 
                        onClick={handleUserSession}>
                        {switchContent ? 'Создать': 'Присоединиться'}
                    </Link>
                </form>

            </div>
            <SoundBtn isPlaying = {isPlaying}></SoundBtn>
                    
        
        

        </main>
      
        

    )
}
export default Main