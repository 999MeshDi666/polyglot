import {useState, useEffect} from 'react';
import {BackgroundSound} from './Context';


import {BrowserRouter,Routes,Route} from "react-router-dom";
import funnySound from "./static/audio/Piggie-Dilly-Circus.mp3"
// import play from "./static/images/other-icons/play.png";
// import pause from "./static/images/other-icons/pause.png";


import Main from "./content/Main"
import RoomConnect from "./content/RoomConnect"
import Gameplay from "./content/Gameplay"

const audio = new Audio(funnySound);

const play =  "icon-play"
const pause = "icon-pause"

function App() {
  
  const [soundPlaying, setPlaySound] = useState(JSON.parse(localStorage.getItem('audioPlaying')) || pause);
   
  const handlePlaySound = () =>{
    if(soundPlaying === pause){
      setPlaySound(play) 
      audio.pause()
    }else{
      setPlaySound(pause) 
      audio.play() 
    }
  } 
  
  useEffect(()=>{
    if(soundPlaying === pause){
      window.addEventListener('load', ()=>{
        audio.play()
        audio.loop = true;
        audio.volume = 0.2;
      })
    }
   
    localStorage.setItem('audioPlaying', JSON.stringify(soundPlaying))
    
  },[soundPlaying])
 
  

  return (
    <BrowserRouter>
      <BackgroundSound.Provider value={{handlePlaySound}}>
        <div className="App">
            <Routes>
              <Route path="/" element={<Main soundPlaying={soundPlaying}/>}/>
              <Route path="/room/:roomIDFromUrl" element={<RoomConnect soundPlaying={soundPlaying}/>}/>
              {/* <Route path="/room/:roomIDFromUrl/gameplay" element={<Gameplay/>}/> */}
            </Routes>
        </div>
       
      </BackgroundSound.Provider>
    </BrowserRouter>
  );
}

export default App;
