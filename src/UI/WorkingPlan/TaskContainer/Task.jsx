import React, { useState } from 'react'
import classes from './Task.module.css'
import DetailsTaskModal from '../Modals/DetailsTaskModal/DetailsTaskModal'
import { formattedDate } from '../../../BLL/constans'

export default function Task({ taskData, userPosts }) {

    const [openDetailsTaskModal, setOpenDetailsTaskModal] = useState(false)

    const transformDate = (dateString) => {

        const dayWithMounth = formattedDate(dateString).slice(0,5)
        const dayOfWeek = {
            0: 'вс',
            1: 'пн',
            2: 'вт',
            3: 'ср',
            4: 'чт',
            5: 'пт',
            6: 'сб',
        };

        let dateObj;

        // Попытка создать Date из строки
        dateObj = new Date(dateString);

        // Если создание Date не удалось, попробуем извлечь дату из строки
        if (!dateObj || isNaN(dateObj.getTime())) {
            // Удаляем время и миллисекунды
            const dateWithoutTime = dateString.split('T')[0];
            // Создаем Date из полученной даты без времени
            dateObj = new Date(dateWithoutTime);
        }

        // Если все еще не удалось создать Date, возвращаем null
        if (!dateObj || isNaN(dateObj.getTime())) {
            return null;
        }


        return dayWithMounth + ' ' +dayOfWeek[dateObj.getDay()];
    }




    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.body} onClick={() => setOpenDetailsTaskModal(true)}>
                    <div className={classes.checkboxContainer}>
                        <input type="checkbox" />
                    </div>
                    <div className={classes.titleContainer}>
                        {taskData.content}
                    </div>
                    <div className={classes.dateContainer}>
                        Завершить:
                        <span>
                            {transformDate(taskData.deadline)}
                        </span>
                    </div>
                </div>
            </div>

            {openDetailsTaskModal && (
                <DetailsTaskModal
                    setOpenModal={setOpenDetailsTaskModal}
                    taskData={taskData}
                    userPosts={userPosts}
                ></DetailsTaskModal>
            )}

        </>
    )
}
