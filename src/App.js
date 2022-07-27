import {useState, useEffect} from 'react';
import {BackgroundSound} from './Context';


import {BrowserRouter,Routes,Route} from "react-router-dom";
import funnySound from "./static/audio/Piggie-Dilly-Circus.mp3"


import Main from "./content/Main"
import Room from "./content/Room"
import Gameplay from './content/Gameplay';
import ScoreTable from './content/ScoreTable';


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
              <Route path="/room/:roomIDFromUrl" element={<Room soundPlaying={soundPlaying}/>}/>
              <Route path="/room/:roomIDFromUrl/gameplay/:gameIDFromUrl/" element={<Gameplay soundPlaying={soundPlaying}/>}/>
              <Route path="/room/:roomIDFromUrl/gameplay/:gameIDFromUrl/scores/" element={<ScoreTable soundPlaying={soundPlaying}/>}/>
            </Routes>
        </div>
       
      </BackgroundSound.Provider>
    </BrowserRouter>
  );
}

export default App;
