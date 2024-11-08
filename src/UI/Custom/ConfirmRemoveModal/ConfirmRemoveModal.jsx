import React from 'react'
import classes from './ConfirmRemoveModal.module.css'

export default function ConfirmRemoveModal({setTargetState, setOpenConfirmRemoveModal}) {

    const buttonClick = () => {
        setTargetState('Отменена')
        setOpenConfirmRemoveModal(false)
    }

  return (
    <>
        <div className={classes.wrapper}>
            <div className={classes.column}>
                <div className={classes.title}> Данное действие <span>нельзя отменить</span>, отменить задачу?</div>
                <div className={classes.btn}>
                     <button onClick={() => buttonClick()}> Отменить</button>
                </div>
            </div>
        </div>
    </>
  )
}
