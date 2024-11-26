import React from 'react'
import classes from './AttachStatistics.module.css'
import Header from '../../Custom/Header/Header'

export default function AttachStatistics() {
    return (
        <div className={classes.wrapper}>

            <>
                <Header create={false} title={'Прикрепить статистику'}></Header>
            </>
            <div className={classes.body}>
                <>
                    {/* <div className={classes.first}>
                        <input type={'text'} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)} />
                    </div> */}
                    <div className={classes.element_srch}>

                        <input type="search" placeholder="Поиск" />
                    </div>

                    <div className={classes.bodyContainer}>
                        <>

                            <ul className={classes.selectList}>
                                {/* {!activeDirectives.length > 0 && (
                                        <li
                                            style={{ color: 'grey', fontStyle: 'italic' }}
                                        >
                                            Политика отсутствует
                                        </li>
                                    )}
                                    {activeDirectives?.map((item, index) => (
                                        <li
                                            key={index}
                                            style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                            onClick={() => handleSelectItem(item?.id)}
                                        >
                                            <span>
                                                {item?.policyName}
                                            </span>
                                            <input checked={selectedId.includes(item?.id)} type="checkbox" />
                                        </li>
                                    ))} */}
                                <li>бубубу</li>
                                <li>бубубу</li>

                            </ul>
                        </>
                    </div>
                </>
            </div>
        </div>
    )
}
