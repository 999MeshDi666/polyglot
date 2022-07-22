import { useEffect, useState } from 'react'





const RoomConnect = ({soundPlaying}) =>{

    
    const {roomIDFromUrl} = useParams();
    
 
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
  



    


    
    return(
        <main className="room-gameplay gameplay room"> 
            
            <Container>
                {startGame ?  <Gameplay/> :   <Room />}
               
               
            </Container>
        </main>

    )    
}

export default RoomConnect