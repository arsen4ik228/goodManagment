import React, {useEffect, useState} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import classes from './Strategy.module.css';
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add2-b.svg'
import share from '../Custom/icon/icon _ share.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import {useGetStrategyQuery, useGetStrategyIdQuery, useUpdateStrategyMutation} from "../../BLL/strategyApi";
import {useNavigate, useParams} from "react-router-dom";
import search from "../Custom/icon/icon _ search.svg";
import SearchModal from "../Custom/SearchModal/SearchModal";
import MyEditor from "../Custom/Editor/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import Header from "../Custom/Header/Header";
import CustomSelect from "../Custom/CustomSelect/CustomSelect";
import HandlerMutation from "../Custom/HandlerMutation";

const Strategy = () => {

    const {userId} = useParams()
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('');
    const [valueDate, setValueDate] = useState('');
    const [isModalSearchOpen, setModalSearchOpen] = useState(false);
    const [isModalOrgOpen, setModalOrgOpen] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [htmlContent, setHtmlContent] = useState();
    const [isState, setIsState] = useState('');
    const [strategyToOrganizations, setStrategyToOrganizations] = useState([]);
    const [extractedOrganizations, setExtractedOrganizations] = useState([]);


    const {
        allStrategies=[],
    } = useGetStrategyQuery(userId,{
        selectFromResult: ({data}) => ({
            allStrategies: data,
        }),
    });

    const {
        currentStrategy = [],
        organizations = [],
    } = useGetStrategyIdQuery(
        { userId, strategyId: selectedId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentStrategy: data?.currentStrategy || [],
                organizations: data?.organizations || [],
            }),
            skip: !selectedId,
        }
    );

    const [
        updateStrategy,
        {
            isLoading: isLoadingUpdateStrategyMutation,
            isSuccess: isSuccessUpdateStrategyMutation,
            isError: isErrorUpdateStrategyMutation,
            error: ErrorStrategyMutation,
        },
    ] = useUpdateStrategyMutation();
    
    const saveUpdateStrategy = async () => {
        console.log( userId,selectedId,userId,currentStrategy.strategyName,currentStrategy.state,currentStrategy.type,currentStrategy.strategyToOrganizations)
        await updateStrategy({
            // userId,
            strategyId: selectedId,
            userId: userId,
            _id: selectedId,
            state: currentStrategy.state,
            // type: currentStrategy.type,
            content: htmlContent,
            strategyToOrganizations: strategyToOrganizations,

        })
            .unwrap()
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };


    useEffect(() => {
        const firstInstructionId = allStrategies.length > 0 ? allStrategies[0].id : null;
        // console.log(allStrategies)
        setSelectedId(firstInstructionId);
    }, [allStrategies]);

    useEffect(() => {
        const rawContent = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        setHtmlContent(rawContent);
    }, [editorState]);

    useEffect(() => {
        if (currentStrategy.content) {
            const { contentBlocks, entityMap } = convertFromHTML(
                currentStrategy.content
            );
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
                entityMap
            );
            const oldEditorState = EditorState.createWithContent(contentState);
            setEditorState(oldEditorState);
        }
    }, [currentStrategy.content]);

    useEffect(() => {
        setExtractedOrganizations(currentStrategy.strategyToOrganizations?.map(item => item.organization))
    }, [currentStrategy.strategyToOrganizations]);

    useEffect(() => {
        setStrategyToOrganizations(extractedOrganizations?.map(item => item.id));
        setIsState(currentStrategy.state);
        setValueDate(currentStrategy.dataActive)
    },[currentStrategy.state,currentStrategy.dataActive,extractedOrganizations]);



    const openSearchModal = () => {
        setModalSearchOpen(true);
    }
    const openOrgModal = () => {
        setModalOrgOpen(true);
    }

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={true} title={'Стратегии'}></Header>
                </>
                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'mySelect'} value={isState} onChange={(e) => setIsState(e.target.value)}>
                            <option value={'Черновик'}>Черновик</option>
                            <option value={'Активный'}>Активный</option>
                        </select>
                        <img src={search} onClick={openSearchModal}/>
                        {/*</div>*/}
                        {/*<div className={classes.second}>*/}
                        <input type="date" name="calendar" value={valueDate}
                               onChange={(e) => setValueDate(e.target.value)}/>
                    </div>
                </div>

                <div className={classes.body}>
                    {isState ? (
                        <>
                            <MyEditor editorState={editorState} setEditorState={setEditorState}/>
                        </>
                    ) : null}
                </div>


                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div></div>
                        <div>
                            <button onClick={() => openOrgModal()}> ОТРЕДАКТИРОВАТЬ</button>
                        </div>
                        <div>
                            <img src={searchBlack}/>
                            {/*<img src={policy} className={classes.image}/>*/}
                            {/*<img src={stats}/>*/}
                        </div>
                    </div>
                </footer>
            </div>

            <HandlerMutation
                Loading={isLoadingUpdateStrategyMutation}
                Error={isErrorUpdateStrategyMutation}
                Success={isSuccessUpdateStrategyMutation}
                textSuccess={"Cтратегия успешно обновлена."}
                textError={ErrorStrategyMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>

            {isModalSearchOpen &&
                <SearchModal setModalOpen={setModalSearchOpen} firstArray={allStrategies} firstTitle={'Стратегии'}
                             setSelectedId={setSelectedId} componentName={'strategyNumber'}></SearchModal>}
            {isModalOrgOpen && <CustomSelect setModalOpen={setModalOrgOpen} requestFunc={saveUpdateStrategy}
                                             organizations={organizations} isToOrganizations={strategyToOrganizations}
                                             setToOrganizations={setStrategyToOrganizations}></CustomSelect>}
        </>
    )
        ;
};

export default Strategy;