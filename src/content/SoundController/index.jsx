import { useContext } from "react";
import { BackgroundSound } from "../../Context";



const SoundBtn = ({isPlaying})=>{
    const {handlePlaySound} = useContext(BackgroundSound)
   
    return(
        <button className="sound-btn sound-btn_animation" onClick = {handlePlaySound}>
           <img src={isPlaying}/>
        </button>
    )
}
export default SoundBtn 