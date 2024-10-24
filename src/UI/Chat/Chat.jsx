import React from 'react';
import classes from './Chat.module.css';
import backRow from './icon/icon _ back.svg'
import star from './icon/icon _ star.svg'
import stats from './icon/_icon _ stats.svg'
import listView from './icon/icon _ list view.svg'
import post from './icon/icon _ post.svg'
import strategy from './icon/icon _ strategy.svg'
import policy from './icon/icon _policy.svg'
import {useNavigate, useParams} from "react-router-dom";

const Chat = () => {

    const array = [
        {id: '1', icon: star, text: 'Цели', link: 'Goal'},
        {id: '2', icon: policy, text: 'Политика', link: 'Policy'},
        {id: '3', icon: stats, text: 'Статистики', link: '',},
        {id: '4', icon: star, text: 'Краткосрочная цель', link: 'Objective',},
        {id: '5', icon: strategy, text: 'Стратегия', link: 'Strategy'},
        {id: '6', icon: listView, text: 'Проекты', link: ''},
        {id: '7', icon: post, text: 'Посты', link: 'Posts'},

    ]

    const navigate = useNavigate()
    const {userId} = useParams()

    return (

        <>
            <div className={classes.wrapper}>
                <div className={classes.headContainer}>
                    <div className={classes.headRow}>
                        <div className={classes.blueLine}></div>
                        <div className={classes.headElem}>
                            <div className={classes.icon}>
                                <img src={backRow} alt="icon"/>
                            </div>
                            <div className={classes.txt}>
                                <div className={classes.headText}>Личный помощник</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.body}>
                    <div className={classes.bodyColumn}>
                        {array.map((item) => {
                            return (
                                <div key={item.id} className={classes.bodyRow} onClick={() => navigate(`/${userId}/${item.link}`)}>
                                    <div className={classes.bodyElement}>
                                        <img src={item.icon} alt="icon"/>
                                        <div className={classes.bodyElementText}>{item.text}</div>
                                    </div>
                                </div>
                            );

                        })}
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

export default Chat;