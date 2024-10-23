import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import classes from './Strategy.module.css';
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add2-b.svg'
import share from '../Custom/icon/icon _ share.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import { useGetStrategyQuery, useGetStrategyIdQuery, useUpdateStrategyMutation, useGetStrategyNewQuery } from "../../BLL/strategyApi";
import { useNavigate, useParams } from "react-router-dom";
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

    const { userId } = useParams()
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

    const [selectedOrg, setSelectedOrg] = useState('')
    const [selectedStrategy, setSelectedStrategy] = useState('')

    const {
        organizations = [],
        isLoadingNewStrategy,
        isErrorNewStrategy,
    } = useGetStrategyNewQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            organizations: data, // Если нет данных или organizations, вернем пустой массив
            isLoadingNewPolicies: isLoading,
            isErrorNewPolicies: isError,
        }),
    });

    const {
        allStrategies = [],
    } = useGetStrategyQuery({ userId, organizationId: selectedOrg }, {
        selectFromResult: ({ data }) => ({
            allStrategies: data?.strategyToOrganizations,
        }),
    });
    const {
        currentStrategy = [],
        // organizations = [],
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
        console.log( selectedId,currentStrategy.state, currentStrategy.strategyToOrganizations)
        await updateStrategy({
            // userId,
            strategyId: selectedId,
            userId: userId,
            _id: selectedId,
            state: isState,
            content: htmlContent,
            strategyToOrganizations: strategyToOrganizations,

        })
            .unwrap()
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };


    // useEffect(() => {
    //     const firstInstructionId = allStrategies.length > 0 ? allStrategies[0].id : null;
    //     setSelectedId(firstInstructionId);
    // }, [allStrategies]);
    useEffect(() => {
        setSelectedId(selectedStrategy)
    }, [selectedStrategy])
    console.log(allStrategies)
    console.log(selectedId, currentStrategy)

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
    }, [currentStrategy.state, currentStrategy.dataActive, extractedOrganizations]);



    const openSearchModal = () => {
        setIsState('');
        setSelectedStrategy('')
    }
    const openOrgModal = () => {
        setModalOrgOpen(true);
    }
    console.log(isState)
    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={true} title={'Стратегии'}></Header>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'mySelect'} value={isState} onChange={(e) => setIsState(e.target.value)}>
                            {isState=='Черновик' && (<option value={'Черновик'}>Черновик</option>)}
                            <option value={'Активный'}>Активный</option>
                            <option value={'Завершено'}>Завершено</option>
                        </select>
                        <img src={search} onClick={openSearchModal} />
                        {/*</div>*/}
                        {/*<div className={classes.second}>*/}
                        <input type="date" name="calendar" value={valueDate}
                            onChange={(e) => setValueDate(e.target.value)} />
                    </div>
                </div>

                <div className={classes.body}>
                    <div className={classes.bodyContainer}>
                    {isState ? (
                        <>
                            <MyEditor editorState={editorState} setEditorState={setEditorState} toolBar={true} />
                        </>
                    ) : (
                        <>
                            <div className={classes.left}> Выберите Стратегию:</div>
                            <div className={classes.right}>
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
                                                        <div style={{ 'color': 'grey' }}> {item.organizationName} </div>
                                                    </>
                                                )}
                                        </li>
                                    ))}
                                </ul>

                                {selectedOrg && (
                                    <>
                                        <div className="">Стратегии:</div>
                                        <ul className={classes.selectList}>
                                            {allStrategies?.map((item) => (
                                                <li key={item.id} onChange={(e) => setSelectedStrategy(item.strategy.id)}>
                                                    {(selectedStrategy == item.strategy.id) ?
                                                        (<>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedStrategy.includes(item.strategy.id)}
                                                                readOnly

                                                            />
                                                            <div> Стратегия №{item.strategy.strategyNumber} </div>
                                                        </>) : (
                                                            <>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedStrategy.includes(item.id)}
                                                                    readOnly
                                                                />
                                                                <div style={{ 'color': 'grey' }}> Стратегия №{item.strategy.strategyNumber} </div>
                                                            </>
                                                        )}
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                    </div>
                </div>


                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div></div>
                        <div>
                            <button onClick={() => openOrgModal()}> ОТРЕДАКТИРОВАТЬ</button>
                        </div>
                        <div>
                            <img src={searchBlack} />
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