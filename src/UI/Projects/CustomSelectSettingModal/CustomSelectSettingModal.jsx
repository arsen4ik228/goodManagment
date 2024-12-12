import React from 'react'
import classes from './CustomSelectSettingModal.module.css'
import close from '../../Custom/SearchModal/icon/icon _ add.svg'

export default function CustomSelectSettingModal(setModalOpen) {

    const SECTION_NAMES = [
        { name: 'Описание' },
        { name: 'Продукт' },
        { name: 'Организационные мероприятия' },
        { name: 'Правила' },
        { name: 'Задачи' },
        { name: 'Метрика' },
    ]


    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.title}>Разделы</div>
                    <div className={classes.list}>
                        <ul className={classes.selectList}>
                            {SECTION_NAMES.map((item, index) => (
                                <li>
                                    <span>
                                        {item.name}
                                    </span>
                                    <input
                                        type="checkbox"
                                        readOnly
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={classes.btn}>
                        <button>Окей</button>
                    </div>
                </div>
            </div>
        </>
    )
}
