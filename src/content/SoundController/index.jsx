import { useContext } from "react";
import { BackgroundSound } from "../../Context";



const SoundBtn = ({soundPlaying, mod_class})=>{
    const {handlePlaySound} = useContext(BackgroundSound)
   
    return(
        <button className={`sound-btn ${mod_class}`} onClick = {handlePlaySound}>
          <span className={soundPlaying}></span>
        </button>
    )
}
export default SoundBtn 