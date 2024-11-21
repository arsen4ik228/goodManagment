import React, {useEffect, useState} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import classes from './NewStrategy.module.css';
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add2-b.svg'
import share from '../Custom/icon/icon _ share.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import {useGetStrategyNewQuery, usePostStrategyMutation} from "../../BLL/strategyApi";
import {useNavigate, useParams} from "react-router-dom";
import CustomSelect from "../Custom/CustomSelect/CustomSelect";
import search from "../Custom/icon/icon _ search.svg";
import SearchModal from "../Custom/SearchModal/SearchModal";
import MyEditor from "../Custom/Editor/MyEditor";
import Header from "../Custom/Header/Header";
import {EditorState, convertFromHTML, ContentState} from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import {convertToRaw} from "draft-js";
import HandlerMutation from "../Custom/HandlerMutation";

const Strategy = () => {

    const {userId,organizationId} = useParams()
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('');
    const [valueDate, setValueDate] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [htmlContent, setHtmlContent] = useState();
    const [strategyToOrganizations, setStrategyToOrganizations] = useState([]);
    const [isState, setIsState] = useState('');


    const {
        organizations = [],
        isLoadingNewStrategy,
        isErrorNewStrategy,
    } = useGetStrategyNewQuery(userId, {
        selectFromResult: ({data, isLoading, isError}) => ({
            organizations: data, // Если нет данных или organizations, вернем пустой массив
            isLoadingNewPolicies: isLoading,
            isErrorNewPolicies: isError,
        }),
    });

    const [
        postStrategy,
        {
            isLoading: isLoadingPostStrategyMutation,
            isSuccess: isSuccessPostStrategyMutation,
            isError: isErrorPostStrategyMutation,
            error: errorPostStrategyMutation,
        },
    ] = usePostStrategyMutation();

    useEffect(() => {
        const rawContent = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        setHtmlContent(rawContent);
        console.log(rawContent);
    }, [editorState]);

    const reset = () => {
        setEditorState(EditorState.createEmpty())
        setStrategyToOrganizations([])

        setTimeout(() => {
            navigate(-1);
        }, 1800);
    }

    const click = () => {
        setModalOpen(true)
    }

    const saveNewStrategy = async () => {
        console.log(organizationId)
        await postStrategy({
            userId,
            content: htmlContent,
            organizationId,
        })
            .unwrap()
            .then(() => {
                reset();
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    useEffect(() => {
        setIsState('Черновик')
    }, []);


    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Создание новой стратегии'}></Header>
                </>
                {/*<div className={classes.headContainer}>*/}
                {/*    <div className={classes.headRow}>*/}
                {/*        <div className={classes.blueLine}></div>*/}
                {/*        <div className={classes.whiteLine}>*/}
                {/*            <div className={classes.headElem}>*/}
                {/*                <div className={classes.icon}>*/}
                {/*                    <img src={backRow} alt="icon"/>*/}
                {/*                </div>*/}
                {/*                <div className={classes.txt}>*/}
                {/*                    <div className={classes.headText}>Личный помощник</div>*/}
                {/*                    <div className={classes.sectionName}>Стратегия</div>*/}
                {/*                </div>*/}

                {/*            </div>*/}
                {/*            /!*<div className={classes.menu}>*!/*/}
                {/*            /!*    <img src={menu} alt="icon" onClick={() => addNew()}/>*!/*/}
                {/*            /!*</div>*!/*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'mySelect'} value={isState} onChange={(e) => setIsState(e.target.value)}>
                            <option value={'Черновик'}>Черновик</option>
                            <option value={'Активный'}>Активный</option>
                        </select>
                    </div>

                </div> */}

                <div className={classes.body}>
                    <>
                        <MyEditor editorState={editorState} setEditorState={setEditorState}/>
                    </>

                </div>

                <footer className={classes.inputContainer}>
                        <div className={classes.inputRow2}>
                            <button onClick={() => saveNewStrategy()}> СОЗДАТЬ</button>
                        </div>
                </footer>

            </div>


            <HandlerMutation
                Loading={isLoadingNewStrategy}
                Error={isErrorNewStrategy}
                Success={isSuccessPostStrategyMutation}
                textSuccess={"Cтратегия успешно создана."}
                textError={errorPostStrategyMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>

            {isModalOpen &&

                <CustomSelect
                    organizations={organizations}
                    isToOrganizations={strategyToOrganizations}
                    setToOrganizations={setStrategyToOrganizations}
                    setModalOpen={setModalOpen}
                    requestFunc={saveNewStrategy}
                ></CustomSelect>
            }


        </>
    )
        ;
};

export default Strategy;