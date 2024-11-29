import React from 'react'
import classes from './Statistics.module.css'
import Header from '../Custom/Header/Header'
import icon from '../Custom/icon/icon _ downarrow _ 005475.svg'
import { resizeTextarea } from '../../BLL/constans'

export default function Statistics() {
    return (
        <div className={classes.wrapper}>
            <>
                <Header create={false} title={'Cтатистика'}></Header>
            </>
            <div className={classes.body}>

            </div>
            <div className={classes.menu}>
                <div className={classes.menuContent}>
                    <div className={classes.nameSection}>
                        <input type="text" value={'Statistic'} />
                        <img src={icon} alt="icon" />
                    </div>
                    <div className={classes.menuContainer}>
                        <div className={classes.name}
                        >
                            Пост:
                        </div>
                        <div className={classes.selectSection}>
                            <select>
                                <option > Пост 1</option>
                                <option > Пост 1</option>
                            </select>
                        </div>
                    </div>

                    <div className={classes.menuContainer}>
                        <div className={classes.name}
                        >
                            Тип графика:
                        </div>
                        <div className={classes.selectSection}>
                            <select>
                                <option > Пост 1</option>
                                <option > Пост 1</option>
                            </select>
                        </div>
                    </div>
                    <div className={classes.tableContainer}>
                        <div className={classes.tableDots}>
                            <div className={classes.rowTableDtos}>
                                <input 
                                type="text" 
                                value={'23.07.2024'}
                                style={{borderRight: '1px solid grey '}}
                                />
                                <input type="text" value={'556000'}/>
                            </div>
                            <div className={classes.rowTableDtos}>
                                <input 
                                type="text" 
                                value={'23.07.2024'}
                                style={{borderRight: '1px solid grey '}}
                                />
                                <input type="text" value={'556000'}/>
                            </div>
                        </div>
                    </div>
                    <div className={classes.menuContainer}>
                        <textarea
                            name='textarea'
                            id='1'
                            placeholder='Введите описание статистики'
                            onChange={(e) => {
                                setTimeout(resizeTextarea('1'), 0)
                            }}
                        >
                        </textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}
