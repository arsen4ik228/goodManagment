import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import classes from './MainPolicy.module.css'
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add2-b.svg'
import share from '../Custom/icon/icon _ share.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Custom/Header/Header";
import { useGetPoliciesQuery } from '../../BLL/policyApi';
import { useGetPolicyDirectoriesQuery } from '../../BLL/policyDirectoriesApi';
import sublist from '../Custom/icon/icon _ sublist.svg'
import leftArrow from '../Custom/icon/icon _ leftarrow.svg'
import rightArrow from '../Custom/icon/icon _ rightarrow.svg'



const MainStrategy = () => {

    const { userId } = useParams()
    const navigate = useNavigate()
    const [openDirectories, setOpenDirectories] = useState(true)
    const [openInstruction, setOpenInstruction] = useState(false)
    const [openDirectives, setOpenDirectives] = useState(true)
    const [typeDisplayDirectives, setTypeDisplayDirectives] = useState(1)

  


    const {
        activeAndDraftInstructions = [],
        activeAndDraftDirectives = [],
        archiveInstructions = [],
        archiveDirectives = [],
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies
    } = useGetPoliciesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            isLoadingGetPolicies: isLoading,
            isErrorGetPolicies: isError,
            isFetchingGetPolicies: isFetching,
            activeAndDraftInstructions: data?.activeAndDraftInstructions || [],
            activeAndDraftDirectives: data?.activeAndDraftDirectives || [],
            archiveInstructions: data?.archiveInstructions || [],
            archiveDirectives: data?.archiveDirectives || [],
        }),
    });

    const {
        policyDirectory = [],
        isLoadingNewSpeedGoal,
        isErrorNewSpeedGoal,
    } = useGetPolicyDirectoriesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            policyDirectory: data || [],
            isLoadingNewSpeedGoal: isLoading,
            isErrorNewSpeedGoal: isError,
        }),
    });

    const TYPE_DISPLAY = {
        0: { type: 'Черновик', arrayDirectives: activeAndDraftDirectives, arrayInstruction: activeAndDraftInstructions},
        1:  {type: 'Активный', arrayDirectives: archiveDirectives, arrayInstruction: activeAndDraftInstructions},
        2: 'Отменён'
    }
    const displayDirectives = TYPE_DISPLAY[typeDisplayDirectives]

    const switchDisplayType = (direction, type) => {
        const directionValue = direction === 'right' ? 1 : -1
        if (type === 'directives') {
            setTypeDisplayDirectives(prevState => {
                const newValue = (prevState + directionValue + 3) % 3;
                console.log(newValue)
                return newValue;
            });
        }
        else if (type === 'instruction') {

        }
    }

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Политики'}></Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> Выберите Политику:</div>
                            <div className={classes.right}>
                                <div
                                    className={classes.title}
                                    onClick={() => setOpenInstruction(!openInstruction)}
                                >
                                    <div>
                                        <span>Инструкции</span>
                                        <img src={sublist} alt='sublist' style={{ transform: !openInstruction ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div>
                                {openInstruction && (
                                    <ul className={classes.selectList}>
                                        {activeAndDraftInstructions.map((item, index) => (
                                            <li
                                                key={index}
                                                style={{ color: item?.state === 'Активный' ? '#005475' : 'black' }}
                                                onClick={() => navigate(item?.id)}
                                            >
                                                {item?.policyName}
                                            </li>
                                        ))}
                                        {archiveInstructions.map((item, index) => (
                                            <li key={index} style={{ color: 'grey' }}>{item?.policyName}</li>
                                        ))}
                                    </ul>
                                )}

                                <div
                                    className={classes.title}
                                    onClick={() => setOpenDirectives(!openDirectives)}

                                >
                                    <div>
                                        <span>Директивы</span>
                                        <img src={sublist} alt='sublist' style={{ transform: !openDirectives ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div>
                                {openDirectives && (
                                    <>
                                        <div className={classes.selectType}>
                                            <div 
                                            className={classes.imageContainer}
                                            onClick={() => switchDisplayType('left','directives')}
                                            >
                                                <img src={leftArrow} alt="leftarrow" />
                                            </div>
                                            <span
                                            >
                                                {/* {TYPE_DISPLAY[typeDisplayDirectives].type} */}
                                                {displayDirectives.type}
                                            </span>
                                            <div 
                                            className={classes.imageContainer} 
                                            style={{ justifyContent: 'flex-end' }}
                                            onClick={() => switchDisplayType('right','directives')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div>
                                        <ul className={classes.selectList}>
                                            {displayDirectives.arrayDirectives?.map((item, index) => (
                                                <li key={index} style={{ color: item?.state === 'Активный' ? '#005475' : 'black' }}>{item?.policyName}</li>
                                            ))}
                                            {archiveDirectives.map((item, index) => (
                                                <li key={index} style={{ color: 'grey' }}>{item?.policyName}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <div
                                    className={classes.title}
                                    onClick={() => setOpenDirectories(!openDirectories)}
                                >
                                    <div>
                                        <span>Подборки</span>
                                        <img src={sublist} alt='sublist' style={{ transform: !openDirectories ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div>
                                {openDirectories && (
                                    <ul className={classes.selectList}>
                                        {policyDirectory.map((item, index) => (
                                            <>
                                                <li
                                                    key={index}
                                                // onClick={() => openDiretory(item.id)}
                                                >
                                                    {item?.directoryName}
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>
                    </>


                </div>
            </div>

        </>
    );
};

export default MainStrategy;