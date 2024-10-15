import React, {useEffect, useState} from 'react';
import classes from "./CreateGoal.module.css";
import Header from "../Custom/Header/Header";
import {useNavigate, useParams} from "react-router-dom";
import {useGetGoalNewQuery, usePostGoalMutation} from "../../BLL/goalApi";
import draftToHtml from "draftjs-to-html";
import {convertToRaw, EditorState} from "draft-js";

function CreateGoal(props) {

    const {userId} = useParams()
    const navigate = useNavigate()
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
    }, []);


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

    const reset = () => {
        setTimeout(() => {
            navigate(-1);
        }, 50);
    }
    const saveGoal = async () => {
        await postGoal({
            userId,
            content: htmlContent,
            organizationId: selectedOrg,
        })
            .unwrap()
            .then(() => {
                reset();
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    };

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={' Новая цель'}></Header>
                </>

                <div className={classes.body}>
                    <div className={classes.left}> Выберите Организацию:</div>
                    <ul className={classes.selectList}>
                        {organizations?.map((item) => (
                            <li key={item.id} onChange={(e) => setSelectedOrg(item.id)}>
                                {(selectedOrg == item.id) ?
                                    (<>
                                        <input
                                            type="checkbox"
                                            checked={selectedOrg.includes(item.id)}
                                            readOnly

                                        />
                                        <div> {item.organizationName} </div>
                                    </>) : (
                                        <>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrg.includes(item.id)}
                                                readOnly
                                            />
                                            <div style={{'color': 'grey'}}> {item.organizationName} </div>
                                        </>
                                    )}
                            </li>
                        ))}
                    </ul>
                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputColumn}>
                        <div className={classes.inputRow2}>
                            <button onClick={() => saveGoal()}> СОЗДАТЬ</button>
                        </div>
                    </div>
                </footer>
            </div>

        </>
    );
}

export default CreateGoal;