import React from 'react'
import classes from './Task.module.css'

export default function Task() {
    return (
        <>
            <>
                <div className={classes.wrapper}>

                    <div className={classes.body}>
                        <div className={classes.checkboxContainer}>
                            <input type="checkbox" />
                        </div>
                        <div className={classes.titleContainer}>
                            Разработать бланк заявки на замену мебели 
                        </div>
                        <div className={classes.dateContainer}>
                            Завершить:
                            <span>
                                28.05 cр.
                            </span>
                        </div>
                    </div>

                </div>
            </>
        </>
    )
}
