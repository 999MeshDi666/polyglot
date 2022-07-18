import { useEffect, useState } from 'react';
import {Container, Row, Col, Modal} from 'react-bootstrap'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {fbaseDB} from '../../utils/firebase-config'
import { ref, onValue, remove, update, onDisconnect, orderByChild, query} from "firebase/database";
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

const OptionModalWindow = ({handleShowOptions, showOptions}) =>{
    const [currentLang, setCurrentLang] = useState({lang: "all",
        name: "All",
        isChecked: false,
    });
    const [checkBox, setCheckBox] = useState([
        {
            lang:'all',
            name:'All',
            isChecked:false
        },
        {
            lang:'eng',
            name:'Eng',
            isChecked:false
        },
        {   
            lang:'rus',
            name:'Rus',
            isChecked:false
        },
        {
            lang:'fra',
            name:'Fra',
            isChecked:false
        },
        {
            lang:'jpn',
            name:'Jpn',
            isChecked:false
        },
        {
            lang:'kaz',
            name:'Kaz',
            isChecked:false
        },
        {
            lang:'esp',
            name:'Esp',
            isChecked:false
        },
        {
            lang:'ita',
            name:'Ita',
            isChecked:false
        },
        {
            lang:'chn',
            name:'Chn',
            isChecked:false
        },
        {
            lang:'pol',
            name:'Pol',
            isChecked:false
        },
        {
            lang:'kor',
            name:'Kor',
            isChecked:false
        }

    ])

    const handleChooseLang = ({ lang, name, isChecked }) => {
        setCheckBox((prevCheckBox) =>
          prevCheckBox.map((box) => {
            if (box.lang === lang) {
              return { ...box, isChecked: !box.isChecked };
            } else return box;
          })
         
        );
        
        setCurrentLang({
          lang,
          name,
          isChecked: !isChecked,
        });
        
    };
     
    return(
        <>
            <Modal show={showOptions} onHide={handleShowOptions}>
                <Modal.Header  className='modal-window__header' closeButton>
                    <Modal.Title className='content-block__title'>Настройки</Modal.Title> 
                </Modal.Header>
                <form className='options-form'>
                    <p className="modal-window__subtitle">Выбор языков</p>
                    <Modal.Body className='modal-window__body modal-window__body-opt content-block__body'>
                        <Row>
                            {checkBox.map((langs)=>(
                                <Col  key={langs.lang} xs={4}  className="mb-3 options-form__langs">
                                    <input 
                                        type='checkbox' 
                                        id = {langs.lang} 
                                        name = {langs.name} 
                                        className="options-form__checkbox"
                                        disabled={
                                            currentLang.lang === "all" &&
                                            currentLang.isChecked &&
                                            langs.lang !== "all"
                                                ? true
                                                : false
                                        }
                                        checked={langs.isChecked}
                                        onChange={() => handleChooseLang(langs)}

                                    />
                                    <label htmlFor={langs.lang} className="options-form__label">{langs.name}</label>
                                </Col>
                            ))}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className='modal-window__footer'>
                        <button type="submit" className='modal-window__btn'>Выбрать</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

const DescModalWindow = ({handleShowDesc, showDesc, descData, ownerPermissions}) =>{


   
    return (
        <>
            <Modal show={showDesc} onHide={handleShowDesc}>
                <Modal.Header  className='modal-window__header' closeButton>
                    <span>
                        <img src={descData.image} className='modal-window__img'/>
                    </span>
                </Modal.Header>
                <Modal.Body className='modal-window__body modal-window__body-desc content-block__body'>
                    <Modal.Title className='content-block__title modal-window__title'>{descData.title}</Modal.Title>
                    <p className='content-block__desc'>{descData.desc}</p>
                </Modal.Body>
                <Modal.Footer className='modal-window__footer'>
                    {ownerPermissions ? <Link to ='gameplay' className='modal-window__btn'>Играть</Link> : null}
                </Modal.Footer>
            </Modal>
        </>
    );
}


const Room = ({isPlaying}) =>{
    const [ownerPermissions, setOwnerPermissions] = useState(JSON.parse(sessionStorage.getItem('current-user'))['isOwner'])
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const {roomIDFromUrl} = useParams();
    const [showDesc, setShowDesc] = useState(false);
    const [descData, setDescData] = useState({});
    const [showOptions, setShowOptions] = useState(false);

    const handleShowDesc = (game) =>{
        setShowDesc(!showDesc)
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
      
    useEffect(()=>{
        const getUserData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'));
        onValue(getUserData, (snapshot) => {
            
            const userList = []
            snapshot.forEach((child) =>{
                userList.push(child.val())
            })
            
            if(userList[0]['uuid'] === userID){
                const user = {
                    uid: userList[0]['uuid'],
                    isOwner: userList[0]['isOwner'],
                }
                sessionStorage.setItem('current-user', JSON.stringify(user))
                setOwnerPermissions(JSON.parse(sessionStorage.getItem('current-user'))['isOwner'])
            }
           
        });
    },[roomIDFromUrl.substring(1)])
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
            </Container>
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
        </main>
    )
}

export default Room