import React, { useEffect, useState } from 'react'
import classes from './InputTextContainer.module.css'
import sendIcon from '../../Custom/icon/send.svg'
import shareIcon from '../../Custom/icon/subbar _ share.svg'
import calenderIcon from '../../Custom/icon/icon _ calendar.svg'
import attachIcon from '../../Custom/icon/subbar _ attach.svg'
import { resizeTextarea } from '../../../BLL/constans'
import CalendarModal from '../Modals/CalendarModal/CalendarModal'
import FilesModal from '../Modals/FilesModal/FilesModal'
import OrderModal from '../Modals/OrderModal/OrderModal'
import { useTargetsHook } from '../../../hooks/useTargetsHook'

export default function InputTextContainer({ userPosts, }) {

    const [openCalendarModal, setOpenCalendarModal] = useState(false)
    const [openFilesModal, setOpenFilesModal] = useState(false)
    const [openOrderModal, setOpenOrderModal] = useState(false)

    const [selectedPost, setSelectedPost] = useState()
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [deadlineDate, setDeadlineDate] = useState(new Date().toISOString().split('T')[0])
    const [contentInput, setContentInput] = useState()

    const [isOrder, setIsOreder] = useState(false)

    const idTextarea = 1001

    const {
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation
    } = useTargetsHook()

    const createTargets = async () => {

        if (!contentInput) return

        const Data = {}

        Data.type = isOrder ? 'Приказ' : 'Личная'
        Data.orderNumber = 1
        Data.content = contentInput
        Data.holderPostId = selectedPost ? selectedPost : userPosts[0]?.id
        Data.dateStart = startDate
        Data.deadline = deadlineDate
        console.log(Data)

        await postTargets({
            ...Data
        })
            .unwrap()
            .then(() => {
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }

    useEffect(() => {
        setTimeout(resizeTextarea(idTextarea), 0)
    }, [contentInput])

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.body}>
                    <div className={classes.choosePostContainer}>
                        <select
                            name="choosePost"
                            value={selectedPost}
                            onChange={(e) => setSelectedPost(e.target.value)}
                        >
                            {userPosts.map((item, index) => (
                                <option key={index} value={item.id}>{item.postName}</option>
                            ))}
                        </select>
                    </div>
                    <div className={classes.inputTextContainer}>
                        <div className={classes.buttonSection}>
                            <img src={attachIcon} alt="attachIcon" onClick={() => setOpenFilesModal(true)} />
                            <img src={calenderIcon} alt="calenderIcon" onClick={() => setOpenCalendarModal(true)} />
                        </div>
                        <div className={classes.inputText}>
                            <textarea
                                id={idTextarea}
                                value={contentInput}
                                onChange={(e) => setContentInput(e.target.value)}
                            />
                        </div>
                        <div className={classes.buttonSection}>
                            <img src={shareIcon} alt="shareIcon" onClick={() => setOpenOrderModal(true)} />
                            <img src={sendIcon} alt="sendIcon" onClick={() => createTargets()} />
                        </div>
                    </div>
                </div>
            </div>

            {openCalendarModal && (
                <CalendarModal
                    setOpenModal={setOpenCalendarModal}
                    dateStart={startDate}
                    setDateStart={setStartDate}
                    dateDeadline={deadlineDate}
                    setDateDeadline={setDeadlineDate}
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
