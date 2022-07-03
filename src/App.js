import {useState, useEffect} from 'react';
import {BackgroundSound} from './Context';
import { UserData } from './Context';

import {Container} from 'react-bootstrap'
import {BrowserRouter,Routes,Route,} from "react-router-dom";

import funnySound from "./static/audio/Piggie-Dilly-Circus.mp3"
import play from "./static/images/other-icons/play.png";
import pause from "./static/images/other-icons/pause.png";

import reaper from "./static/images/character-icons/character01.png"

import Main from "./content/Main"
import Room from "./content/Room"

const audio = new Audio(funnySound);
function App() {
  let randNicknameNum = Math.floor(Math.random() * 100)
  const [isPlaying, setPlaySound] = useState(JSON.parse(localStorage.getItem('audioPlaying')) || pause);
  const [userData, setUserData] = useState({
    
      image:  reaper,
      nickname: `Roly-Poly${randNicknameNum}`,
      isOwner: true,
  })

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
 
  
  const handleUserData = ({image,nickname,isOwner}) =>{
   
    setUserData({
      image: image,
      nickname: nickname,
      isOwner: isOwner
    })
   
    sessionStorage.setItem('user', JSON.stringify(userData))
    console.log(userData)
  }

  return (
    <BrowserRouter>
      <BackgroundSound.Provider value={{handlePlaySound}}>
        <UserData.Provider value={{handleUserData}}>
          <Container className="main-container">
            <div className="App">
              <Routes>
                <Route path="/" element={<Main isPlaying={isPlaying}/>}/>
                <Route path="room" element={<Room isPlaying={isPlaying}/>}/>
              </Routes>
            </div>
          </Container>
        </UserData.Provider>
      </BackgroundSound.Provider>
    </BrowserRouter>
  );
}

export default App;
