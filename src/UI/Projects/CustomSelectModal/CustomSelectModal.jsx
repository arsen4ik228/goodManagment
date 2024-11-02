import React from 'react'
import classes from "./CustomSelectModal.module.css"
import close from "../../Custom/SearchModal/icon/icon _ add.svg"

export default function CustomSelectModal({ setModalOpen, projects }) {
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.element_srch}>
                        <input type={classes.search} placeholder="Поиск" />
                    </div>

                    <div className={classes.body}>
                        {projects.map((item, index) => (
                            <div key={index} className={classes.projectContainer}>
                                <div className={classes.content}>
                                    <div className={classes.title}>{item.projectName}</div>
                                    <div className={classes.worker}></div>
                                    <div className={classes.data}>26.08.2003</div>
                                </div>
                                <div className={classes.checkBox}>
                                    <input type="checkbox" />
                                </div>
                            </div>
                        ))}
                        <div className={classes.projectContainer}>
                            <div className={classes.content}>
                                <div className={classes.title}>  Название Проекта </div>
                                <div className={classes.worker}>Валерий  undefined</div>
                                <div className={classes.data}>26.08.2003</div>
                            </div>
                            <div className={classes.checkBox}>
                                <input type="checkbox" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
