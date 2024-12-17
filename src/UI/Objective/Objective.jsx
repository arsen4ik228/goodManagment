import React, { useEffect, useState } from 'react';
import Header from "../Custom/Header/Header";
import classes from "./Objective.module.css";
import { useGetSpeedGoalIdQuery, useGetSpeedGoalUpdateQuery, useUpdateSpeedGoalMutation, useGetSpeedGoalsQuery } from "../../BLL/speedGoalApi";
import { useParams } from "react-router-dom";
import HandlerQeury from "../Custom/HandlerQeury";
import MyEditor from "../Custom/Editor/MyEditor";
import deleteImage from "../Custom/icon/delete.svg"
import HandlerMutation from "../Custom/HandlerMutation";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


function Objective(props) {

    const { userId } = useParams();
    const [testParam, setTestParam] = useState("");
    const [activeIndex, setActiveIndex] = useState('0');
    const [selectedStrategyId, setselectedStrategyId] = useState('');
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);

    const [contentEditors, setContentEditors] = useState([]);
    const [situationEditors, setSituationEditors] = useState([]);
    const [rootCauseEditors, setRootCauseEditors] = useState([]);

    const [htmlContent, setHtmlContent] = useState([]);
    const [htmlSituation, setHtmlSituation] = useState([]);
    const [htmlRootCause, setHtmlRootCause] = useState([]);


    const {
        activeAndDraftStrategies = [],
        archiveStrategies = [],
        isLoadingGetUpdateSpeedGoal,
        isErrorGetUpdateSpeedGoal,
    } = useGetSpeedGoalsQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            activeAndDraftStrategies: data?.activeAndDraftStrategies || [],
            archiveStrategies: data?.archiveStrategies || [],
            isLoadingGetUpdateSpeedGoal: isLoading,
            isErrorGetUpdateSpeedGoal: isError,
        }),
    });
    // console.log(activeAndDraftStrategies)

    const {
        currentSpeedGoal = {},
        isArchive,
        isLoadingGetSpeedGoalId,
        isErrorGetSpeedGoalId,
        isFetchingGetSpeedGoalId,
    } = useGetSpeedGoalIdQuery(
        { userId, strategId: selectedStrategyId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentSpeedGoal: data?.currentSpeedGoal || {},
                isArchive: data?.isArchive,
                isLoadingGetSpeedGoalId: isLoading,
                isErrorGetSpeedGoalId: isError,
                isFetchingGetSpeedGoalId: isFetching,
            }),
            skip: !selectedStrategyId,
        }
    );

    console.log(isArchive)

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
        if (activeAndDraftStrategies.length > 0)
            setselectedStrategyId(activeAndDraftStrategies[0]?.id)
    }, [activeAndDraftStrategies])

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
        else if (currentSpeedGoal.content === null) {
            setContentEditors([]);
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
        else if (currentSpeedGoal.situation === null) {
            setSituationEditors([]);
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
        else if (currentSpeedGoal.rootCause === null) {
            setRootCauseEditors([]);
        }

    }, [currentSpeedGoal]);

    const saveUpdateSpeedGoal = async () => {
        if (selectedStrategyId.length > 0) {
            await updateSpeedGoal({
                userId,
                objectiveId: currentSpeedGoal.id,
                _id: userId,
                situation: htmlSituation.length > 0 ? htmlSituation : undefined,
                content: htmlContent.length > 0 ? htmlContent : undefined,
                rootCause: htmlRootCause.length > 0 ? htmlRootCause : undefined,
                strategyId: selectedStrategyId,
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
        }
        else console.log('Не выбрана красткосрочная цель')
    };

    const addEditor = () => {
        switch (activeIndex) {
            case '0':
                console.log('<B<B')
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
        if (isArchive) return
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

    const onDragEnd = (result, type) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        switch (type) {
            case "content":
                const contentState = contentEditors.map((state) => {
                    return EditorState.createWithContent(state.getCurrentContent());
                });
                const [contentItem] = contentState.splice(source.index, 1);
                contentState.splice(destination.index, 0, contentItem);
                setContentEditors(contentState);
                break;
            case "situation":
                const situationState = situationEditors.map((state) => {
                    return EditorState.createWithContent(state.getCurrentContent());
                });
                const [situationItem] = situationState.splice(source.index, 1);
                situationState.splice(destination.index, 0, situationItem);
                setSituationEditors(situationState);
                break;
            case "rootCause":
                const rootCauseState = rootCauseEditors.map((state) => {
                    return EditorState.createWithContent(state.getCurrentContent());
                });
                const [rootCauseItem] = rootCauseState.splice(source.index, 1);
                rootCauseState.splice(destination.index, 0, rootCauseItem);
                setRootCauseEditors(rootCauseState);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Краткосрочная цель'} />
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'strategy'} onChange={(e) => setselectedStrategyId(e.target.value)}>
                            {/* <option value={''}>-</option> */}
                            {activeAndDraftStrategies?.map((item, index) => (
                                <>
                                    <option key={index} value={item?.id} style={{ color: item?.state === 'Активный' ? '#005475' : 'none' }}>Стратегия №{item?.strategyNumber}</option>
                                </>
                            ))}
                            {archiveStrategies?.map((item, index) => (
                                <>
                                    <option key={index} value={item?.id} style={{ color: 'grey' }}>Стратегия №{item?.strategyNumber}</option>
                                </>
                            ))}
                        </select>
                    </div>

                    <div className={classes.second}>
                        <select name={'type'} value={activeIndex} onChange={(e) => setActiveIndex(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value={0}> Краткосрочная цель</option>
                            <option value={1}> Ситуация</option>
                            <option value={2}> Причина</option>
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
                        <HandlerQeury Error={isErrorGetSpeedGoalId} />
                    ) : isFetchingGetSpeedGoalId || isLoadingGetSpeedGoalId ? (
                        <HandlerQeury
                            Loading={isLoadingGetSpeedGoalId}
                            Fetching={isFetchingGetSpeedGoalId}
                        />
                    ) : (
                        <>
                            {selectedStrategyId.length > 0 && (
                                <>
                                    {activeIndex == 0 && (
                                        <DragDropContext
                                            onDragEnd={(result) => onDragEnd(result, "content")}
                                        >
                                            <Droppable droppableId="editorList">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={classes.droppableContainer}
                                                    >
                                                        {contentEditors.map((item, index) => (
                                                            <Draggable
                                                                key={index}
                                                                draggableId={`content-item-${index}`}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={classes.editorContainer}
                                                                    >
                                                                        <MyEditor
                                                                            key={index}
                                                                            editorState={item}
                                                                            setEditorState={(newState) =>
                                                                                handleEditorChange(
                                                                                    index,
                                                                                    newState,
                                                                                    "content"
                                                                                )
                                                                            }
                                                                        />
                                                                        {/* {!isArchive && (
                                                                            <img
                                                                                src={deleteImage}
                                                                                alt="deleteImage"
                                                                                className={classes.deleteIcon}
                                                                                onClick={() =>
                                                                                    deleteEditor(index, "content")
                                                                                }
                                                                            />
                                                                        )} */}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    )}
                                    {activeIndex == 1 && (
                                        <DragDropContext
                                            onDragEnd={(result) => onDragEnd(result, "situation")}
                                        >
                                            <Droppable droppableId="editorList">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={classes.droppableContainer}
                                                    >
                                                        {situationEditors.map((item, index) => (
                                                            <Draggable
                                                                key={index}
                                                                draggableId={`situation-item-${index}`}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={classes.editorContainer}
                                                                    >
                                                                        <MyEditor
                                                                            key={index}
                                                                            editorState={item}
                                                                            setEditorState={(newState) =>
                                                                                handleEditorChange(
                                                                                    index,
                                                                                    newState,
                                                                                    "situation"
                                                                                )
                                                                            }
                                                                        />
                                                                        {/* {!isArchive && (

                                                                            <img
                                                                                src={deleteImage}
                                                                                alt="deleteImage"
                                                                                className={classes.deleteIcon}
                                                                                onClick={() =>
                                                                                    deleteEditor(index, "situation")
                                                                                } // Передаём тип content
                                                                            />
                                                                        )} */}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    )}
                                    {activeIndex == 2 && (
                                        <DragDropContext
                                            onDragEnd={(result) => onDragEnd(result, "rootCause")}
                                        >
                                            <Droppable droppableId="editorList">
                                                {(provided) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        className={classes.droppableContainer}
                                                    >
                                                        {rootCauseEditors.map((item, index) => (
                                                            <Draggable
                                                                key={index}
                                                                draggableId={`rootCause-item-${index}`}
                                                                index={index}
                                                            >
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={classes.editorContainer}
                                                                    >
                                                                        <MyEditor
                                                                            key={index}
                                                                            editorState={item}
                                                                            setEditorState={(newState) =>
                                                                                handleEditorChange(
                                                                                    index,
                                                                                    newState,
                                                                                    "rootCause"
                                                                                )
                                                                            }
                                                                        />
                                                                        {/* {!isArchive && (

                                                                            <img
                                                                                src={deleteImage}
                                                                                alt="deleteImage"
                                                                                className={classes.deleteIcon}
                                                                                onClick={() =>
                                                                                    deleteEditor(index, "rootCause")
                                                                                } // Передаём тип content
                                                                            />
                                                                        )} */}
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    )}

                                    <HandlerMutation
                                        Loading={isLoadingUpdateSpeedGoalMutation}
                                        Error={isErrorUpdateSpeedGoalMutation && !manualErrorReset}
                                        Success={isSuccessUpdateSpeedGoalMutation && !manualSuccessReset}
                                        textSuccess={"Краткосрочная цель обновлена"}
                                    />
                                    {/* {Object.keys(currentSpeedGoal).length > 0 && (
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
                                                <defs />
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
                                    )} */}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <footer className={classes.inputContainer}>
                <div className={classes.inputColumn}>
                    <div className={classes.inputRow2}>
                        <button
                            disabled={isArchive}
                            onClick={() => saveUpdateSpeedGoal()}
                            style={{'backgroundColor' : 'grey'}}
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Objective;