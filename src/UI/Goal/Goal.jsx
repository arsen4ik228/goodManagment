import React, { useEffect, useState } from 'react';
import classes from "./Goal.module.css"
import Header from "../Custom/Header/Header";
import { useGetGoalIdQuery, useGetGoalQuery, usePostGoalMutation, useUpdateGoalMutation } from "../../BLL/goalApi";
import { useParams } from "react-router-dom";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import deleteImage from "../Custom/icon/delete.svg"
import search from "../Custom/icon/icon _ search.svg"
import SearchModal from "../Custom/SearchModal/SearchModal";
import HandlerQeury from "../Custom/HandlerQeury";
import MyEditor from "../Custom/Editor/MyEditor";
import HandlerMutation from "../Custom/HandlerMutation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function NewGoal(props) {

    const [editorState, setEditorState] = useState([]);
    const [htmlContent, setHtmlContent] = useState([]);
    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);

    const {
        currentGoal = {},
        isErrorGetGoal,
        isLoadingGetGoal,
        isFetchingGetGoal,
    } = useGetGoalQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            currentGoal: data?.currentGoal || {},
            isErrorGetGoal: isError,
            isLoadingGetGoal: isLoading,
            isFetchingGetGoal: isFetching,
        }),
    });
    console.log(currentGoal)
    const [
        updateGoal,
        {
            isLoading: isLoadingUpdateGoalMutation,
            isSuccess: isSuccessUpdateGoalMutation,
            isError: isErrorUpdateGoalMutation,
            error: Error,
        },
    ] = useUpdateGoalMutation();

    const [
        postGoal,
        {
            isLoading: isLoadingPostPoliciesMutation,
            isSuccess: isSuccessPostPoliciesMutation,
            isError: isErrorPostPoliciesMutation,
        },
    ] = usePostGoalMutation();


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
        if (Object.keys(currentGoal).length > 0) {
            setEditorState((prevEditors) => [
                ...prevEditors,
                EditorState.createEmpty(),
            ]);
        }
        else saveGoal()
    };

    const deleteEditor = (index) => {
        setEditorState((prevEditors) => {
            const updated = [...prevEditors];
            updated.splice(index, 1); // Remove the editor at the specified index
            return updated;
        });
    };

    // const establishCreatedGoalId = () => {
    //     console.warn('establish...worked')
    //     const currentOrganization = organizationsWithGoal.find(item => item.id === organizationIdForRequestingCreateGoal)
    //     console.log(currentOrganization)
    //     setOrganizationIdForRequestingCreateGoal(null)
    //     selectGoal(currentOrganization?.goal?.id)
    // }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        // Создаем новый массив состояний
        const updatedState = editorState.map((state) => {
            // Создаем новый экземпляр редактора для каждого состояния
            return EditorState.createWithContent(state.getCurrentContent());
        });

        // Перемещаем редактор
        const [movedItem] = updatedState.splice(source.index, 1);
        updatedState.splice(destination.index, 0, movedItem);

        setEditorState(updatedState);
    };

    const saveGoal = async () => {
        await postGoal({
            organizationId: localStorage.getItem('selectedOrganizationId'),
            content: [''],
        })
            .unwrap()
            .then(() => {
                // establishCreatedGoalId()
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    };

    const saveUpdateGoal = async () => {
        await updateGoal({
            _id: currentGoal.id,
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
                    <Header title={'Цели'} create={false}></Header>
                </>

                <div className={classes.body}>
                    {isErrorGetGoal ? (
                        <>
                            <HandlerQeury Error={isErrorGetGoal}></HandlerQeury>
                        </>
                    ) : (
                        <>
                            <DragDropContext onDragEnd={onDragEnd}>

                                <Droppable droppableId="editorList">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={classes.droppableContainer}
                                        >
                                            {editorState.map((item, index) => (
                                                <Draggable
                                                    key={index}
                                                    draggableId={`item-${index}`}
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
                                                                setEditorState={(newState) => {
                                                                    const updatedState = [
                                                                        ...editorState
                                                                    ];
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
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
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
                                    <span className={classes.nameButton}>
                                        Добавить еще одну часть цели
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
                                    Error?.data?.errors?.[0]?.errors?.[0]
                                        ? Error.data.errors[0].errors[0]
                                        : Error?.data?.message
                                }
                            ></HandlerMutation>
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