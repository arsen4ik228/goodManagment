import React from 'react';
import {useNavigate} from 'react-router-dom';
import classes from './Main.module.css';
import menuIcon from './icon/icon _ menu.svg'
const Main = () => {

    const navigate= useNavigate();


    return (
        <>

            <div className={classes.wrapper}>
                <div className={classes.headContainer}>
                    <div className={classes.headRow}>
                        <div className={classes.headElem}>
                            <div className={classes.headText}>КОНТАКТЫ</div>
                        </div>
                            <img src={menuIcon} alt="icon"/>
                    </div>
                </div>
                <div className={classes.body}>
                    <div className={classes.bodyColumn}>
                        <div className={classes.bodyElement}>
                            <div className={classes.bodyElementText}>Личный помощник</div>

                        </div>
                    </div>
                </div>
                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow}>
                        <div className={classes.inputElement}><input type="search" placeholder="Поиск"/></div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Main;