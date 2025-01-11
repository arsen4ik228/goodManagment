import React, { useState } from 'react'
import classes from './Task.module.css'
import DetailsTaskModal from '../Modals/DetailsTaskModal/DetailsTaskModal'
import { useStartegyHook } from '../../../hooks/useStrategyHook'

export default function Task() {

    const [openDetailsTaskModal, setOpenDetailsTaskModal] = useState(false)
    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.body} onClick={() => setOpenDetailsTaskModal(true)}>
                    <div className={classes.checkboxContainer}>
                        <input type="checkbox" />
                    </div>
                    <div className={classes.titleContainer}>
                        Разработать бланк заявки на замену мебели
                    </div>
                    <div className={classes.dateContainer}>
                        Завершить:
                        <span>
                            28.05 cр.
                        </span>
                    </div>
                </div>
            </div>

            {openDetailsTaskModal && (
                <DetailsTaskModal
                    setOpenModal={setOpenDetailsTaskModal}
                ></DetailsTaskModal>
            )}

        </>
    )
}
