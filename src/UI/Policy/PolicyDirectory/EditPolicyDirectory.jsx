import React, { useEffect, useState } from 'react'
import Header from '../../Custom/Header/Header'
import classes from "./EditPolicyDirectory.module.css"
import { useNavigate, useParams } from 'react-router-dom'
import { useDeletePolicyDirectoriesMutation, usePostPolicyDirectoryMutation, useUpdatePolicyDirectoriesMutation, useGetPolicyDirectoriesIdQuery } from '../../../BLL/policyDirectoriesApi'
import { useGetPoliciesQuery } from '../../../BLL/policyApi'
import iconDelete from '../../Custom/icon/icon _ delete _ red.svg'
import HandlerMutation from '../../Custom/HandlerMutation'
import SetPolicyDirectoryName from '../../Custom/SetPolicyDirectoyName/SetPolicyDirectoryName'

export default function EditPolicyDirectories() {

    const { userId, policyDirectoryId } = useParams()
    const navigate = useNavigate()
    const [selectedId, setSelectedId] = useState([])
    const [directoryName, setDirectoryName] = useState('')
    const [openModal, setOpenModal] = useState(false)

    const {
        activeDirectives = [],
        activeInstructions = [],
        policyDirectory = [],
        data = [],
        isLoadingGetPolicyDirectories,
        isErrorGetPolicyDirectories,
        isFetchingGetPolicyDirectories,
    } = useGetPolicyDirectoriesIdQuery({ userId, policyDirectoryId }, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            activeDirectives: data?.activeDirectives || [],
            activeInstructions: data?.activeInstructions || [],
            policyDirectory: data?.policyDirectory || [],
            data: data?.data || [],
            isLoadingGetPolicyDirectories: isLoading,
            isErrorGetPolicyDirectories: isError,
            isFetchingGetPolicyDirectories: isFetching,
        }),
    });
    console.warn(activeDirectives, policyDirectory)

    const [
        updatePolicyDirectories,
        {
            isLoading: isLoadingUpdatePolicyDirectoriesMutation,
            isSuccess: isSuccessUpdatePolicyDirectoriesMutation,
            isError: isErrorUpdatePolicyDirectoriesMutation,
            error: ErrorUpdateDirectories,
        },
    ] = useUpdatePolicyDirectoriesMutation();

    const [
        deletePolicyDirectories,
        {
            isLoading: isLoadingDeletePolicyDirectoriesMutation,
            isSuccess: isSuccessDeletePolicyDirectoriesMutation,
            isError: isErrorDeletePolicyDirectoriesMutation,
            error: ErrorDeleteDirectories,
        },
    ] = useDeletePolicyDirectoriesMutation();

    useEffect(() => {
        setDirectoryName(policyDirectory.directoryName)
        if (policyDirectory?.policies?.length > 0) {
            setSelectedId(prevSelectedId =>
                [...prevSelectedId, ...policyDirectory?.policies?.map(item => item.id)]
            );
        }
    }, [policyDirectory])

    const handleSelectItem = (id) => {
        setSelectedId(prevSelectedId =>
            prevSelectedId.includes(id)
                ? prevSelectedId.filter(item => item !== id)
                : [...prevSelectedId, id]
        )
    };

    const addPolicyToSelectedPolicy = (id) => {

    }

    const reset = () => {
        setDirectoryName('')
        setSelectedId([])
        setOpenModal(false)
    }
    console.log(selectedId)
    const updatePolicyDirectory = async () => {
        await updatePolicyDirectories({
            userId,
            policyDirectoryId,
            directoryName,
            policyToPolicyDirectories: selectedId,
        })
            .unwrap()
            .then(() => {

            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    const deletePolicyDirectory = async () => {
        await deletePolicyDirectories({
            userId,
            policyDirectoryId,
        })
            .unwrap()
            .then(() => {
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            })

            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    }

    console.log(policyDirectory)
    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={' Новая подборка политик'}></Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.first}>
                            <input type={'text'} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)} />
                        </div>
                        <div className={classes.element_srch}>

                            <input type="search" placeholder="Поиск" />
                        </div>
                        <div className={classes.bodyContainer}>

                            <div className={classes.left}>
                                <div
                                    className={classes.title}
                                // onClick={() => setOpenDirectives(!openDirectives)}

                                >
                                    <div>
                                        <span>Директивы</span>
                                        {/* <img src={sublist} alt='sublist' style={{ transform: !openDirectives ? 'rotate(90deg)' : 'none' }} /> */}
                                    </div>
                                </div>

                                <>

                                    <ul className={classes.selectList}>
                                        {!activeDirectives.length > 0 && (
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
                                        ))}
                                    </ul>
                                </>
                            </div>
                            <div className={classes.right}>
                                <div
                                    className={classes.title}
                                >
                                    <div>
                                        <span>Инструкции</span>
                                        {/* <img src={sublist} alt='sublist' style={{ transform: !openInstruction ? 'rotate(90deg)' : 'none' }} /> */}
                                    </div>
                                </div>

                                <>
                                    {/* <div className={classes.selectType}>
                                            <div
                                                className={classes.imageContainer}
                                                onClick={() => switchDisplayType('left', 'instruction')}
                                            >
                                                <img src={leftArrow} alt="leftarrow" />
                                            </div>
                                            <span
                                            >
                                                {displayInstruction.type}
                                            </span>
                                            <div
                                                className={classes.imageContainer}
                                                style={{ justifyContent: 'flex-end' }}
                                                onClick={() => switchDisplayType('right', 'instruction')}
                                            >
                                                <img src={rightArrow} alt="rightarrow" />
                                            </div>
                                        </div> */}
                                    <ul className={classes.selectList}>
                                        {!activeInstructions.length > 0 && (
                                            <li
                                                style={{ color: 'grey', fontStyle: 'italic' }}
                                            >
                                                Политика отсутствует
                                            </li>
                                        )}
                                        {activeInstructions.map((item, index) => (
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
                                        ))}
                                    </ul>
                                </>
                            </div>
                        </div>
                    </>
                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div>
                            <button className={classes.addButton} onClick={() => updatePolicyDirectory()}>CОХРАНИТЬ</button>
                        </div>
                        <div>
                            <button className={classes.deleteButton} onClick={() => deletePolicyDirectory()}>УДАЛИТЬ</button>
                        </div>
                    </div>
                </footer>
            </div>


            <HandlerMutation
                Loading={isLoadingDeletePolicyDirectoriesMutation}
                Error={isErrorDeletePolicyDirectoriesMutation}
                Success={isSuccessDeletePolicyDirectoriesMutation}
                textSuccess={"Подборка политик успешно удалена"}
                textError={ErrorDeleteDirectories?.data?.errors[0]?.errors}
            ></HandlerMutation>
            <HandlerMutation
                Loading={isLoadingUpdatePolicyDirectoriesMutation}
                Error={isErrorUpdatePolicyDirectoriesMutation}
                Success={isSuccessUpdatePolicyDirectoriesMutation}
                textSuccess={"Подборка политик успешно обновлена"}
                textError={ErrorUpdateDirectories?.data?.errors[0]?.errors}
            ></HandlerMutation>

        </>
    )
}
