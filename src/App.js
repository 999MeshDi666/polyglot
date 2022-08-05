import {useState, useEffect} from 'react';
import {BackgroundSound} from './Context';


import {BrowserRouter,Routes,Route} from "react-router-dom";
import funnySound from "./static/audio/Piggie-Dilly-Circus.mp3"


import Main from "./content/Main"
import Room from "./content/Room"
import Gameplay from './content/Gameplay';
import ScoreTable from './content/ScoreTable';
import WinnersPage from './content/Winners';



const audio = new Audio(funnySound);

const unmute =  "icon-unmute"
const mute = "icon-mute"

function App() {
  
  const [soundPlaying, setPlaySound] = useState(JSON.parse(localStorage.getItem('audioPlaying')) || mute);
   
  const handlePlaySound = () =>{
    if(soundPlaying === mute){
      setPlaySound(unmute) 
      audio.pause()
    }else{
      setPlaySound(mute) 
      audio.play() 
    }
  } 
  
  useEffect(()=>{
    if(soundPlaying === mute){
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
              <Route path="/room/:roomIDFromUrl/gameplay/:gameIDFromUrl/winners/" element={<WinnersPage soundPlaying={soundPlaying}/>}/>
            </Routes>
        </div>
       
      </BackgroundSound.Provider>
    </BrowserRouter>
  );
}

export default App;
