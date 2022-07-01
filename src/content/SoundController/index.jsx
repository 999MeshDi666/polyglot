import {useState, useEffect} from 'react'

import funnySound from "../../static/audio/Piggie-Dilly-Circus.mp3"
import play from "../../static/images/other-icons/play.png";
import pause from "../../static/images/other-icons/pause.png";

const audio = new Audio(funnySound);

const SoundBtn = ()=>{
    const [playSound, setPlaySound] = useState(true);

    const handlePlaySound = () =>{
        setPlaySound(!playSound)
        if(playSound){
            audio.play();
        }else{
            audio.pause();
        }
        
    } 
    return(
        <button className="sound-btn" onClick = {handlePlaySound}>
           <img src={playSound ? play : pause}/>
        </button>
    )
}
export default SoundBtn 