import React, { useEffect, useState } from 'react'
import { useMemo } from 'react'
import Header from '../../Custom/Header/Header'
import classes from "./CreatePolicyDirectory.module.css"
import { useNavigate, useParams } from 'react-router-dom'
import { useGetPolicyDirectoriesQuery, usePostPolicyDirectoriesMutation } from '../../../BLL/policyDirectoriesApi'
import { useGetPoliciesQuery } from '../../../BLL/policyApi'
import HandlerMutation from '../../Custom/HandlerMutation'
import SetPolicyDirectoryName from '../../Custom/SetPolicyDirectoyName/SetPolicyDirectoryName'

export default function CreatePolicyDirectory() {

    const navigate = useNavigate()
    const [selectedId, setSelectedId] = useState([])
    const [directoryName, setDirectoryName] = useState('')
    const [searchTerm, setSearchTerm] = useState('');

    const {
        activeDirectives = [],
        activeInstructions = [],
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies
    } = useGetPoliciesQuery({organizationId: localStorage.getItem('selectedOrganizationId')}, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            activeDirectives: data?.activeDirectives || [],
            activeInstructions: data?.activeInstructions || [],
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
    

    const filteredItems = useMemo(() => {
        const filterActiveDirectives = activeDirectives.filter(item =>
            item.policyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const filterActiveInstructions = activeInstructions.filter(item =>
            item.policyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
            activeDirectives: filterActiveDirectives,
            activeInstructions: filterActiveInstructions
        };
    }, [activeDirectives, activeInstructions, searchTerm]);


    const savePolicyDirectory = async () => {
        await postDirectory({
            directoryName,
            policyToPolicyDirectories: selectedId,
        })
            .unwrap()
            .then((result) => {
                // reset();
                navigate(`/Policy/EditDirectory/${result?.id}`)
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
                            <input
                                placeholder=' Введите название'
                                type={'text'} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)} />
                        </div>
                        <div className={classes.element_srch}>
                            <input
                                type="text"
                                placeholder="Поиск"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                                        {!filteredItems.activeDirectives.length > 0 && (
                                            <li
                                                style={{ color: 'grey', fontStyle: 'italic' }}
                                            >
                                                Политика отсутствует
                                            </li>
                                        )}
                                        {filteredItems.activeDirectives?.map((item, index) => (
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
                                        {!filteredItems.activeInstructions.length > 0 && (
                                            <li
                                                style={{ color: 'grey', fontStyle: 'italic' }}
                                            >
                                                Политика отсутствует
                                            </li>
                                        )}
                                        {filteredItems.activeInstructions.map((item, index) => (
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
