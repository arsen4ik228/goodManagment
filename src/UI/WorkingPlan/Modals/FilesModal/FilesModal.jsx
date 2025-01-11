import React from 'react'
import classes from './FilesModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'

export default function FilesModal({ setOpenModal }) {
    return (
        <ModalContainer
            setOpenModal={setOpenModal}
        >
            <>
                <div className={classes.content}>
                    <select className={classes.attachPolicy} name="attachPolicy">
                        <option>Выберите политику</option>
                        <option value="">Политика 1</option>
                        <option value="">Политика 2</option>
                    </select>
                    <input type="file" />
                </div>
            </>
        </ModalContainer>
    )
}
