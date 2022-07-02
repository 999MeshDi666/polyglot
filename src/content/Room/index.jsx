
import SoundBtn  from "../SoundController/index";

import {Link} from 'react-router-dom'




const Room = ({isPlaying}) =>{
    
    return(
        <main className="room">
            <header className="room__header">
                <Link to='/' className="room__leave-btn">Выйти</Link>
                <div className="room__user-bar">
                    <span>
                      
                    </span>
                        

                </div>

            </header>
            <SoundBtn isPlaying = {isPlaying}></SoundBtn>

        </main>
    )
}

export default Room