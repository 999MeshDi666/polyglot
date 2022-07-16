import { useState, useEffect } from "react"
import UserBar from "../User-bar"
import { Container } from "react-bootstrap"



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
                            <div>
                                <button><img/></button>
                                <p>Произнеси:</p>
                            </div>
                            <span>
                                <p></p>
                            </span>
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