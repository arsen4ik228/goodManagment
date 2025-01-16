import React, { useEffect, useState } from 'react'
import classes from './DetailsTaskModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'
import { notEmpty, resizeTextarea } from '../../../../BLL/constans'

export default function DetailsTaskModal({ setOpenModal, taskData }) {

    const [startDate, setStartDate] = useState()
    const [deadlineDate, setDeadlineDate] = useState()
    const [contentInput, setContentInput] = useState()

    useEffect(() => {

        if (!notEmpty(taskData)) return

        setStartDate(taskData?.dateStart.split('T')[0])
        setDeadlineDate(taskData?.deadline.split('T')[0])
        setContentInput(taskData.content)
    }, [taskData])

    useEffect(() => {
        resizeTextarea(taskData.id)
    }, [contentInput])

    console.log(taskData)
    return (
        <ModalContainer
            setOpenModal={setOpenModal}
        >
            <div className={classes.content}>
                {taskData.type === 'Приказ' && (
                    <div className={classes.titleContainer}>
                        <input type="text" placeholder='Название приказа' />
                    </div>
                )}
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
                    <select name="stateSelect">
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
