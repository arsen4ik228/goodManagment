import React from 'react';
import classes from "./AttachPolicy.module.css";
import close from "../SearchModal/icon/icon _ add.svg";

function AttachPolicy({ title, setModalOpen, firstArray, componentName, setIds, id }) {

    const selectItem = (itemId) => {
        if (id === itemId) setIds(null)
        else setIds(itemId)
    }
    console.log(firstArray)
    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.element_srch}>

                        <input type="search" placeholder="Поиск" />
                    </div>
                    <div className={classes.element_var}>
                        <div className={classes.heading}>{title}</div>
                            {firstArray?.map((item, index) => (
                                <div key={index} className={classes.item} onClick={() => selectItem(item.id)}>
                                    <span>
                                        {item[componentName]}
                                    </span>
                                    <input type="radio" checked={item.id === id} />
                                </div>
                            ))}
                    </div>

                    <footer className={classes.footer}>
                        <button onClick={() => setModalOpen(false)}>Подтвердить</button>
                    </footer>
                </div>
            </div>
        </>
    );
}

export default AttachPolicy;