import React from 'react';
import classes from "./Header.module.css";
import backRow from "../icon/icon _ back.svg";
import add from "../icon/icon _ add _ blue.svg";
import { useNavigate } from "react-router-dom";
import defaultAvatar from '../icon/messendger _ avatar.svg'

function Header({
    children,
    title,
    avatar,

    offLeftIcon,
    leftIcon,
    leftIconClick,
}) {

    const navigate = useNavigate();

    const onlyHeadTitleStyles = !title
        ? {
            justifyContent: 'center',
            textAlign: 'center'
        }
        : {}

    const iconClick = (section) => {
        switch (section) {
            case 'left': {
                if (!leftIconClick)
                    navigate(-1)
                else if (typeof leftIconClick === 'function')
                    leftIconClick()
                else
                    navigate(leftIconClick)
                break
            }
            case 'right': {
                
                break
            }
            default: break
        }

    }

    const addNew = () => {
        navigate('new')
    }
    return (
        <>
            <div className={classes.headContainer}>
                <div className={classes.headRow}>
                    <div className={classes.blueLine}></div>
                    <div className={classes.whiteLine}>
                        {!offLeftIcon && (
                            <div className={classes.iconContainer}>
                                <img
                                    src={leftIcon || backRow}
                                    alt="leftIcon"
                                    onClick={() => iconClick('left')}
                                />
                            </div>
                        )}
                        <div
                            className={classes.headElem}>
                            {title && (
                                <div className={classes.userAvatar}>
                                    <img src={avatar || defaultAvatar} alt="avatar" />
                                </div>
                            )}
                            <div
                                className={classes.txt}
                                style={onlyHeadTitleStyles}
                            >
                                <div className={classes.headText}>{children}</div>
                                {title && (
                                    <div
                                        className={classes.bottomText}
                                    >
                                        {title}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={classes.iconContainer}>
                            <img
                                src={add}
                                alt="add"
                            />
                        </div>
                        <div className={classes.iconContainer}>
                            <img
                                src={add}
                                alt="add"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;