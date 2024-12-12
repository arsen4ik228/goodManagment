import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import iconAdd from '../Custom/icon/icon _ add _ blue.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import edit from '../Custom/icon/icon _ edit _ grey.svg'
import classes from './MainPolicy.module.css'
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add _ 005476.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Custom/Header/Header";
import { useGetPoliciesQuery, usePostPoliciesMutation } from '../../BLL/policyApi';
import { useGetPolicyDirectoriesQuery } from '../../BLL/policyDirectoriesApi';
import { useGetOrganizationsQuery } from '../../BLL/organizationsApi';
import sublist from '../Custom/icon/icon _ sublist.svg'
import leftArrow from '../Custom/icon/icon _ leftarrow.svg'
import rightArrow from '../Custom/icon/icon _ rightarrow.svg'
import CustomSelect from '../Custom/CustomSelect/CustomSelect';



const MainStrategy = () => {

    const { userId } = useParams()
    const navigate = useNavigate()
    const [openDirectories, setOpenDirectories] = useState()
    const [openInstruction, setOpenInstruction] = useState(false)
    const [openDirectives, setOpenDirectives] = useState(true)
    const [typeDisplayDirectives, setTypeDisplayDirectives] = useState(1)
    const [typeDisplayInstruction, setTypeDisplayInstruction] = useState(1)
    const [newPolicyDraftId, setNewPolicyDraftId] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [selectedOrganization, setSelectedOrganization] = useState([])


    const {
        activeDirectives = [],
        draftDirectives = [],
        archiveDirectives = [],
        activeInstructions = [],
        draftInstructions = [],
        archiveInstructions = [],
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies
    } = useGetPoliciesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            activeDirectives: data?.activeDirectives || [],
            draftDirectives: data?.draftDirectives || [],
            archiveDirectives: data?.archiveDirectives || [],
            activeInstructions: data?.activeInstructions || [],
            draftInstructions: data?.draftInstructions || [],
            archiveInstructions: data?.archiveInstructions || [],
            isLoadingGetPolicies: isLoading,
            isErrorGetPolicies: isError,
            isFetchingGetPolicies: isFetching,
        }),
    });

    const TYPE_DISPLAY = {
        0: { type: 'Отменён', arrayDirectives: archiveDirectives, arrayInstruction: archiveInstructions },
        1: { type: 'Активный', arrayDirectives: activeDirectives, arrayInstruction: activeInstructions },
        2: { type: 'Черновик', arrayDirectives: draftDirectives, arrayInstruction: draftInstructions },
    }
    const displayDirectives = TYPE_DISPLAY[typeDisplayDirectives]
    const displayInstruction = TYPE_DISPLAY[typeDisplayInstruction]

    const {
        policyDirectories = [],
        isLoadingNewSpeedGoal,
        isErrorNewSpeedGoal,
    } = useGetPolicyDirectoriesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            policyDirectories: data || [],
            isLoadingNewSpeedGoal: isLoading,
            isErrorNewSpeedGoal: isError,
        }),
    });

    const {
        organizations = []
    } = useGetOrganizationsQuery(userId, {
        selectFromResult: ({ data }) => ({
            organizations: data?.organizations || []
        })
    })

    const [
        postPolicy,
        {
            isLoading: isLoadingPostPoliciesMutation,
            isSuccess: isSuccessPostPoliciesMutation,
            isError: isErrorPostPoliciesMutation,
            error: ErrorPostPoliciesMutation,
        },
    ] = usePostPoliciesMutation();

    const savePolicy = async () => {
        await postPolicy({
            userId,
            policyName: 'Политика',
            content: ' ',
            organizationId: selectedOrganization,
        })
            .unwrap()
            .then((result) => {
                setNewPolicyDraftId(result?.id)
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    useEffect(() => {
        if (newPolicyDraftId !== null) {
            navigate(newPolicyDraftId)
        }
    }, [newPolicyDraftId])

    const switchDisplayType = (direction, type) => {
        const directionValue = direction === 'right' ? 1 : -1
        if (type === 'directives') {
            setTypeDisplayDirectives(prevState => {
                const newValue = (prevState + directionValue + 3) % 3;
                return newValue;
            });
        }
        else if (type === 'instruction') {
            setTypeDisplayInstruction(prevState => {
                const newValue = (prevState + directionValue + 3) % 3;
                return newValue;
            });
        }
    }

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Политики'}></Header>
                    <div className={classes.iconAdd}>
                        <img src={iconAdd} alt="" onClick={() => setOpenModal(true)} />
                    </div>
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
                                    <>
                                        <div className={classes.selectType}>
                                            <div
                                                className={classes.imageContainer}
                                                onClick={() => switchDisplayType('left', 'instruction')}
                                            >
                                                <img src={leftArrow} alt="leftarrow" />
                                            </div>
                                            <span
                                            >
                                                {/* {TYPE_DISPLAY[typeDisplayDirectives].type} */}
                                                {displayInstruction.type}
                                            </span>
                                            <div
                                                className={classes.imageContainer}
                                                style={{ justifyContent: 'flex-end' }}
                                                onClick={() => switchDisplayType('right', 'instruction')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div>
                                        <ul className={classes.selectList}>
                                            {!displayInstruction.arrayInstruction.length > 0 && (
                                                <li
                                                    style={{ color: 'grey', fontStyle: 'italic' }}
                                                >
                                                    Политика отсутствует
                                                </li>
                                            )}
                                            {displayInstruction.arrayInstruction.map((item, index) => (
                                                <li
                                                    key={index}
                                                    // style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                                    onClick={() => navigate(item?.id)}
                                                >
                                                    {item?.policyName}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
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
                                                onClick={() => switchDisplayType('left', 'directives')}
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
                                                onClick={() => switchDisplayType('right', 'directives')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div>
                                        <ul className={classes.selectList}>
                                            {!displayDirectives.arrayDirectives.length > 0 && (
                                                <li
                                                    style={{ color: 'grey', fontStyle: 'italic' }}
                                                >
                                                    Политика отсутствует
                                                </li>
                                            )}
                                            {displayDirectives.arrayDirectives?.map((item, index) => (
                                                <li
                                                    key={index}
                                                    // style={{ color: item?.state === 'Активный' ? 'black' : 'grey' }}
                                                    onClick={() => navigate(item?.id)}
                                                >
                                                    {item?.policyName}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <div
                                    className={classes.title}
                                // onClick={() => setOpenDirectories(!openDirectories)}
                                >
                                    <div>
                                        <span>Подборки</span>
                                        <img
                                            src={add}
                                            alt='add'
                                            style={{ width: '20px', height: '20px' }}
                                            onClick={() => navigate('createDirectory')}
                                        />
                                    </div>
                                </div>
                                <ul className={classes.selectList}>
                                    {policyDirectories.map((item, index) => (
                                        <>
                                            <li
                                                key={index}
                                                className={item?.id === openDirectories ? `${classes.selectedDirectory}` : ''}
                                                onClick={() => setOpenDirectories(item.id)}
                                            >
                                                {item?.directoryName}
                                            </li>

                                            {item?.id === openDirectories && (
                                                <>
                                                    <div
                                                        className={classes.directoryMenu}
                                                        onClick={() => navigate(`EditDirectory/${item.id}`)}
                                                    >
                                                        <span>Редактировать</span>
                                                        <img src={edit} alt="edit" />
                                                    </div>
                                                    {item?.policies?.map((item, index) => (
                                                        <ol
                                                            onClick={() => navigate(item?.id)}
                                                        >
                                                            {item?.policyName}
                                                        </ol>
                                                    ))}
                                                </>
                                            )}

                                        </>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    </>
                </div>
            </div>
            {openModal &&

                <CustomSelect
                    organizations={organizations}
                    isToOrganizations={selectedOrganization}
                    setToOrganizations={setSelectedOrganization}
                    setModalOpen={setOpenModal}
                    requestFunc={savePolicy}
                ></CustomSelect>
            }
        </>
    );
};

export default MainStrategy;