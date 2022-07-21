import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import {Row, Col, Modal} from 'react-bootstrap'


export const OptionModalWindow = ({handleShowOptions, showOptions}) =>{
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

export const DescModalWindow = ({handleShowDesc, showDesc, descData, ownerPermissions}) =>{
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
