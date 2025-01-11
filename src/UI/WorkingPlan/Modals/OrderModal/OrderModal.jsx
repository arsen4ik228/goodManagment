import React from 'react'
import classes from './OrderModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'

export default function OrderModal({ setModalOpen }) {
    return (
        <ModalContainer
            buttonText={'Отправить'}
            setOpenModal={setModalOpen}
        >
            <div className={classes.content}>
                <input
                    type="text"
                    placeholder='Название приказа'
                />
                <div className={classes.selectPostContainer}>
                    <div className={classes.left}>
                        Пост:
                    </div>
                    <div className={classes.right}>
                        <div>
                            <input type="radio" />
                            <span>Пост 1</span>
                        </div>
                        <div>
                            <input type="radio" />
                            <span>Пост 1</span>
                        </div>


                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}
