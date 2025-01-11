import React from 'react'
import classes from './CalendarModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'

export default function CalendarModal({setOpenModal}) {
    return (
        <ModalContainer
            buttonText={'Сохранить'}
            setOpenModal={setOpenModal}
        >
            <div className={classes.Content}>
                <input className={classes.dateStart} type="date" />
                <input className={classes.deadline} type="date" />
            </div>
        </ModalContainer>
    )
}
