import React from 'react'
import classes from './DetailsTaskModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'

export default function DetailsTaskModal({ setOpenModal }) {
    return (
        <ModalContainer
            setOpenModal={setOpenModal}
        >
            <div className={classes.content}>
                <div className={classes.titleContainer}>
                    <input type="text" placeholder='Название приказа' />
                </div>
                <div className={classes.dateContainer}>
                    <input type="date" />
                    <input type="date" />
                </div>
                <div className={classes.descriptionContainer}>
                    <textarea name="description"></textarea>
                </div>
                <div className={classes.attachContainer}>
                    <select name="policy">
                        <option value="">Политика 1</option>
                    </select>
                    <input type="file" />
                </div>
            </div>
        </ModalContainer>
    )
}
