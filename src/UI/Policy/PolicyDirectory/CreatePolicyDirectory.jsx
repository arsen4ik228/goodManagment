import React, { useEffect, useState } from 'react'
import Header from '../../Custom/Header/Header'
import classes from "./CreatePolicyDirectory.module.css"
import { useParams } from 'react-router-dom'
import { useGetPolicyDirectoriesQuery, usePostPolicyDirectoriesMutation } from '../../../BLL/policyDirectoriesApi'
import { useGetPoliciesQuery } from '../../../BLL/policyApi'
import HandlerMutation from '../../Custom/HandlerMutation'
import SetPolicyDirectoryName from '../../Custom/SetPolicyDirectoyName/SetPolicyDirectoryName'

export default function CreatePolicyDirectory() {

    const { userId } = useParams()
    const [selectedId, setSelectedId] = useState([])
    const [directoryName, setDirectoryName] = useState('')
    const [openModal, setOpenModal] =useState(false)


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
    const [
        postDirectory,
        {
            isLoading: isLoadingUpdatePoliciesMutation,
            isSuccess: isSuccessUpdatePoliciesMutation,
            isError: isErrorUpdatePoliciesMutation,
            error: ErrorUpdatePoliciesMutation,
        },
    ] = usePostPolicyDirectoriesMutation();

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
        // setOpenModal(false)
    }

    const savePolicyDirectory = async () => {
        await postDirectory({
            userId,
            directoryName,
            policyToPolicyDirectories: selectedId,
        })
            .unwrap()
            .then(() => {
                reset();
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };
    console.log(selectedId)
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
                    <div className={classes.inputColumn}>
                        <div className={classes.inputRow2}>
                            <button onClick={() => savePolicyDirectory()}>СОЗДАТЬ</button>
                        </div>
                    </div>
                </footer>
            </div>

            {openModal && (
                <SetPolicyDirectoryName name={directoryName} setName={setDirectoryName} setModalOpen={setOpenModal} requestFunction={savePolicyDirectory}></SetPolicyDirectoryName>
            )}
            <HandlerMutation
                Loading={isLoadingUpdatePoliciesMutation}
                Error={isErrorUpdatePoliciesMutation}
                Success={isSuccessUpdatePoliciesMutation}
                textSuccess={"Подборка политик успешко создана"}
                textError={ErrorUpdatePoliciesMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>

        </>
    )
}
