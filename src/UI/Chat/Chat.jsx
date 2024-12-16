import React, { useMemo, useState } from 'react';
import classes from './Chat.module.css';
import backRow from './icon/icon _ back.svg'
import star from './icon/icon _ star.svg'
import stats from './icon/_icon _ stats.svg'
import listView from './icon/icon _ list view.svg'
import post from './icon/icon _ post.svg'
import strategy from './icon/icon _ strategy.svg'
import policy from './icon/icon _policy.svg'
import avatar from '../Custom/icon/messendger _ avatar.svg'
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {

    const array = [
        { id: '1', icon: post, text: 'Посты', link: 'Posts' },
        { id: '2', icon: listView, text: 'Проекты', link: 'Projects' },
        { id: '3', icon: strategy, text: 'Стратегия', link: 'Strategy' },
        { id: '4', icon: star, text: 'Краткосрочная цель', link: 'Objective', },
        { id: '5', icon: stats, text: 'Статистики', link: 'Statistics', },
        { id: '6', icon: policy, text: 'Политика', link: 'Policy' },
        { id: '7', icon: star, text: 'Цели', link: 'Goal' },
    ]

    const navigate = useNavigate()
    const { userId } = useParams()
    const [searchTerm, setSearchTerm] = useState('');

    // const filteredArray = useMemo(() => {
    //     return array.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
    // }, [array, searchTerm]);
    const filteredArray = useMemo(() => 
        array.filter((item) => item.text.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm]
    );
    

    return (

        <>
            <div className={classes.wrapper}>
                <div className={classes.headContainer}>
                    <div className={classes.headRow}>
                        <div className={classes.blueLine}></div>
                        <div className={classes.headElem}>
                            <div className={classes.icon}>
                                <img src={backRow} alt="icon" />
                            </div>
                            <div className={classes.txt}>
                                <div className={classes.headText}>Личный помощник</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.body}>


                    <div className={classes.bodyColumn}>

                        {filteredArray.map((item) => {
                            return (
                                <div key={item.id} className={classes.bodyRow} onClick={() => navigate(`/${userId}/${item.link}`)}>
                                    <div className={classes.bodyElement}>
                                        <img src={item.icon} alt="icon" />
                                        <div className={classes.bodyElementText}>{item.text}</div>
                                    </div>
                                </div>
                            );

                        })}
                        <div className={classes.questionContainer}>
                            <div className={classes.questionBody}>
                                <div className={classes.imgContainer}>
                                    <img src={avatar} alt="" />
                                </div>
                                <div className={classes.textContainer}>
                                    <span>С чем будем работать?</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow}>
                        <div className={classes.inputElement}>
                            <input type="search"
                                placeholder="Поиск"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Chat;