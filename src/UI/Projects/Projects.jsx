import React from 'react';
import classes from './Projects.module.css'

function Projects(props) {
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.body}>
                    <div className={classes.CardsContainer}>
                        <div className={classes.CardContainer}>
                            <div className={classes.CardLeft}>
                                <div className={classes.LeftContent}>
                                    <div className="">
                                        <input type="text" value={'Задача 1'} className={classes.title} />
                                    </div>
                                    <div className="">
                                        <input type="date" className="" />
                                    </div>
                                </div>
                            </div>
                            <div className={classes.CardRight}>
                                <div className={classes.RightContent}>
                                    <select name="mySelect" id="1" className={classes.MySelect}>
                                        <option value="Валера">Валера</option>
                                        <option value="">Максонэк</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Projects;