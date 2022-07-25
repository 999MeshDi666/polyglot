import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {Row, Col, Modal} from 'react-bootstrap'
import {fbaseDB} from '../../utils/firebase-config'
import { ref,  set, onValue, orderByChild, query, update } from "firebase/database";

export const OptionModalWindow = ({handleShowOptions, showOptions}) =>{
    const {roomIDFromUrl} = useParams();
  
    const [langList, setLangList] = useState([])
    const [currentLang, setCurrentLang] = useState({
        lang: "all",
        name: "All",
        isChecked: true,
    });
    const [checkBox, setCheckBox] = useState([
        {
            lang:'all',
            name:'All',
            isChecked:true
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
            lang:'deu',
            name:'Deu',
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

    const handleSubmitLangs = (e) =>{
        e.preventDefault()
        set(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/langs/`), {
            chosenLangs: langList,
           
        }).then(()=>{
            console.info('list has been sended')
        }).catch((error)=>{
            console.error(error)
        })
        handleShowOptions()

    }

    useEffect(()=>{
        if(currentLang.isChecked){
            if(currentLang.lang === 'all'){
                while(langList.length){
                    langList.pop()
                }
            }
            setLangList([...langList, currentLang.lang])
            
        }else{
            setLangList(langList.slice(0, -1))
        }
        
    },[currentLang])
   
    console.log('currentLang', currentLang)
    console.log('langList', langList)
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
                        <button type="submit" className='modal-window__btn' onClick={handleSubmitLangs}>Выбрать</button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export const DescModalWindow = ({handleShowDesc, showDesc, descData, ownerPermissions}) =>{
    const {roomIDFromUrl} = useParams();
    const navigateToGame = useNavigate();
    
    const userID = JSON.parse(sessionStorage.getItem('current-user'))['uid']
    const usersDataRef =  query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/`), orderByChild('createdAt'))
    
    const handleStartGame = ({index}) =>{
       const gamePath = `gameplay/${index}/`
        onValue(usersDataRef, (snapshot) => {
            snapshot.forEach((child) =>{
                const newOwnerData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${child.key}/`), orderByChild('createdAt'))
                update(newOwnerData,{userPath: gamePath})                 
            })
        });
       
    }

      //set start game
      useEffect(()=>{
        const startGameData = query(ref(fbaseDB, `polyglot/rooms/${roomIDFromUrl.substring(1)}/users/${userID}/userPath/`), orderByChild('createdAt'));
        onValue(startGameData, (snapshot)=>{
            navigateToGame(snapshot.val())
        })
    },[])
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
                    {ownerPermissions ? <a className='modal-window__btn' onClick = { ()=> handleStartGame(descData)}>Играть</a> : null}
                </Modal.Footer>
            </Modal>
        </>
    );
}
