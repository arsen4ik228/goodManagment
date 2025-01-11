import React, { useState } from 'react'
import classes from './InputTextContainer.module.css'
import sendIcon from '../../Custom/icon/send.svg'
import shareIcon from '../../Custom/icon/subbar _ share.svg'
import calenderIcon from '../../Custom/icon/icon _ calendar.svg'
import attachIcon from '../../Custom/icon/subbar _ attach.svg'
import { resizeTextarea } from '../../../BLL/constans'
import CalendarModal from '../Modals/CalendarModal/CalendarModal'
import FilesModal from '../Modals/FilesModal/FilesModal'
import OrderModal from '../Modals/OrderModal/OrderModal'

export default function InputTextContainer() {

    const [openCalendarModal, setOpenCalendarModal] = useState(false)
    const [openFilesModal, setOpenFilesModal] = useState(false)
    const [openOrderModal, setOpenOrderModal] = useState(false)

    const idTextarea = 1001
    const inputText = () => {
        setTimeout(resizeTextarea(idTextarea), 0)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.body}>
                    <div className={classes.choosePostContainer}>
                        <select name="choosePost">
                            <option value="">программист</option>
                            <option value="">грузчик</option>
                            <option value="">насяльника</option>
                        </select>
                    </div>
                    <div className={classes.inputTextContainer}>
                        <div className={classes.buttonSection}>
                            <img src={attachIcon} alt="attachIcon" onClick={() => setOpenFilesModal(true)}/>
                            <img src={calenderIcon} alt="calenderIcon" onClick={() => setOpenCalendarModal(true)} />
                        </div>
                        <div className={classes.inputText}>
                            <textarea
                                id={idTextarea}
                                onChange={() => inputText()}
                            />
                        </div>
                        <div className={classes.buttonSection}>
                            <img src={shareIcon} alt="shareIcon" onClick={() => setOpenOrderModal(true)} />
                            <img src={sendIcon} alt="sendIcon" />
                        </div>
                    </div>
                </div>
            </div>

            {openCalendarModal && (
                <CalendarModal
                    setOpenModal={setOpenCalendarModal}
                ></CalendarModal>
            )}

            {openFilesModal && (
                <FilesModal
                    setOpenModal={setOpenFilesModal}
                ></FilesModal>
            )}

            {openOrderModal && (
                <OrderModal
                    setModalOpen={setOpenOrderModal}
                ></OrderModal>
            )}

        </>
    )
}
