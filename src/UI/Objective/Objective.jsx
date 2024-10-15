import React, {useEffect, useState} from 'react';
import Header from "../Custom/Header/Header";
import classes from "./Objective.module.css";
import {useGetSpeedGoalIdQuery, useGetSpeedGoalUpdateQuery, useUpdateSpeedGoalMutation} from "../../BLL/speedGoalApi";
import {useParams} from "react-router-dom";
import HandlerQeury from "../Custom/HandlerQeury";
import MyEditor from "../Custom/Editor/MyEditor";
import deleteImage from "../Custom/icon/delete.svg"
import HandlerMutation from "../Custom/HandlerMutation";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

function Objective(props) {

    const {userId} = useParams();
    const [testParam, setTestParam] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedStrategId, setSelectedStrategId] = useState('');
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);

    const [contentEditors, setContentEditors] = useState([]);
    const [situationEditors, setSituationEditors] = useState([]);
    const [rootCauseEditors, setRootCauseEditors] = useState([]);

    const [htmlContent, setHtmlContent] = useState([]);
    const [htmlSituation, setHtmlSituation] = useState([]);
    const [htmlRootCause, setHtmlRootCause] = useState([]);


    const {
        data = [],
        isLoadingGetUpdateSpeedGoal,
        isErrorGetUpdateSpeedGoal,
    } = useGetSpeedGoalUpdateQuery(userId, {
        selectFromResult: ({data, isLoading, isError}) => ({
            data: data || [],
            isLoadingGetUpdateSpeedGoal: isLoading,
            isErrorGetUpdateSpeedGoal: isError,
        }),
    });

    const {
        currentSpeedGoal = {},
        isLoadingGetSpeedGoalId,
        isErrorGetSpeedGoalId,
        isFetchingGetSpeedGoalId,
    } = useGetSpeedGoalIdQuery(
        { userId, strategId: selectedStrategId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentSpeedGoal: data?.currentSpeedGoal || {},
                isLoadingGetSpeedGoalId: isLoading,
                isErrorGetSpeedGoalId: isError,
                isFetchingGetSpeedGoalId: isFetching,
            }),
            skip: !selectedStrategId,
        }
    );
    const [
        updateSpeedGoal,
        {
            isLoading: isLoadingUpdateSpeedGoalMutation,
            isSuccess: isSuccessUpdateSpeedGoalMutation,
            isError: isErrorUpdateSpeedGoalMutation,
        },
    ] = useUpdateSpeedGoalMutation();


    // Convert editor content to HTML whenever it changes
    useEffect(() => {
        setHtmlContent(
            contentEditors.map((editor) =>
                draftToHtml(convertToRaw(editor.getCurrentContent()))
            )
        );
    }, [contentEditors]);

    useEffect(() => {
        setHtmlSituation(
            situationEditors.map((editor) =>
                draftToHtml(convertToRaw(editor.getCurrentContent()))
            )
        );
    }, [situationEditors]);

    useEffect(() => {
        setHtmlRootCause(
            rootCauseEditors.map((editor) =>
                draftToHtml(convertToRaw(editor.getCurrentContent()))
            )
        );
    }, [rootCauseEditors]);

    useEffect(() => {
        // Initialize editors for 'content' if it's an array
        if (Array.isArray(currentSpeedGoal.content)) {
            const contentStates = currentSpeedGoal.content.map((item) => {
                if (typeof item === "string" && item.trim()) {
                    const contentBlocks = convertFromHTML(item);
                    return EditorState.createWithContent(
                        ContentState.createFromBlockArray(contentBlocks)
                    );
                }
                return EditorState.createEmpty();
            });
            setContentEditors(contentStates);
        }

        // Initialize editors for 'situation' if it's an array
        if (Array.isArray(currentSpeedGoal.situation)) {
            const situationStates = currentSpeedGoal.situation.map((item) => {
                if (typeof item === "string" && item.trim()) {
                    const situationBlocks = convertFromHTML(item);
                    return EditorState.createWithContent(
                        ContentState.createFromBlockArray(situationBlocks)
                    );
                }
                return EditorState.createEmpty();
            });
            setSituationEditors(situationStates);
        }

        // Initialize editors for 'rootCause' if it's an array
        if (Array.isArray(currentSpeedGoal.rootCause)) {
            const rootCauseStates = currentSpeedGoal.rootCause.map((item) => {
                if (typeof item === "string" && item.trim()) {
                    const rootCauseBlocks = convertFromHTML(item);
                    return EditorState.createWithContent(
                        ContentState.createFromBlockArray(rootCauseBlocks)
                    );
                }
                return EditorState.createEmpty();
            });
            setRootCauseEditors(rootCauseStates);
        }
    }, [currentSpeedGoal]);

    const saveUpdateSpeedGoal = async () => {
        await updateSpeedGoal({
            userId,
            objectiveId: currentSpeedGoal.id,
            _id: userId,
            situation: htmlSituation,
            content: htmlContent,
            rootCause: htmlRootCause,
            strategyId: selectedStrategId,
        })
            .unwrap()
            .then(() => {
                setManualSuccessReset(false);
                setManualErrorReset(false);
            })
            .catch((error) => {
                setManualErrorReset(false);
                console.error("Error:", JSON.stringify(error, null, 2));
            });
    };

    const addEditor = () => {
        switch (activeIndex) {
            case '0':
                setContentEditors((prevEditors) => [
                    ...prevEditors,
                    EditorState.createEmpty(),
                ]);
                break;
            case '1':
                setSituationEditors((prevEditors) => [
                    ...prevEditors,
                    EditorState.createEmpty(),
                ]);
                break;
            case '2':
                console.log('работаем братья V')
                setRootCauseEditors((prevEditors) => [
                    ...prevEditors,
                    EditorState.createEmpty(),
                ]);
                break;
            default:
                break;
        }
    };

    const handleEditorChange = (index, newState, type) => {
        switch (type) {
            case "content":
                setContentEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated[index] = newState;
                    return updated;
                });
                break;
            case "situation":
                setSituationEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated[index] = newState;
                    return updated;
                });
                break;
            case "rootCause":
                setRootCauseEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated[index] = newState;
                    return updated;
                });
                break;
            default:
                break;
        }
    };

    const deleteEditor = (index) => {
        switch (activeIndex) {
            case '0':
                setContentEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated.splice(index, 1); // Remove the editor at the specified index
                    return updated;
                });
                break;
            case '1':
                setSituationEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated.splice(index, 1); // Remove the editor at the specified index
                    return updated;
                });
                break;
            case '2':
                console.log(activeIndex, 'работаем братья')
                setRootCauseEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated.splice(index, 1); // Remove the editor at the specified index
                    return updated;
                });
                break;
            default:
                break;
        }
    };


    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={true} title={' Краткосрочная цель'}/>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'strategy'} onChange={(e) => setSelectedStrategId(e.target.value)}>
                            <option>-</option>
                            {data?.map((item) => (
                                <>
                                    <option value={item.id}>Стратегия №{item.strategyNumber}</option>
                                </>
                            ))}
                        </select>
                    </div>

                    <div className={classes.second}>
                        <select name={'type'} value={activeIndex} onChange={(e) => setActiveIndex(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value='0'> Краткосрочная цель</option>
                            <option value='1'> Ситуация</option>
                            <option value='2'> Причина</option>
                        </select>
                    </div>
                </div>


                <div className={classes.body}>
                    {isErrorGetUpdateSpeedGoal && (
                        <>
                            <HandlerQeury Error={isErrorGetUpdateSpeedGoal}></HandlerQeury>
                        </>
                    )}

                    {isLoadingGetUpdateSpeedGoal && (
                        <>
                            <HandlerQeury Loading={isLoadingGetUpdateSpeedGoal}></HandlerQeury>
                        </>
                    )}

                    {isErrorGetSpeedGoalId ? (
                        <HandlerQeury Error={isErrorGetSpeedGoalId}/>
                    ) : isFetchingGetSpeedGoalId || isLoadingGetSpeedGoalId ? (
                        <HandlerQeury
                            Loading={isLoadingGetSpeedGoalId}
                            Fetching={isFetchingGetSpeedGoalId}
                        />
                    ) : (
                        <>
                            {activeIndex == 0 &&
                                contentEditors.map((editorState, index) => (
                                    <div key={index} className={classes.editorContainer}>
                                        <MyEditor
                                            editorState={editorState}
                                            setEditorState={(newState) =>
                                                handleEditorChange(index, newState, "content")
                                            }
                                        />
                                        <img
                                            src={deleteImage}
                                            alt="deleteImage"
                                            className={classes.deleteIcon}
                                            onClick={() => deleteEditor(index)}
                                        />
                                    </div>
                                ))}
                            {activeIndex == 1 &&
                                situationEditors.map((editorState, index) => (
                                    <div key={index} className={classes.editorContainer}>
                                        <MyEditor
                                            editorState={editorState}
                                            setEditorState={(newState) =>
                                                handleEditorChange(index, newState, "situation")
                                            }
                                        />
                                        <img
                                            src={deleteImage}
                                            alt="deleteImage"
                                            className={classes.deleteIcon}
                                            onClick={() => deleteEditor(index)}
                                        />
                                    </div>
                                ))}
                            {activeIndex == 2 &&
                                rootCauseEditors.map((editorState, index) => (
                                    <div key={index} className={classes.editorContainer}>
                                        <MyEditor
                                            editorState={editorState}
                                            setEditorState={(newState) =>
                                                handleEditorChange(index, newState, "rootCause")
                                            }
                                        />
                                        <img
                                            src={deleteImage}
                                            alt="deleteImage"
                                            className={classes.deleteIcon}
                                            onClick={() => deleteEditor(index)}
                                        />
                                    </div>
                                ))}

                            <HandlerMutation
                                Loading={isLoadingUpdateSpeedGoalMutation}
                                Error={isErrorUpdateSpeedGoalMutation && !manualErrorReset}
                                Success={isSuccessUpdateSpeedGoalMutation && !manualSuccessReset}
                                textSuccess={"Краткосрочная цель обновлена"}
                            />
                            {Object.keys(currentSpeedGoal).length > 0 && (
                                <button
                                    className={classes.add}
                                    onClick={() => addEditor(activeIndex)}
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
                                        {" "}
                                        <span className={classes.nameButton}>
                    {" "}
                                            Добавить еще одну цель
                  </span>
                                    </div>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <footer className={classes.inputContainer}>
                <div className={classes.inputColumn}>
                    <div className={classes.inputRow2}>
                        <button onClick={() => saveUpdateSpeedGoal()}> отредактировать</button>
                    </div>
                </div>
            </footer>

        </>
    );
}

export default Objective;