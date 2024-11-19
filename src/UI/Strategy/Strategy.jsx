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
import { useSelector } from "react-redux";
import ModalWindow from '../Custom/ConfirmStrategyToComplited/ModalWindow';

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

    const [openModal, setOpenModal] = useState(false)
    const [activeStrategDB, setActiveStrategDB] = useState();

    // Доступ к локальному Redux стейту
    const selectedOrganizationId = useSelector(
        (state) => state.strateg.selectedOrganizationId
    );
    const selectedStrategyId = useSelector(
        (state) => state.strateg.selectedStrategyId
    );

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

    // const {
    //     allStrategies = [],
    // } = useGetStrategyQuery({ userId, organizationId: selectedOrg }, {
    //     selectFromResult: ({ data }) => ({
    //         allStrategies: data,
    //     }),
    // });
    const {
        allStrategies = [],
        isLoadingStrateg,
        isErrorStrateg,
      } = useGetStrategyQuery(
        { userId, organizationId: selectedOrg },
        {
          selectFromResult: ({ data, isLoading, isError }) => ({
            allStrategies: data || {},
            isLoadingStrateg: isLoading,
            isErrorStrateg: isError,
          }),
        //   skip: !selectedOrg,
        }
      );
    console.log(allStrategies)
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
    console.log('selectedId   ', selectedId)

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
        console.log(selectedId, currentStrategy.state, currentStrategy.strategyToOrganizations)
        await updateStrategy({
            // userId,
            strategyId: selectedId,
            userId: userId,
            _id: selectedId,
            state: isState,
            content: htmlContent,
            // strategyToOrganizations: strategyToOrganizations,

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

    useEffect(() => {
        if (selectedOrg !== "") {
        //   setDisabledNumber(false);
          const activeStrateg = allStrategies?.strategies?.find(
            (item) => item.state === "Активный"
          );
          setActiveStrategDB(activeStrateg?.id);
        }
      }, [selectedOrg]);
    
      useEffect(() => {
        const activeStrateg = allStrategies?.strategies?.find(
          (item) => item.state === "Активный"
        );
        setActiveStrategDB(activeStrateg?.id);
      }, [isLoadingStrateg]);

    // useEffect(() => {
    //     if (selectedOrganizationId && selectedStrategyId) {
    //         setSelectedOrg(selectedOrganizationId);
    //         setSelectedStrategy(selectedStrategyId);
    //     }
    // }, []);
    const save = () => {
        console.log("save");
        // console.log(state);
        console.log(currentStrategy.state);
        console.log(activeStrategDB);
        console.log(isState)
        if (
          isState === "Активный" &&
          currentStrategy.state === "Черновик" &&
          activeStrategDB
        ) {
          setOpenModal(true);
        } else {
          saveUpdateStrategy();
        }
      };

    const btnYes = async () => {
        await updateStrategy({
            userId,
            strategyId: activeStrategDB,
            _id: activeStrategDB,
            state: "Завершено",
        })
            .unwrap()
            .then(() => {
                saveUpdateStrategy();
            })
            .catch((error) => {
                // При ошибке также сбрасываем флаги
                // setManualErrorReset(false);
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    const btnNo = async () => {
        const Data = [];
        if (htmlContent !== currentStrategy.content) {
            Data.content = htmlContent;
        }
        if (Data.content) {
            await updateStrategy({
                userId,
                strategyId: selectedId,
                _id: selectedId,
                ...Data,
            })
                .unwrap()
                .then(() => { })
                .catch((error) => {
                    // При ошибке также сбрасываем флаги
                    //   setManualErrorReset(false);
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        }
    };

    const openSearchModal = () => {
        setIsState('');
        setSelectedStrategy('')
    }
    const openOrgModal = () => {
        setModalOrgOpen(true);
    }
    console.log(selectedOrg)
    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={true} title={'Стратегии'}></Header>
                </>

                {/* {isState && ( */}
                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <select name={'mySelect'} disabled={!isState || isState === 'Завершено'} value={isState} onChange={(e) => setIsState(e.target.value)}>
                            {isState == 'Черновик' && (<option value={'Черновик'}>Черновик</option>)}
                            <option value={'Активный'}>Активный</option>
                            {isState == 'Активный' && (<option value={'Завершено'}>Завершено</option>)}
                        </select>
                        <img src={search} onClick={openSearchModal} />
                        {/*</div>*/}
                        {/*<div className={classes.second}>*/}
                        <input type="date" name="calendar" disabled={!isState} value={valueDate}
                            onChange={(e) => setValueDate(e.target.value)} />
                    </div>
                </div>
                {/* )} */}

                <div className={classes.body}>

                    {isState ? (
                        <div className={classes.editorContainer}>
                            <MyEditor editorState={editorState} setEditorState={setEditorState} />
                        </div>
                    ) : (
                        <>
                            <div className={classes.bodyContainer}>
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
                                                {allStrategies?.strategies?.map((item, index) => (
                                                    <li key={index} onChange={(e) => setSelectedStrategy(item?.id)}>
                                                        {(selectedStrategy == item?.strategy?.id) ?
                                                            (<>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedStrategy.includes(item?.id)}
                                                                    readOnly

                                                                />
                                                                <div> Стратегия №{item?.strategyNumber} </div>
                                                            </>) : (
                                                                <>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedStrategy.includes(item?.id)}
                                                                        readOnly
                                                                    />
                                                                    <div style={{ 'color': 'grey' }}> Стратегия №{item.strategyNumber} </div>
                                                                </>
                                                            )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </div>


                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div></div>
                        <div>
                            <button onClick={() => save()}> ОТРЕДАКТИРОВАТЬ</button>
                        </div>
                        <div>
                            {/* <img src={searchBlack} /> */}
                            {/*<img src={policy} className={classes.image}/>*/}
                            {/*<img src={stats}/>*/}
                        </div>
                    </div>
                </footer>
            </div>

            {openModal && (
                <ModalWindow
                    text={
                        "У Вас уже есть Активная стратегия, при нажатии на Да, Она будет завершена."
                    }
                    close={setOpenModal}
                    btnYes={btnYes}
                    btnNo={btnNo}
                ></ModalWindow>
            )}

            <HandlerMutation
                Loading={isLoadingUpdateStrategyMutation}
                Error={isErrorUpdateStrategyMutation}
                Success={isSuccessUpdateStrategyMutation}
                textSuccess={"Cтратегия успешно обновлена."}
                // textError={ErrorStrategyMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>

            {isModalSearchOpen &&
                <SearchModal setModalOpen={setModalSearchOpen} firstArray={allStrategies} firstTitle={'Стратегии'}
                    setSelectedId={setSelectedId} componentName={'strategyNumber'}></SearchModal>}
            {isModalOrgOpen && <CustomSelect setModalOpen={setModalOrgOpen} requestFunc={saveUpdateStrategy}
                organizations={organizations} isToOrganizations={strategyToOrganizations}
                setToOrganizations={setStrategyToOrganizations}></CustomSelect>}
        </>
    );
};

export default Strategy;