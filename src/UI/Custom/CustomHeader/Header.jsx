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

    onRightIcon,
    rightIcon,
    rightIconClick,

    onRight2Icon,
    right2Icon,
    right2IconClick
}) {

    const navigate = useNavigate();

    const onlyHeadTitleStyles = !title
        ? {
            justifyContent: 'center',
            textAlign: 'center'
        }
        : {}


    const iconClick = (section) => {
        const actions = {
            left: {
                func: () => navigate(-1),
                alt: leftIconClick
            },
            right: {
                func: () => navigate('new'),
                alt: rightIconClick
            },
            right2: {
                func: () => { },
                alt: right2IconClick
            }
        };

        const { func, alt } = actions[section] || {};

        if (!alt)
            func()
        else if (typeof alt === 'function')
            alt()
        else
            navigate(alt);

    };



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
                        {onRight2Icon && (
                            <div className={classes.iconContainer}>
                                <img
                                    src={right2Icon}
                                    alt="right2Icon"
                                    onClick={() => iconClick('right2')}
                                />
                            </div>
                        )}
                        {onRightIcon && (
                            <div className={classes.iconContainer}>
                                <img
                                    src={rightIcon || add}
                                    alt="add"
                                    onClick={() => iconClick('right')}
                                />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;