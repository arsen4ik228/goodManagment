import React, {useState} from 'react'
import classes from './InputTextContainer.module.css'
import sendIcon from '../../Custom/icon/send.svg'
import shareIcon from '../../Custom/icon/subbar _ share.svg'
import calenderIcon from '../../Custom/icon/icon _ calendar.svg'
import attachIcon from '../../Custom/icon/subbar _ attach.svg'
import { resizeTextarea } from '../../../BLL/constans'

export default function InputTextContainer() {

    const [inputContent, setInputContent] = useState()
    const idTextarea = 1001
    const inputText = () => {
        setTimeout(resizeTextarea(idTextarea), 0)
    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.body}>
                    <div className={classes.choosePostContainer}>
                        <select name="choosePost">
                            <option value="">программист</option>
                            <option value="">грузчик</option>
                            <option value="">насяльника</option>
                        </select>
                    </div>
                    <div className={classes.inputTextContainer}>
                        <div className={classes.buttonSection}>
                            <img src={attachIcon} alt="attachIcon" />
                            <img src={calenderIcon} alt="calenderIcon" />
                        </div>
                        <div className={classes.inputText}>
                            <textarea
                                id={idTextarea}
                                value={inputContent}
                                onChange={() => inputText()}
                            />
                        </div>
                        <div className={classes.buttonSection}>
                            <img src={shareIcon} alt="shareIcon" />
                            <img src={sendIcon} alt="sendIcon" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
