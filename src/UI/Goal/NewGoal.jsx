import React, {useEffect, useState} from 'react';
import classes from "./NewGoal.module.css"
import Header from "../Custom/Header/Header";
import {usePostGoalMutation, useGetGoalNewQuery} from "../../BLL/goalApi"
import CustomSelect from "../Custom/CustomSelect/CustomSelect";
import {useParams} from "react-router-dom";
import MyEditor from "../Custom/Editor/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";
import deleteImage from "../Custom/icon/delete.svg";
import add from "../Custom/icon/icon _ add _ blue.svg";

function NewGoal(props) {

    const {userId} = useParams()
    const [inputName, setInputName] = useState('')
    const [selectedOrg, setSelectedOrg] = useState('')
    const [isModalOpen, setModalOpen] = useState(false);
    const [contentEditors, setContentEditors] = useState([]);
    const [htmlContent, setHtmlContent] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);



    const {
        organizations = [],
        isLoadingNewPolicies,
        isErrorNewPolicies,
    } = useGetGoalNewQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            organizations: data?.organizations || [], // Если нет данных или organizations, вернем пустой массив
            isLoadingNewPolicies: isLoading,
            isErrorNewPolicies: isError,
        }),
    });
    console.log(organizations);
    const [
        postGoal,
        {
            isLoading: isLoadingPostPoliciesMutation,
            isSuccess: isSuccessPostPoliciesMutation,
            isError: isErrorPostPoliciesMutation,
        },
    ] = usePostGoalMutation();

    useEffect(() => {
        setHtmlContent(
            contentEditors.map((editor) =>
                draftToHtml(convertToRaw(editor.getCurrentContent()))
            )
        );
    }, [contentEditors]);

    // useEffect(() => {
    //     // Initialize editors for 'content' if it's an array
    //     if (Array.isArray(currentSpeedGoal.content)) {
    //         const contentStates = currentSpeedGoal.content.map((item) => {
    //             if (typeof item === "string" && item.trim()) {
    //                 const contentBlocks = convertFromHTML(item);
    //                 return EditorState.createWithContent(
    //                     ContentState.createFromBlockArray(contentBlocks)
    //                 );
    //             }
    //             return EditorState.createEmpty();
    //         });
    //         setContentEditors(contentStates);
    //     }
    // })

    const deleteEditor = (index) => {
        switch (activeIndex) {
            case 0:
                setContentEditors((prevEditors) => {
                    const updated = [...prevEditors];
                    updated.splice(index, 1); // Remove the editor at the specified index
                    return updated;
                });
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
            default:
                break;
        }
    };

    const addEditor = () => {
        switch (activeIndex) {
            case 0:
                setContentEditors((prevEditors) => [
                    ...prevEditors,
                    EditorState.createEmpty(),
                ]);
                break;
            default:
                break;
        }
    };

    const saveGoal = async () => {
        await postGoal({
            userId,
            content: htmlContent,
            goalToOrganizations: selectedOrg,
        })
            .unwrap()
            .then(() => {
                reset();
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    };

    const reset = () => {
        setInputName('')
        setSelectedOrg('')
    }

    const closeModal = () => {
        setModalOpen(false);
    }
    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Новая цель'} create={false}></Header>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <input value={inputName} type={'text'} onChange={(e) => setInputName(e.target.value)}/>
                        {/*<img src={search} onClick={openModal}/>*/}
                    </div>
                    <div className={classes.second} onClick={() => setModalOpen(true)}>
                        {!selectedOrg ? (
                            <div style={{'color': 'red'}}> Выберите организацию <span style={{color: "red"}}>*</span>
                            </div>
                        ) : (
                            <div style={{'color': 'green'}}> Организация выбрана </div>
                        )}
                    </div>
                </div>

                <div className={classes.body}>
                    {contentEditors.map((editorState, index) => (
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
                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputColumn}>
                        <div className={classes.inputRow2}>
                            <button onClick={() => saveGoal()}> СОЗДАТЬ</button>
                            <div>
                                <img src={add} onClick={addEditor} />
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            {isModalOpen &&
                <CustomSelect organizations={organizations} setModalOpen={setModalOpen} isToOrganizations={selectedOrg}
                              setToOrganizations={setSelectedOrg} requestFunc={closeModal}></CustomSelect>
            }
        </>
    );
}

export default NewGoal;