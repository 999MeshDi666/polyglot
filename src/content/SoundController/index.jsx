import { useContext } from "react";
import { BackgroundSound } from "../../Context";



const SoundBtn = ({isPlaying, mod_class})=>{
    const {handlePlaySound} = useContext(BackgroundSound)
   
    return(
        <button className={`sound-btn ${mod_class}`} onClick = {handlePlaySound}>
          <span className={isPlaying}></span>
        </button>
    )
}
export default SoundBtn 