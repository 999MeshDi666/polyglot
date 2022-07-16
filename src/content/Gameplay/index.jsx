import { useState, useEffect } from "react"
import UserBar from "../User-bar"
import { Container } from "react-bootstrap"

import repearBtn from "../../static/images/other-icons/repeat-btn.png"



const Gameplay = () =>{
    return(
        <main className="gameplay">
             <UserBar/>
             <Container>
                <article className="gameplay__block content-block">
                    <div className="gameplay__userName-timer">
                        <h4 className="gameplay__user-name">говорит: Name</h4>
                        <span className="gameplay__timer">
                            <p className="gameplay__timer-nums">10</p>
                        </span>
                    </div>
                    <div className="">
                        <div>
                            <div className="gameplay__cur-word-block">
                                <button className="gameplay__repeat-btn" title="repeat"></button>
                                <p className="gameplay__cur-word-title">Произнеси:</p>
                            </div>
                            <div className="content-block__body gameplay__word-container">
                                <p className="gameplay__cur-word">Никотинамидадениндинуклеотидфосфатгидрин</p>
                            </div>
                        </div>
                        <button><img/></button>
                        <div>
                            <p>Произнес:</p>
                            <span>
                                <p></p>
                            </span>
                        </div>
                    </div>
                    
                </article>
             </Container>
        </main>
    )
}

export default Gameplay