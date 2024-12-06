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
import MyEditor from "../Custom/Editor/MyEditor";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import Header from "../Custom/Header/Header";
import HandlerMutation from "../Custom/HandlerMutation";
import { useSelector } from "react-redux";
import ModalWindow from '../Custom/ConfirmStrategyToComplited/ModalWindow';

const Strategy = () => {

    const { userId, strategyId } = useParams()
    useEffect(() => {
        setSelectedStrategy(strategyId)
    }, [strategyId])
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('');
    const [valueDate, setValueDate] = useState('');
    const [isModalSearchOpen, setModalSearchOpen] = useState(false);
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

    const {
        allStrategies = [],
        isLoadingStrateg,
        isErrorStrateg,
      } = useGetStrategyQuery(
        { userId, organizationId: selectedOrg },
        {
          selectFromResult: ({ data, isLoading, isError }) => ({
            allStrategies: data?.activeAndDraftStrategies || [],
            isLoadingStrateg: isLoading,
            isErrorStrateg: isError,
          }),
          skip: !selectedOrg,
        }
      );

      const {
        currentStrategy = [],
        // organizations = [],
    } = useGetStrategyIdQuery(
        { userId, strategyId: strategyId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentStrategy: data?.currentStrategy || [],
                organizations: data?.organizations || [],
            }),
            skip: !strategyId,
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

  

    useEffect(() => {
        setSelectedId(selectedStrategy)
    }, [selectedStrategy])


    useEffect(() => {
        const rawContent = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        setHtmlContent(rawContent);
    }, [editorState]);

    useEffect(() => {
        setSelectedOrg(currentStrategy?.organization?.id)
    }, [currentStrategy])

    console.log(selectedOrg)
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
        if (selectedOrg !== "" ) {
          const activeStrateg = allStrategies?.find(
            (item) => item.state === "Активный"
          );
          setActiveStrategDB(activeStrateg?.id);
        }
      }, [selectedOrg]);

      console.log(activeStrategDB)

      const saveUpdateStrategy = async () => {
        console.log(strategyId, currentStrategy.state)
        if (currentStrategy.state)
        await updateStrategy({
            // userId,
            strategyId: strategyId,
            userId: userId,
            _id: strategyId,
            state: currentStrategy.state !== isState ? isState : undefined,
            content: htmlContent,
        })
            .unwrap()
            .then(() => {
                // setTimeout(() => navigate(-1), 800);
            })            
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };


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
                setOpenModal(false)
            })
            .catch((error) => {
                // При ошибке также сбрасываем флаги
                // setManualErrorReset(false);
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    const btnNo = async () => {
        console.log('оооо')
        const Data = [];
        if (htmlContent !== currentStrategy.content) {
            Data.content = htmlContent;
        }
        if (Data.content) {
            await updateStrategy({
                userId,
                strategyId: strategyId,
                _id: strategyId,
                ...Data,
            })
                .unwrap()
                .then(() => {
                    // saveUpdateStrategy();
                    setOpenModal(false)
                    // setTimeout(() => navigate(-1), 800);
                })  
                .catch((error) => {
                    // При ошибке также сбрасываем флаги
                    //   setManualErrorReset(false);
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        }
        else {
            setOpenModal(false)
        }
    };



    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Редактировать стратегию'}></Header>
                </>

                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <span>
                            Cтратегия №{currentStrategy.strategyNumber}
                        </span>
                        <select name={'mySelect'} disabled={currentStrategy.state === 'Завершено'} value={isState} onChange={(e) => setIsState(e.target.value)}>
                            {currentStrategy.state == 'Черновик' && (<option value={'Черновик'}>Черновик</option>)}
                            <option value={'Активный'}>Активный</option>
                            {currentStrategy.state == 'Активный' && (<option value={'Завершено'}>Завершено</option>)}
                        </select>
                        {valueDate && (<input type="date" name="calendar"  value={valueDate}
                            onChange={(e) => setValueDate(e.target.value)} />)}

                    </div>
                </div>

                <div className={classes.body}>
                        <div className={classes.editorContainer}>
                            <MyEditor editorState={editorState} setEditorState={setEditorState} />
                        </div>
                </div>


                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div>
                            <button onClick={() => save()}> CОХРАНИТЬ</button>
                        </div>
                    </div>
                </footer>
            </div>

            {openModal && (
                <ModalWindow
                    text={
                        "У Вас уже есть Активная стратегия, при нажатии кнопки Да, Она будет завершена."
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

        </>
    );
};

export default Strategy;