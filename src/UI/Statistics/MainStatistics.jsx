import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import classes from './MainStatistics.module.css'
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add2-b.svg'
import share from '../Custom/icon/icon _ share.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrganizationsQuery } from '../../BLL/organizationsApi';
import { useGetStatisticsQuery } from '../../BLL/statisticsApi';
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
import ModalChangeReportDay from './ModalChangeReportDay/ModalChangeReportday';

const MainStatistics = () => {

    const { userId } = useParams()
    const navigate = useNavigate()

    const [selectedOrg, setSelectedOrg] = useState()
    const [modalOpen, setModalOpen] = useState(false)
    const [reportDay, setReportDay] = useState()
    const [filtredStatistics, setFiltredStatistics] = useState([])

    const {
        statistics = [],
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
    } = useGetStatisticsQuery({ userId, statisticData: true }, {
        selectFromResult: ({ data, isError, isFetching, isLoading }) => ({
            statistics: data || [],
            isLoadingGetStatistics: isLoading,
            isFetchingGetStatistics: isFetching,
            isErrorGetStatistics: isError
        })
    })
    console.log()
    const {
        organizations = [],
        isLoadindGetOrganizations,
        isFetchingGetOrganizations,
        isErrorGetOrganizations,
    } = useGetOrganizationsQuery(userId, {
        selectFromResult: ({ data, isLoading, isFetching, isError }) => ({
            organizations: data?.transformOrganizations || [],
            isLoadindGetOrganizations: isLoading,
            isFetchingGetOrganizations: isFetching,
            isErrorGetOrganizations: isError
        })
    })

    const REPORT_DAY = {
        0: 'Вс',
        1: 'Пн',
        2: 'Вт',
        3: 'Ср',
        4: 'Чт',
        5: 'Пт',
        6: 'Сб',
    }

    useEffect(() => {
        const sortStatistics = () => {
            if (!selectedOrg && organizations.length>0) return
            setFiltredStatistics(statistics.filter(item => item?.organization.id === selectedOrg))
            setReportDay(
                organizations.find(item => item.id === selectedOrg).reportDay
            )
        }
        sortStatistics()
    }, [selectedOrg, organizations])

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={false} title={'Стратегии'}></Header>
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> {selectedOrg ? 'Выберите Статитстику:' : 'Выберите Организацию:'} </div>
                            <div className={classes.right}>
                                <ul className={classes.selectList}>
                                    {organizations?.map((item) => (
                                        <li key={item.id} onChange={(e) => setSelectedOrg(item.id)}>
                                            {(selectedOrg == item.id) ?
                                                (
                                                    <>
                                                        <input
                                                            type="checkbox"
                                                            checked={item?.id === selectedOrg}
                                                            readOnly

                                                        />
                                                        <div> {item.organizationName} </div>
                                                        {/* <div className={classes.addDraft}>
                                                            <span>
                                                                Создать
                                                            </span>
                                                            <img src={addIcon} />
                                                        </div> */}
                                                    </>
                                                ) : (
                                                    <>
                                                        <input
                                                            type="checkbox"
                                                            checked={item?.id === selectedOrg}
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
                                        <div className={classes.titleStrategy}>Статитстики:</div>
                                        <div className={classes.addDraft} onClick={() => setModalOpen(true)}>
                                            <span>
                                                Отчётный день: {REPORT_DAY[reportDay]}
                                            </span>
                                            {/* <img src={addIcon} /> */}
                                        </div>
                                        <ul className={classes.selectList}>
                                            {filtredStatistics?.map((item, index) => (
                                                <li key={index}
                                                    // style={{ color: item?.state === 'Активный' ? '#005475' : 'none' }}
                                                    onClick={() => navigate(item.id)}
                                                >
                                                    {item?.name}
                                                </li>
                                            ))}
                                            {/* <div className={classes.addDraft}>
                                                <span>
                                                    Создать
                                                </span>
                                                <img src={addIcon} />
                                            </div> */}
                                            {/* {archiveStrategies?.map((item, index) => (
                                                <li key={index} style={{ color: 'grey' }} onClick={() => navigate(item.id)}>
                                                    Стратегия №{item?.strategyNumber}
                                                </li>
                                            ))} */}

                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                    </>


                </div>
            </div>

            {modalOpen && (
                <ModalChangeReportDay
                    setModalOpen={setModalOpen}
                    organizationId={selectedOrg}
                    parenReportDay={reportDay}
                >
                </ModalChangeReportDay>
            )}

        </>
    );
};

export default MainStatistics;