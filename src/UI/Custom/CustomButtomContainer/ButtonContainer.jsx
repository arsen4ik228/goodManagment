import React from "react";
import classes from './ButtomContainer.module.css'


export const ButtonContainer = ({children, clickFunction}) => {


    return(
        <>
            <div className={classes.wrapper}>
                <div className={classes.buttonContainer}>
                    <button
                    onClick={() => clickFunction()}
                    >
                    {children}
                    </button>
                </div>
            </div>
        </>
    )
}