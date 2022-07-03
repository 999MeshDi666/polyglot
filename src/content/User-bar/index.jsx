import {Link} from 'react-router-dom'
import {Container} from 'react-bootstrap'

const UserBar = () =>{
    return(
        <Container fluid className='userbar-container'>
            <header className="user-bar__header">
                <Link to='/' className="user-bar__leave-btn general-btn">Выйти</Link>
                <div className="user-bar__user-list">
                    <span>
                        
                    </span>
                            

                </div>

            </header>

        </Container>
        
    )
}

export default UserBar