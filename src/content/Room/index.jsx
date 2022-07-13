import { useState } from 'react';
import {Container, Row, Col, Modal, Button} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";
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
        title: 'Блестящий языкт',
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

const ModalWindow = ({handleShowDesc, show, descData}) =>{
   
    return (
        <>
            <Modal show={show} onHide={handleShowDesc}>
                <Modal.Header  className='modal-window__header' closeButton>
                    <span>
                        <img src={descData.image} className='modal-window__img'/>
                    </span>
                </Modal.Header>
                <Modal.Body className='modal-window__body additional-window__body'>
                    <Modal.Title className='modal-window__header-title additional-window__title'>{descData.title}</Modal.Title>
                    <p className='additional-window__subtitle'>{descData.desc}</p>
                </Modal.Body>
                <Modal.Footer className='modal-window__footer'>
                    <button className='modal-window__btn'>Играть</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const Room = ({isPlaying}) =>{
    const {roomIDFromUrl} = useParams();
    const [show, setShow] = useState(false);
    const [descData, setDescData] = useState({});

    const handleShowDesc = (game) =>{
        setShow(!show)
        const curDescData = {
            image: game.image,
            title: game.title,
            desc: game.desc
        }
        
        setDescData(curDescData)
        
    }
    
    return(
        <main className="room">
            <UserBar/>
            <SoundBtn isPlaying = {isPlaying} mod_class = 'sound-btn_room'></SoundBtn>
            <Container>
                <article>
                    <div className='room__cur-code-block'>
                        <h2 className='title'>Код игры:</h2>
                        <span className='room__code-wrapper'>
                            <p>{roomIDFromUrl.substring(1)}</p>
                        </span>
                    </div>
                    <div className='room__games'>
                        <button className='room__option-btn general-btn'>Настройки</button>
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
            </Container>
            <ModalWindow handleShowDesc = {handleShowDesc} show = {show} descData = {descData}/>
        </main>
    )
}

export default Room