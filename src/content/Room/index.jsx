import {Container, Row, Col} from 'react-bootstrap'
import SoundBtn  from "../SoundController/index";
import UserBar from "../User-bar";
import polyglot from "../../static/images/game-icons/game-icon64px/yawning.png"
import sparklesTongue from "../../static/images/game-icons/game-icon64px/tongue.png"
import tongueTwister from "../../static/images/game-icons/game-icon64px/tongue-twister.png"

const gameCards = [
    {
        image:  polyglot,
        title: 'Полиглот',
        desc: 'Докажи своим друзьям, что являещься настоящим полиглотом и любой язык тебе не страшен.',
    },
    {
        image:  sparklesTongue,
        title: 'Блестящий языкт',
        desc: 'Только человек с блестящим языком способен произнести очень длинные слова.',
    },
    {
        image:  tongueTwister,
        title: 'Скороговорки',
        desc: `Произноси скороговорки пока не сотрешь себе язык. Последствия после игры: стертый язык, дурень!`,
    }
]

const Room = ({isPlaying}) =>{
    
    return(
        <main className="room">
            <UserBar/>
            <SoundBtn isPlaying = {isPlaying} mod_class = 'sound-btn_room'></SoundBtn>
            <Container>
                <article>
                    <div className='room__cur-code-block'>
                        <h2 className='title'>Код игры:</h2>
                        <span className='room__code-wrapper'>
                            <p>AzX89sd5SD</p>
                        </span>
                    </div>
                    <div className='room__games'>
                        <button className='room__option-btn general-btn'>Настройки</button>
                        <Row className="room__game-card-block">
                            {gameCards.map((item)=>(
                                <Col xs={12}  className='room__game-card' key={item.title}>
                                    <div className='room__game-card-body'>
                                        <span className='room__game-card-img'> 
                                            <img src={item.image} alt={item.title}/> 
                                        </span>
                                        <span >
                                            <h3 className='room__game-card-title'>{item.title}</h3>
                                            <p className='room__game-card-desc'>{item.desc}</p>
                                        </span>
                                    </div>
                                    <button className='room__game-card-btn'>Подробнее</button>
                                </Col>
                            ))}

                        </Row>
                        
                    </div>

                </article>
            </Container>
        </main>
    )
}

export default Room