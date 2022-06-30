// import reaper from "../../static/images/character-icons/character01"
// import dogy from "../../static/images/character-icons/character02"
// import wizard from "../../static/images/character-icons/character03"
// import witch from "../../static/images/character-icons/character04"
// import tin_man from "../../static/images/character-icons/character05"
// import super_girl from "../../static/images/character-icons/character06"
// import pinocchio from "../../static/images/character-icons/character07"
// import knight from "../../static/images/character-icons/character08"
// import ghost from "../../static/images/character-icons/character09"
// import frogy from "../../static/images/character-icons/character10"

import {Form} from 'react-bootstrap'

// let characterList = { reaper, dogy, wizard, witch, tin_man, super_girl, pinocchio, knight, ghost, frogy };

const Main = () =>{
    return(
        <main className='main'>
            <div className='main__switch-btns-block'>
                <button className='main__switch-btns main__switch-btns_border-left'>Созать игру</button>
                <button className='main__switch-btns main__switch-btns_border-right'>Присоединиться</button>
            </div>
            <div className='main__contents'>
                <h1 className='main__title'>
                    Выбери персонажа и напиши псевдоним
                </h1> 
                <form action='#' method='post'>
                    <input type="image" src="" name="characters" id="characters"></input>
                    

                </form>
                


            </div>


        </main>


    )
}
export default Main