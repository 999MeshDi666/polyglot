import {useState, useEffect} from 'react';
import {BackgroundSound} from './Context';


import {BrowserRouter,Routes,Route,} from "react-router-dom";

import funnySound from "./static/audio/Piggie-Dilly-Circus.mp3"
import play from "./static/images/other-icons/play.png";
import pause from "./static/images/other-icons/pause.png";


import Main from "./content/Main"
import Room from "./content/Room"

const audio = new Audio(funnySound);
function App() {
  
  const [isPlaying, setPlaySound] = useState(JSON.parse(localStorage.getItem('audioPlaying')) || pause);
 
  const handlePlaySound = () =>{
    if(isPlaying === pause){
      setPlaySound(play) 
      audio.pause()
    }else{
      setPlaySound(pause) 
      audio.play() 
    }
  } 
  
  useEffect(()=>{
    if(isPlaying === pause){
      window.addEventListener('load', ()=>{
        audio.play()
        audio.loop = true;
        audio.volume = 0.5;
      })
    }
   
    localStorage.setItem('audioPlaying', JSON.stringify(isPlaying))
    
  },[isPlaying])
 
  

  return (
    <BrowserRouter>
      <BackgroundSound.Provider value={{handlePlaySound}}>
        <div className="App">
            <Routes>
              <Route path="/" element={<Main isPlaying={isPlaying}/>}/>
              <Route path="room" element={<Room isPlaying={isPlaying} />}/>
            </Routes>
        </div>
       
      </BackgroundSound.Provider>
    </BrowserRouter>
  );
}

export default App;
