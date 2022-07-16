import { useState, useEffect } from "react"
import UserBar from "../User-bar"
import { Container } from "react-bootstrap"



const Gameplay = () =>{
    return(
        <main className="gameplay">
             <UserBar/>
             <Container></Container>
        </main>
    )
}

export default Gameplay