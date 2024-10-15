import React, {useEffect, useState} from 'react';
import classes from "./Goal.module.css"
import Header from "../Custom/Header/Header";
import {useGetGoalIdQuery, useGetGoalQuery, useUpdateGoalMutation} from "../../BLL/goalApi";
import {useParams} from "react-router-dom";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import deleteImage from "../Custom/icon/delete.svg"
import search from "../Custom/icon/icon _ search.svg"
import SearchModal from "../Custom/SearchModal/SearchModal";
import HandlerQeury from "../Custom/HandlerQeury";
import MyEditor from "../Custom/Editor/MyEditor";
import HandlerMutation from "../Custom/HandlerMutation";

function NewGoal(props) {

    const {userId} = useParams();
    const [inputName, setInputName] = useState('')
    const [selectedOrg, setSelectedOrg] = useState('')
    const  [selectedGoalId, setSelectedGoalId] = useState('')
    const [isModalOpen, setModalOpen] = useState(false)

    const [editorState, setEditorState] = useState([]);
    const [htmlContent, setHtmlContent] = useState([]);
    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);

    const {
        data = [],
        isErrorGetGoal,
        isLoadingGetGoal,
        isFetchingGetGoal,
    } = useGetGoalQuery(userId, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            data: data || [],
            isErrorGetGoal: isError,
            isLoadingGetGoal: isLoading,
            isFetchingGetGoal: isFetching,
        }),
    });
    console.log(data)
    const {
        currentGoal = {},
        organizations = [],
        isLoadingGetGoalId,
        isErrorGetGoalId,
        isFetchingGetGoalId,
    } = useGetGoalIdQuery(
        { userId, goalId: selectedGoalId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentGoal: data?.currentGoal || {},
                organizations: data?.organizations || [],
                isLoadingGetGoalId: isLoading,
                isErrorGetGoalId: isError,
                isFetchingGetGoalId: isFetching,
            }),
            skip: !selectedGoalId,
        }
    );
    console.log(currentGoal);

    const [
        updateGoal,
        {
            isLoading: isLoadingUpdateGoalMutation,
            isSuccess: isSuccessUpdateGoalMutation,
            isError: isErrorUpdateGoalMutation,
            error: Error,
        },
    ] = useUpdateGoalMutation();

    useEffect(() => {
        if (Array.isArray(currentGoal.content)) {
            const editorState = currentGoal.content.map((item) => {
                if (typeof item === "string" && item.trim()) {
                    const contentBlocks = convertFromHTML(item);
                    return EditorState.createWithContent(
                        ContentState.createFromBlockArray(contentBlocks)
                    );
                }
                return EditorState.createEmpty();
            });
            setEditorState(editorState);
        }
    }, [currentGoal]);

    useEffect(() => {
        setHtmlContent(
            editorState.map((editor) =>
                draftToHtml(convertToRaw(editor.getCurrentContent()))
            )
        );
    }, [editorState]);

    const addEditor = () => {
        setEditorState((prevEditors) => [
            ...prevEditors,
            EditorState.createEmpty(),
        ]);
    };
    const deleteEditor = (index) => {
        setEditorState((prevEditors) => {
            const updated = [...prevEditors];
            updated.splice(index, 1); // Remove the editor at the specified index
            return updated;
        });
    };

    const saveUpdateGoal = async () => {
        await updateGoal({
            userId,
            goalId: selectedGoalId,
            _id: userId,
            content: htmlContent,
        })
            .unwrap()
            .then(() => {
                // После успешного обновления сбрасываем флаги
                setManualSuccessReset(false);
                setManualErrorReset(false);
            })
            .catch((error) => {
                // При ошибке также сбрасываем флаги
                setManualErrorReset(false);
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };


    return (

        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Цели'} create={true}></Header>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'organizations'} onChange={(e) => setSelectedGoalId(e.target.value)}>
                            <option>-</option>
                            {data?.map((item) => (
                                <>
                                    <option value={item.id}>{item.organization.organizationName}</option>
                                </>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={classes.body}>
                    {isErrorGetGoal ? (
                        <>
                            <HandlerQeury Error={isErrorGetGoal}></HandlerQeury>
                        </>
                    ) : (
                        <>
                            {isErrorGetGoalId ? (
                                <HandlerQeury Error={isErrorGetGoalId}></HandlerQeury>
                            ) : (
                                <>
                                    <HandlerQeury
                                        Loading={isLoadingGetGoal}
                                        Fetching={isFetchingGetGoal}
                                    ></HandlerQeury>

                                    {isFetchingGetGoalId || isLoadingGetGoalId ? (
                                        <HandlerQeury
                                            Loading={isLoadingGetGoalId}
                                            Fetching={isFetchingGetGoalId}
                                        ></HandlerQeury>
                                    ) : (
                                        <>
                                            {currentGoal.content ? (
                                                <>
                                                    {editorState.map((item, index) => (
                                                        <div key={index} className={classes.editorContainer}>
                                                            <MyEditor
                                                                key={index}
                                                                editorState={item}
                                                                setEditorState={(newState) => {
                                                                    const updatedState = [...editorState];
                                                                    updatedState[index] = newState;
                                                                    setEditorState(updatedState);
                                                                }}
                                                            />
                                                            <img
                                                                src={deleteImage}
                                                                alt="deleteImage"
                                                                className={classes.deleteIcon}
                                                                onClick={() => deleteEditor(index)}
                                                            />
                                                        </div>
                                                    ))}
                                                    <button
                                                        className={classes.add}
                                                        onClick={() => addEditor()}
                                                    >
                                                        <svg
                                                            width="19.998047"
                                                            height="20.000000"
                                                            viewBox="0 0 19.998 20"
                                                            fill="none"
                                                        >
                                                            <defs/>
                                                            <path
                                                                id="Vector"
                                                                d="M10 20C4.47 19.99 0 15.52 0 10L0 9.8C0.1 4.3 4.63 -0.08 10.13 0C15.62 0.07 20.03 4.56 19.99 10.06C19.96 15.56 15.49 19.99 10 20ZM5 9L5 11L9 11L9 15L11 15L11 11L15 11L15 9L11 9L11 5L9 5L9 9L5 9Z"
                                                                fill="#B4B4B4"
                                                                fill-opacity="1.000000"
                                                                fill-rule="nonzero"
                                                            />
                                                        </svg>

                                                        <div>
                            <span className={classes.nameButton}>
                              Добавить еще одну цель
                            </span>
                                                        </div>
                                                    </button>
                                                    <HandlerMutation
                                                        Loading={isLoadingUpdateGoalMutation}
                                                        Error={isErrorUpdateGoalMutation && !manualErrorReset} // Учитываем ручной сброс
                                                        Success={
                                                            isSuccessUpdateGoalMutation && !manualSuccessReset
                                                        } // Учитываем ручной сброс
                                                        textSuccess={"Цель обновлена"}
                                                        textError={
                                                            Error?.data?.errors[0]?.errors[0]
                                                        }
                                                    ></HandlerMutation>
                                                </>
                                            ) : (
                                                <div className={classes.pinOrg}> Выберите Организацию  </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}

                </div>

            </div>

            <footer className={classes.inputContainer}>
                <div className={classes.inputColumn}>
                    <div className={classes.inputRow2}>
                        <button onClick={() => saveUpdateGoal()}> СОХРАНИТЬ</button>
                    </div>
                </div>
            </footer>

            {/*<SearchModal></SearchModal>*/}
        </>
    );
}

export default NewGoal;