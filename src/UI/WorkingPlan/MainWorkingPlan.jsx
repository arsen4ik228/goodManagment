import React from 'react'
import classes from './MainWorkingPlan.module.css'
import InputTextContainer from './ContainerForInputText/InputTextContainer'
import Header from '../Custom/CustomHeader/Header'
import Task from './TaskContainer/Task'

export default function MainWorkingPlan() {
    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header
                        title={"Рабочий план"}
                    >
                        Личный помощник
                    </Header>
                </>
                <div className={classes.body}>
                    <div className={classes.archiveButton}>
                        Показать завершенные задачи
                    </div>
                    <div className={classes.tasksContainer}>
                        <Task></Task>
                        <Task></Task>
    
                    </div>

                </div>
                <InputTextContainer

                >
                </InputTextContainer>
            </div>
        </>
    )
}
