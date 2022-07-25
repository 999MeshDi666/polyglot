import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import {Container, Row, Col} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, orderByChild, query } from "firebase/database";
import {OptionModalWindow, DescModalWindow} from "../ModalWindows/";


import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";


import polyglot from "../../static/images/game-icons/game-icon128px/yawning.png"
import sparklesTongue from "../../static/images/game-icons/game-icon128px/tongue.png"
import tongueTwister from "../../static/images/game-icons/game-icon128px/tongue-twister.png"

const gameCards = [
    {
        index: 'polyglot',
        image:  polyglot,
        title: 'Полиглот',
        mini_desc: 'Докажи своим друзьям, что являещься настоящим полиглотом и любой язык тебе не страшен.',
        desc: 'Полиглот — человек, владеющий несколькими языками, способный говорить (читать, писать) на нескольких языках. Выбери язык или языки, послушай и попробуй произнести попавшееся тебе слово.'
    },
    {
        index: 'sparkles-tongue',
        image:  sparklesTongue,
        title: 'Блестящий язык',
        mini_desc: 'Только человек с блестящим языком способен произнести очень длинные слова.',
        desc: '"Частнопредпринимательский", "электроэнцефалографист", "субстанционализироваться". Насколько хорошо ты произнес эти слова? А слобо произнести слово "Rindfleischetikettierungsуberwachungsaufgabenуbertragungsgesetz"?! Если не слобо, то попробуй сыграть в блестящий язык. '
    },
    {
        index: 'tongue-twister',
        image:  tongueTwister,
        title: 'Скороговорки',
        mini_desc: `Произноси скороговорки пока не сотрешь себе язык. Последствия после игры: стертый язык, дурень!`,
        desc: 'Сможешь ли ты перескороговорить и перевыскороговорить все наши скороговорки?  Если не слобо, то давай сыграем в игру и посмотрим насколько твой бедный язык сотрется и  изподвыподвернется.'
    }
]



const Room = ({soundPlaying}) =>{
    
    const {roomIDFromUrl} = useParams();

    const [showDesc, setShowDesc] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [descData, setDescData] = useState({});
    const [ownerPermissions, setOwnerPermissions] = useState()
   
    
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']

    const handleShowDesc = (game) =>{
        setShowDesc((prevDesc)=>!prevDesc)
        if(showDesc) return;
        const curDescData = {
            index: game.index,
            image: game.image,
            title: game.title,
            desc: game.desc
        }
        setDescData(curDescData)
    }

    const handleShowOptions = () =>{
        setShowOptions((prevOpt)=>!prevOpt)
    }

    //set new owner
    useEffect(()=>{
        const startGameData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/isOwner/`), orderByChild('createdAt'));
        onValue(startGameData, (snapshot)=>{
            setOwnerPermissions(snapshot.val())
        })
    },[])

    return(
        <main className="room">
            <UserBar/>
            <SoundBtn soundPlaying = {soundPlaying} mod_class = 'sound-btn_room'/>
            <Container>
                <article>
                    <div className='room__cur-code-block'>
                        <h2 className='title'>Код игры:</h2>
                        <span className='room__code-wrapper'>
                            <p>{roomIDFromUrl.substring(1)}</p>
                        </span>
                    </div>
                    <div className='room__games'>
                        {ownerPermissions ? <button className='room__option-btn general-btn' onClick = {handleShowOptions}>Настройки</button> : null}
                        <Row className="room__game-card-block">
                            {gameCards.map((game)=>(
                                <Col xs={12}  className='room__game-card' key={game.title}>
                                    <div className='room__game-card-body'>
                                        <span className='room__game-card-img'> 
                                            <img src={game.image} alt={game.title}/> 
                                        </span>
                                        <span >
                                            <h3 className='room__game-card-title'>{game.title}</h3>
                                            <p className='room__game-card-desc'>{game.mini_desc}</p>
                                        </span>
                                    </div>
                                    <button className='room__game-card-btn' onClick={ ()=> handleShowDesc(game)}>Подробнее</button>
                                </Col>
                            ))}
                        </Row>                        
                    </div>
                </article>
                <DescModalWindow 
                    handleShowDesc = {handleShowDesc} 
                    showDesc = {showDesc} 
                    descData = {descData}
                    ownerPermissions = {ownerPermissions}
                />
                <OptionModalWindow  
                    handleShowOptions = {handleShowOptions}  
                    showOptions = {showOptions}
                />

            </Container>
        </main>
    )
}

export default Room