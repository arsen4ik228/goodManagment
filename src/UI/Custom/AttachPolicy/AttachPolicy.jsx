import React, { useMemo } from 'react';
import classes from "./AttachPolicy.module.css";
import close from "../SearchModal/icon/icon _ add.svg";

function AttachPolicy({ title, setModalOpen, firstArray, componentName, setIds, id }) {

    const [searchTerm, setSearchTerm] = React.useState('');


    const selectItem = (itemId) => {
        if (id === itemId) setIds(null)
        else setIds(itemId)
    }

    const filteredItems = useMemo(() =>
        firstArray.filter(item => item.policyName.toLowerCase().includes(searchTerm.toLowerCase())),
        [firstArray, searchTerm]
    )

    return (
        <>
            <div className={classes.wrapper}>

                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.element_srch}>
                        <input
                            type="text"
                            placeholder="Поиск"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={classes.element_var}>
                        <div className={classes.heading}>{title}</div>
                        {filteredItems?.map((item, index) => (
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