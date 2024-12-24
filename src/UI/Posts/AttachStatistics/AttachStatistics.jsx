import React, { useEffect, useMemo, useState } from 'react'
import classes from './AttachStatistics.module.css'
import Header from '../../Custom/Header/Header'
import addIcon from '../../Custom/icon/icon _ add _ blue.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetStatisticsQuery } from '../../../BLL/statisticsApi'
import { useGetPostIdQuery, useUpdateStatisticsToPostIdMutation } from '../../../BLL/postApi'
import { arraysEqualWithObjects } from '../../../BLL/constans'
import ConfirmModal from './confrimModal/ConfirmModal'

export default function AttachStatistics() {

    const { userId, postId } = useParams()
    const navigate = useNavigate()
    const [selectedStatistics, setSelectedStatistics] = useState([])
    const [searchTerm, setSearchTerm] = React.useState('')
    const [openConfirmAttachStatistics, setOpenConfirmAttachStatistics] = useState(false)


    const {
        statisticsIncludedPost = [],
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetPostIdQuery(
        {postId},
        {
            selectFromResult: ({ data, isLoading, isError, isFetching, }) => ({

                statisticsIncludedPost: data?.statisticsIncludedPost || [],
                isLoadingGetPostId: isLoading,
                isErrorGetPostId: isError,
                isFetchingGetPostId: isFetching,
            }),
        }
    );

    const {
        statistics = [],
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics,
    } = useGetStatisticsQuery({ userId, statisticData: false }, {
        selectFromResult: ({ data, isError, isFetching, isLoading }) => ({
            statistics: data || [],
            isLoadingGetStatistics: isLoading,
            isFetchingGetStatistics: isFetching,
            isErrorGetStatistics: isError
        })
    })

    const [
        updateStatisticsToPostId,
        {
            isLoading: isLoadingStatisticsToPostIdMutation,
            isSuccess: isSuccessUpdateStatisticsToPostIdMutation,
            isError: isErrorUpdateStatisticsToPostIdMutation,
            error: ErrorUpdateStatisticsToPostIdMutation,
        },
    ] = useUpdateStatisticsToPostIdMutation();

    useEffect(() => {
        if (statisticsIncludedPost.length > 0) {
            const idsToAdd = statisticsIncludedPost.map(item => item.id);
            setSelectedStatistics(statisticsIncludedPost);
        }
    }, [statisticsIncludedPost]);


    const saveStatisticsId = async () => {
        await updateStatisticsToPostId({
            userId,
            postId,
            ids: selectedStatistics.map(item => item.id),
        })
            .unwrap()
            .then(() => {
                navigate(-1)
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }

    const handleSelectItem = (statistic) => {
        if (!selectedStatistics.includes(statistic)) {
            setSelectedStatistics(prevState => [...prevState, statistic]);
        } else {
            setSelectedStatistics(selectedStatistics.filter(stat => stat !== statistic));
        }
    };

    const filteredItems = useMemo(() =>
        statistics?.filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase())),
        [statistics, searchTerm]
    )

    const createNewStatistic = () => {
        navigate(`/${userId}/Statistics/new/${postId}`)
    }

    const openConfirmModal = () => {
        if (arraysEqualWithObjects(statisticsIncludedPost, selectedStatistics)) return
        setOpenConfirmAttachStatistics(true)
    }


    console.log('selectedStatistics', selectedStatistics)

    return (
        <div className={classes.wrapper}>

            <>
                <Header create={false} title={'Прикрепить статистику'}></Header>
            </>
            <div className={classes.body}>
                <>
                    {/* <div className={classes.first}>
                        <input type={'text'} value={directoryName} onChange={(e) => setDirectoryName(e.target.value)} />
                    </div> */}
                    <div className={classes.element_srch}>
                        <input
                            type="text"
                            placeholder="Поиск"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div
                        onClick={() => createNewStatistic()}
                        className={classes.createNew}
                    >
                        <span>Создать новую</span>
                        <img src={addIcon} alt="" />
                    </div>

                    <div className={classes.bodyContainer}>
                        <>

                            <ul className={classes.selectList}>
                                {/* {!activeDirectives.length > 0 && (
                                        <li
                                            style={{ color: 'grey', fontStyle: 'italic' }}
                                        >
                                            Политика отсутствует
                                        </li>
                                    )}*/}
                                {filteredItems?.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectItem(item)}
                                    >
                                        <span>
                                            {item?.name}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={selectedStatistics.some(stat => stat.id === item?.id)}
                                            disabled={statisticsIncludedPost.some(stat => stat.id === item?.id)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    </div>
                </>
            </div>
            <footer className={classes.inputContainer}>
                <div className={classes.inputRow2}>
                    <div>
                        <button onClick={() => openConfirmModal()}> Сохранить</button>
                    </div>
                </div>
            </footer>

            {openConfirmAttachStatistics && (
                <ConfirmModal
                    setModalOpen={setOpenConfirmAttachStatistics}
                    requestFunc={saveStatisticsId}
                    selectedStatistics={selectedStatistics}
                >
                </ConfirmModal>
            )}
        </div>
    )
}
