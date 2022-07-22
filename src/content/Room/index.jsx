import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import {Row, Col} from 'react-bootstrap'
import {OptionModalWindow, DescModalWindow} from "../ModalWindows/";



import polyglot from "../../static/images/game-icons/game-icon128px/yawning.png"
import sparklesTongue from "../../static/images/game-icons/game-icon128px/tongue.png"
import tongueTwister from "../../static/images/game-icons/game-icon128px/tongue-twister.png"

const gameCards = [
    {
        image:  polyglot,
        title: 'Полиглот',
        mini_desc: 'Докажи своим друзьям, что являещься настоящим полиглотом и любой язык тебе не страшен.',
        desc: 'Полиглот — человек, владеющий несколькими языками, способный говорить (читать, писать) на нескольких языках. Выбери язык или языки, послушай и попробуй произнести попавшееся тебе слово.'
    },
    {
        image:  sparklesTongue,
        title: 'Блестящий язык',
        mini_desc: 'Только человек с блестящим языком способен произнести очень длинные слова.',
        desc: '"Частнопредпринимательский", "электроэнцефалографист", "субстанционализироваться". Насколько хорошо ты произнес эти слова? А слобо произнести слово "Rindfleischetikettierungsуberwachungsaufgabenуbertragungsgesetz"?! Если не слобо, то попробуй сыграть в блестящий язык. '
    },
    {
        image:  tongueTwister,
        title: 'Скороговорки',
        mini_desc: `Произноси скороговорки пока не сотрешь себе язык. Последствия после игры: стертый язык, дурень!`,
        desc: 'Сможешь ли ты перескороговорить и перевыскороговорить все наши скороговорки?  Если не слобо, то давай сыграем в игру и посмотрим насколько твой бедный язык сотрется и  изподвыподвернется.'
    }
]



const Room = ({ownerPermissions, handleStartGame}) =>{
    
    const {roomIDFromUrl} = useParams();
    const [showDesc, setShowDesc] = useState(false);
    const [descData, setDescData] = useState({});
    const [showOptions, setShowOptions] = useState(false);

    const handleShowDesc = (game) =>{
        setShowDesc((prevDesc)=>!prevDesc)
        if(showDesc) return;
        const curDescData = {
            image: game.image,
            title: game.title,
            desc: game.desc
        }
        setDescData(curDescData)
    }

    const handleShowOptions = () =>{
        setShowOptions(!showOptions)
    }
      
    return(
        <>
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
                handleStartGame = {handleStartGame}
            />
            <OptionModalWindow  
                handleShowOptions = {handleShowOptions}  
                showOptions = {showOptions}
            />
        </>
    )
}

export default Room