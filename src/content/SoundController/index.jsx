import { useContext } from "react";
import { BackgroundSound } from "../../Context";
import play from "../../static/images/other-icons/play.png";
import pause from "../../static/images/other-icons/pause.png";



const SoundBtn = ({isPlaying})=>{
    const {handlePlaySound} = useContext(BackgroundSound)
   
    return(
        <button className="sound-btn sound-btn_animation" onClick = {handlePlaySound}>
           <img src={isPlaying ? play : pause}/>
        </button>
    )
}
export default SoundBtn 