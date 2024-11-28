import React, { useEffect, useState } from 'react'
import classes from './ConfirmRemoveModal.module.css'
import { useNavigate } from 'react-router-dom'
import close from "../SearchModal/icon/icon _ add.svg";

export default function ConfirmRemoveModal({ setTargetState, setOpenModal, item }) {

    const navigate = useNavigate()
    const [targetIsProduct, setTargetIsProduct] = useState(false)

    useEffect(() => {
        if (item?.type === 'Продукт') {
            setTargetIsProduct(true)
        }
    }, [item])

    const buttonClick = (flag) => {
        setTargetState('Отменена')
        setOpenModal(false)
        flag && navigate(-1)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setOpenModal(false)}>
                        <img src={close} />
                    </div>
                    {targetIsProduct ? (
                        <div className={classes.title}>Данное действие <span>нельзя отменить</span>, отменить проект?</div>

                    ) : (
                        <div className={classes.title}>Данное действие <span>нельзя отменить</span>, отменить задачу?</div>
                    )}

                    <div className={classes.btn}>
                        <button onClick={() => buttonClick(targetIsProduct)}> Отменить</button>
                    </div>
                </div>
            </div >
        </>
    )
}
