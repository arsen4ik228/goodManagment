import React, {useState, useEffect} from 'react';
import Header from "../Custom/Header/Header";
import classes from "./NewObjective.module.css"
import {usePostSpeedGoalMutation, useGetSpeedGoalNewQuery} from "../../BLL/speedGoalApi";
import {useNavigate, useParams} from "react-router-dom";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { convertToRaw } from "draft-js";

function NewObjective(props) {

    const {userId} = useParams();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState([]);
    const [contentEditors, setContentEditors] = useState([
        EditorState.createEmpty(),
    ]);
    const [htmlContent, setHtmlContent] = useState([]);


    const {
        data = [],
        isLoadingNewSpeedGoal,
        isErrorNewSpeedGoal,
    } = useGetSpeedGoalNewQuery(userId, {
        selectFromResult: ({data, isLoading, isError}) => ({
            data: data || [],
            isLoadingNewSpeedGoal: isLoading,
            isErrorNewSpeedGoal: isError,
        }),
    });

    const [
        postSpeedGoal,
        {
            isLoading: isLoadingPostSpeedGoalMutation,
            isSuccess: isSuccessPostSpeedGoalMutation,
            isError: isErrorPostSpeedGoalMutation,
        },
    ] = usePostSpeedGoalMutation();

    useEffect(() => {
        contentEditors.forEach((editorState, index) => {
            const rawContent = draftToHtml(
                convertToRaw(editorState.getCurrentContent())
            );
            setHtmlContent((prev) => {
                const updated = [...prev];
                updated[index] = rawContent;
                return updated;
            });
        });
    }, []);
    console.log(htmlContent)
    const saveSpeedGoal = async () => {
        await postSpeedGoal({
            userId,
            situation: htmlContent,
            content: htmlContent,
            rootCause: htmlContent,
            strategyId: selectedId,
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
        navigate(-1)
        console.warn('reset')
    }
    console.log(data)
    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={' Новая краткосрочная цель'}></Header>
                </>
                <div className={classes.body}>
                    <div className={classes.left}> Выберите Стратегию:</div>
                    <ul className={classes.selectList}>
                        {data?.map((item) => (
                            <li key={item.id} onChange={(e) => setSelectedId(item.id)}>
                                {(selectedId == item.id) ?
                                    (<>
                                        <input
                                            type="checkbox"
                                            checked={selectedId.includes(item.id)}
                                            readOnly

                                        />
                                        <div> Стратегия №{item.strategyNumber} </div>
                                    </>
                                    ) : (
                                        <>
                                            <input
                                                type="checkbox"
                                                checked={selectedId.includes(item.id)}
                                                readOnly
                                            />
                                            <div style={{'color':'grey'}}> Стратегия №{item.strategyNumber} </div>
                                        </>
                                    )}
                            </li>
                        ))}
                    </ul>
                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputColumn}>
                        <div className={classes.inputRow2}>
                            <button onClick={() => saveSpeedGoal()}> СОЗДАТЬ</button>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default NewObjective;