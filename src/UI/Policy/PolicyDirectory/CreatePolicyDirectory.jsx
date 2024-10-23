import React, { useEffect, useState } from 'react'
import Header from '../../Custom/Header/Header'
import classes from "./CreatePolicyDirectory.module.css"
import { useParams } from 'react-router-dom'
import { useGetPolicyDirectoriesQuery, usePostPolicyDirectoryMutation } from '../../../BLL/policyDirectoriesApi'
import { useGetPoliciesQuery } from '../../../BLL/policyApi'
import HandlerMutation from '../../Custom/HandlerMutation'

export default function CreatePolicyDirectory() {  

    const {userId} = useParams()
    const [selectedId, setSelectedId] = useState([])
    const [directoryName, setDirectoryName] = useState('')

    const {
        instructions = [],
        directives = [],
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies
    } = useGetPoliciesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            isLoadingGetPolicies: isLoading,
            isErrorGetPolicies: isError,
            isFetchingGetPolicies: isFetching,
            instructions: data?.instructions || [],
            directives: data?.directives || [],
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
    ] = usePostPolicyDirectoryMutation();

    const handleSelectItem = (id) => {
        setSelectedId(prevSelectedId =>
            prevSelectedId.includes(id)
            ? prevSelectedId.filter(item => item !== id)
            : [...prevSelectedId, id]
    )};


    useEffect(()=>{

    },[])

    const reset = () => {
        setDirectoryName('')
        setSelectedId([])
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
    
    return (
        <>
        <div className={classes.wrapper}>
            <>
                <Header create={false} title={' Новая подборка политик'}></Header>
            </>

            <div className={classes.directoryNane}>
                <input type="data" className={classes.inputName} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)}/>
            </div>
            <div className={classes.body}>
                <div className={classes.left}> Выберите Политики:</div>
                <ul className={classes.selectList}>
                    {instructions?.map((item) => (
                        <li key={item.id} onChange={(e) => handleSelectItem(item.id)}>
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={selectedId.includes(item.id)}
                                            readOnly
                                        />
                                        <div onClick={()=>handleSelectItem(item.id)} >{item.policyName}</div>
                                    </>
                        </li>
                    ))}
                    {directives?.map((item) => (
                        <li key={item.id} onChange={(e) => handleSelectItem(item.id)}>
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={selectedId.includes(item.id)}
                                            readOnly
                                        />
                                        <div onClick={()=>handleSelectItem(item.id)}>{item.policyName}</div>
                                    </>
                        </li>
                    ))}
                </ul>
            </div>

            <footer className={classes.inputContainer}>
                <div className={classes.inputColumn}>
                    <div className={classes.inputRow2}>
                        <button onClick={() => savePolicyDirectory()}> СОЗДАТЬ</button>
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
