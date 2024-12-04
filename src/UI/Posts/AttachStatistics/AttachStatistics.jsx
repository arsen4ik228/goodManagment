import React, { useEffect, useState } from 'react'
import classes from './AttachStatistics.module.css'
import Header from '../../Custom/Header/Header'
import addIcon from '../../Custom/icon/icon _ add _ blue.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetStatisticsQuery } from '../../../BLL/statisticsApi'
import { useGetPostIdQuery, useUpdateStatisticsToPostIdMutation } from '../../../BLL/postApi'

export default function AttachStatistics() {

    const { userId, postId } = useParams()
    const navigate = useNavigate()
    const [selectedStatistics, setSelectedStatistics] = useState([])


    const {
        statisticsIncludedPost = [],
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetPostIdQuery(
        { userId, postId },
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
            setSelectedStatistics(idsToAdd);
        }
    }, [statisticsIncludedPost]);


    const saveStatisticsId = async () => {
        await updateStatisticsToPostId({
            userId,
            postId,
            ids: selectedStatistics,
        })
            .unwrap()
            .then(() => {
                navigate(-1)
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }

    const handleSelectItem = (itemId) => {
        if (!selectedStatistics.includes(itemId)) {
            setSelectedStatistics(prevState => [...prevState, itemId]);
        } else {
            setSelectedStatistics(selectedStatistics.filter(stat => stat !== itemId));
        }
    };

    const createNewStatistic = () => {
        navigate(`/${userId}/Statistics/new/${postId}`)
    }

    console.log(selectedStatistics)
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

                        <input type="search" placeholder="Поиск" />
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
                                {statistics?.map((item, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSelectItem(item?.id)}
                                    >
                                        <span>
                                            {item?.name}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={selectedStatistics.includes(item?.id)}
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
                    <div></div>
                    <div>
                        <button onClick={() => saveStatisticsId()}> Сохранить</button>
                    </div>
                    <div>
                        {/* <img src={searchBlack}/> */}
                        {/*<img src={policy} className={classes.image}/>*/}
                        {/*<img src={stats}/>*/}
                    </div>
                </div>
            </footer>
        </div>
    )
}
