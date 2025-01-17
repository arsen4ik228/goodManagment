import React, { useEffect, useState } from 'react'
import classes from './DetailsTaskModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'
import { notEmpty, resizeTextarea } from '../../../../BLL/constans'
import { useTargetsHook } from '../../../../hooks/useTargetsHook'

export default function DetailsTaskModal({ setOpenModal, taskData, userPosts }) {

    const [startDate, setStartDate] = useState()
    const [deadlineDate, setDeadlineDate] = useState()
    const [contentInput, setContentInput] = useState()
    const [taskStatus, setTaskStatus] = useState()
    const [holderPost, setHolderPost] = useState()

    const {
        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,

        deleteTarget,

    } = useTargetsHook()

    const updateTask = async () => {

        if (taskStatus === 'Удалена') {
            await deleteTarget({
                targetId: taskData.id,
            })
                .unwrap()
                .then(() => {
                })
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        }
        else {


            const Data = {}

            if (contentInput !== taskData.content) Data.content = contentInput
            if (holderPost !== taskData.holderPostId) Data.holderPostId = holderPost
            if (taskStatus !== taskData.targetState) Data.targetState = taskStatus
            if (startDate !== taskData.dateStart.split('T')[0]) Data.dateStart = startDate
            if (deadlineDate !== taskData.deadline.split('T')[0]) Data.deadline = deadlineDate

            if (!notEmpty(Data)) return

            await updateTargets({
                _id: taskData.id,
                type: taskData.type,
                ...Data
            })
                .unwrap()
                .then(() => {
                })
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        }
    }

    useEffect(() => {

        if (!notEmpty(taskData)) return

        setStartDate(taskData?.dateStart.split('T')[0])
        setDeadlineDate(taskData?.deadline.split('T')[0])
        setContentInput(taskData.content)
        setTaskStatus(taskData?.targetState)
        setHolderPost(taskData?.holderPostId)
    }, [taskData])

    useEffect(() => {
        resizeTextarea(taskData?.id)
    }, [contentInput])

    console.log(userPosts)
    return (
        <ModalContainer
            setOpenModal={setOpenModal}
            clickFunction={updateTask}
        >
            <div className={classes.content}>
                {taskData.type === 'Приказ' && (
                    <div className={classes.titleContainer}>
                        <input type="text" placeholder='Название приказа' />
                    </div>
                )}
                <div className={classes.postContainer}>
                    <select
                        name="stateSelect"
                        value={holderPost}
                        onChange={(e) => setHolderPost(e.target.value)}
                    >
                        {userPosts?.map((item, index) => (
                            <option key={index} value={item.id}>{item.postName}</option>
                        ))}

                    </select>
                </div>
                <div className={classes.dateContainer}>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} />
                </div>
                <div className={classes.descriptionContainer}>
                    <textarea
                        name="description"
                        id={taskData.id}
                        value={contentInput}
                        onChange={(e) => setContentInput(e.target.value)}
                    ></textarea>
                </div>
                <div className={classes.stateContainer}>
                    <select
                        name="stateSelect"
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value)}
                    >
                        <option value="Активная">Активная</option>
                        <option value="Завершена">Завершена</option>
                        <option value="Удалена">Удалена</option>
                    </select>
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
