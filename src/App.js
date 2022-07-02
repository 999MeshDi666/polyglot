import {useState, useEffect} from 'react';
import { BackgroundSound } from './Context';

import {Container} from 'react-bootstrap'
import {BrowserRouter,Routes,Route,} from "react-router-dom";

import funnySound from "./static/audio/Piggie-Dilly-Circus.mp3"

import Main from "./content/Main"
import Room from "./content/Room"

const audio = new Audio(funnySound);
function App() {

  const [isPlaying, setPlaySound] = useState(true);

  const handlePlaySound = () =>{
      setPlaySound(!isPlaying)
      if(isPlaying){
          audio.play();
      }else{
          audio.pause();
      }
      
  } 
  
  useEffect(()=>{
    window.addEventListener('load', ()=>{
      audio.play()
      setPlaySound(!isPlaying)
    })
     
  },[])
  console.log(isPlaying)

  return (
    <BrowserRouter>
      <BackgroundSound.Provider value={{ handlePlaySound }}>
        <Container className="main-container">
          <div className="App">
            <Routes>
              <Route path="/" element={<Main isPlaying={isPlaying}/>}/>
              <Route path="room" element={<Room isPlaying={isPlaying}/>}/>
            </Routes>
          </div>
        </Container>

      </BackgroundSound.Provider>
      
    </BrowserRouter>
  );
}

export default App;
