import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import classes from './MainStartegy.module.css'
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add2-b.svg'
import share from '../Custom/icon/icon _ share.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import { useGetStrategyQuery, useGetStrategyIdQuery, useUpdateStrategyMutation, useGetStrategyNewQuery, usePostStrategyMutation } from "../../BLL/strategyApi";
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
import addIcon from '../Custom/icon/icon _ add _ blue.svg'
import AlertDraftIsExists from '../Custom/AlertDraftIsExists/AlertDraftIsExists';

const MainStrategy = () => {

    const { userId } = useParams()
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState('');
    const [valueDate, setValueDate] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [newDraftId, setNewDraftId] = useState(null)

    const [isState, setIsState] = useState('');
    const [strategyToOrganizations, setStrategyToOrganizations] = useState([]);
    const [extractedOrganizations, setExtractedOrganizations] = useState([]);
    const [modalOpen, setModalOpen] = useState(false)


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
        activeAndDraftStrategies = [],
        archiveStrategies = [],
        isLoadingStrateg,
        isErrorStrateg,
    } = useGetStrategyQuery(
        { userId, organizationId: selectedOrg },
        {
            selectFromResult: ({ data, isLoading, isError }) => ({
                archiveStrategies: data?.archiveStrategies || [],
                activeAndDraftStrategies: data?.activeAndDraftStrategies || [],
                isLoadingStrateg: isLoading,
                isErrorStrateg: isError,
            }),
            skip: !selectedOrg,
        }
    );

    const [
        postStrategy,
        {
            isLoading: isLoadingPostStrategyMutation,
            isSuccess: isSuccessPostStrategyMutation,
            isError: isErrorPostStrategyMutation,
            error: errorPostStrategyMutation,
        },
    ] = usePostStrategyMutation();

    const saveNewStrategy = async () => {
        await postStrategy({
            userId,
            content: ' ',
            organizationId: selectedOrg,
        })
            .unwrap()
            .then((result) => {
                setNewDraftId(result?.id)

            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    }

    useEffect(() => {
        if (newDraftId !== null) {
            navigate(newDraftId)
        }
    }, [newDraftId])

    const createNew = () => {
        const draftExists = activeAndDraftStrategies.some(strategy => strategy.state === 'Черновик')
        if (draftExists) {
            console.warn('Черновик уже существует')
            setModalOpen(true)
        }
        else saveNewStrategy()
    }


    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Стратегии'}></Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> {selectedOrg ? 'Выберите Стратегию:' : 'Выберите Организацию:'} </div>
                            <div className={classes.right}>
                                <ul className={classes.selectList}>
                                    {organizations?.map((item) => (
                                        <li key={item.id} onClick={(e) => setSelectedOrg(item.id)}>
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
                                        <div className={classes.titleStrategy}>Стратегии:</div>
                                        <ul className={classes.selectList}>
                                            {activeAndDraftStrategies?.map((item, index) => (
                                                <li key={index}
                                                    style={{ color: item?.state === 'Активный' ? '#005475' : 'none' }}
                                                    onClick={() => navigate(item.id)}
                                                >
                                                    Стратегия №{item?.strategyNumber}
                                                </li>
                                            ))}
                                            <div className={classes.addDraft} onClick={() => createNew()}>
                                                <span>
                                                    Создать
                                                </span>
                                                <img src={addIcon} />
                                            </div>
                                            {archiveStrategies?.map((item, index) => (
                                                <li key={index} style={{ color: 'grey' }} onClick={() => navigate(item.id)}>
                                                    Стратегия №{item?.strategyNumber}
                                                </li>
                                            ))}

                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </>


                </div>
            </div>

            {modalOpen && (
                <AlertDraftIsExists setModalOpen={setModalOpen}></AlertDraftIsExists>
            )}

        </>
    );
};

export default MainStrategy;