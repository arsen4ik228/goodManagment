import React, { useState, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from './icon/icon _ back.svg'
import menu from './icon/icon _ menu.svg'
import classes from './Posts.module.css';
import searchBlack from './icon/icon _ black_search.svg'
import add from './icon/icon _ add2-b.svg'
import sublist from '../Custom/icon/icon _ sublist.svg'
import share from './icon/icon _ share.svg'
import stats from './icon/_icon _ stats.svg'
import {
    useGetPostIdQuery,
    useGetPostsQuery,
    useUpdatePostsMutation,
} from "../../BLL/postApi";
import { useNavigate, useParams } from "react-router-dom";
import HandlerMutation from "../Custom/HandlerMutation";
import HandlerQeury from "../Custom/HandlerQeury.jsx";
import Header from "../Custom/Header/Header";
import AttachPolicy from '../Custom/AttachPolicy/AttachPolicy.jsx';
import AttachStatistics from './AttachStatistics/AttachStatistics.jsx';


const Posts = () => {

    const navigate = useNavigate();
    const { userId, postId } = useParams();

    const [postName, setPostName] = useState(null);
    const [postNameChanges, setPostNameChanges] = useState(false);
    const [divisionName, setDivisionName] = useState(null);
    const [parentDivisionName, setParentDivisionName] = useState(null)
    const [parentId, setParentId] = useState(null)
    const [displayOrganizationName, setDisplayOrganizationName] = useState('')
    const [product, setProduct] = useState(null);
    const [isProductChanges, setIsProductChanges] = useState(false);
    const [purpose, setPurpose] = useState(null);
    const [isPurposeChanges, setIsPurposeChanges] = useState(false);
    const [worker, setWorker] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [policy, setPolicy] = useState(null)

    const [currentPolicyName, setCurrentPolicyName] = useState(null)
    const [modalPolicyOpen, setModalPolicyOpen] = useState(false)

    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);
    const [openList, setOpenList] = useState(false);

    const {
        currentPost = {},
        workers = [],
        organizations = [],
        posts = [],
        parentPost = {},
        policiesActive = [],
        statisticsIncludedPost = [],
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetPostIdQuery(
        { userId, postId: postId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentPost: data?.currentPost || {},
                workers: data?.workers || [],
                organizations: data?.organizations || [],
                parentPost: data?.parentPost || {},
                posts: data?.posts || [],
                policiesActive: data?.policiesActive || [],
                statisticsIncludedPost: data?.statisticsIncludedPost || [],
                isLoadingGetPostId: isLoading,
                isErrorGetPostId: isError,
                isFetchingGetPostId: isFetching,
            }),
        }
    );
    console.log(currentPost, workers, organizations, posts, parentPost, statisticsIncludedPost, policiesActive)

    useEffect(() => {
        if (currentPost && Object.keys(currentPost).length > 0) {
            setPostName(currentPost?.postName);
            setDivisionName(currentPost?.divisionName);
            setWorker(currentPost?.user?.id);
            setOrganization(currentPost?.organization?.id);
            setParentId(currentPost?.parentId);
            setPolicy(currentPost?.policy?.id);
        }
    }, [currentPost]);

    useEffect(() => {
        const foundPolicy = policiesActive?.find(item => item.id === policy);
        if (foundPolicy) setCurrentPolicyName(foundPolicy.policyName)
        else setPolicy(null)
    }, [policy]);

    useEffect(() => {
        if (parentPost && Object.keys(parentPost).length > 0) {
            setParentDivisionName(parentPost?.divisionName)
            setDisplayOrganizationName(parentPost?.organization?.organizationName)
        }
    }, [parentPost])

    const [
        updatePost,
        {
            isLoading: isLoadingUpdatePostMutation,
            isSuccess: isSuccessUpdatePostMutation,
            isError: isErrorUpdatePostMutation,
            error: ErrorUpdatePostMutation
        },
    ] = useUpdatePostsMutation();

    const reset = () => {
        setPostName(null);
        setDivisionName(null);
        setProduct(null);
        setPurpose(null);
        setWorker(null);
        setParentId(null)
        setPolicy(null)
        setOrganization(null);
        setIsProductChanges(false);
        setIsPurposeChanges(false);
        setPostNameChanges(false);
        setDisplayOrganizationName('')
    }

    const selectedParentPost = (id) => {
        setParentId(id);
        if (id) {
            const obj = posts.find(
                (item) => item.id === id
            );
            setOrganization(obj?.organization?.id)
            setParentDivisionName(obj?.divisionName)
            setDisplayOrganizationName(obj?.organization?.organizationName)
        }
        else setOrganization('')
    }

    const saveUpdatePost = async () => {
        // Создаем объект с измененными полями
        const updatedData = {};

        // Проверки на изменения и отсутствие null
        if (postName !== currentPost.postName && postName !== null) {
            updatedData.postName = postName;
        }
        if (divisionName !== currentPost.divisionName && divisionName !== null) {
            updatedData.divisionName = divisionName;
        }
        if (isProductChanges || (product !== currentPost.product && product !== null)) {
            updatedData.product = product;
        }
        if (isPurposeChanges || (purpose !== currentPost.purpose && purpose !== null)) {
            updatedData.purpose = purpose;
        }
        if (worker !== currentPost?.user?.id) {
            updatedData.responsibleUserId = worker;
        }
        if (
            organization !== currentPost?.organization?.id &&
            organization !== null
        ) {
            updatedData.organizationId = organization;
        }
        if (parentId !== currentPost?.parentId) {
            updatedData.parentId = parentId
        }
        if (policy !== currentPost?.policyId) {
            updatedData.policyId = policy
        }
        console.log(JSON.stringify(updatedData));
        // Проверяем, если есть данные для обновления
        if (Object.keys(updatedData).length > 0) {
            await updatePost({
                userId,
                postId: postId,
                _id: postId,
                ...updatedData, // отправляем только измененные поля
            })
                .unwrap()
                .then((result) => {
                    setManualSuccessReset(false);
                    setManualErrorReset(false);
                    // reset();
                })
                .catch((error) => {
                    reset();
                    setManualErrorReset(false);
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        } else {
            console.log("Нет изменений для обновления");
        }
    };

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Редактировать Пост'} create={false}></Header>
                </>

                <div className={classes.body}>
                    {/* <div className={classes.bodyContainer} style={{ "borderBottom": "1px solid grey" }}>
                        <div className={classes.name}>
                            Пост
                        </div>
                        <div className={classes.selectSection}>
                            <select
                                className={classes.select}
                                value={selectedPostId || ""}
                                onChange={(e) => {
                                    setSelectedPostId(e.target.value);
                                }}
                            >
                                <option value="" disabled>
                                    Выберите пост
                                </option>
                                {data?.map((item) => {
                                    return <option key={item.id} value={item.id}>{item.postName}</option>;
                                })}
                            </select>
                        </div>
                    </div> */}

                    {/* <div className={classes.burger} onClick={() => setOpenList(!openList)}>
                        <div className={classes.textBurger}></div>
                        {!openList && (<div className={classes.textBurger}> Развернуть</div>)}
                        <div className={classes.imgBurger}>
                            <img src={sublist} alt="icon" style={{transform: openList ? 'none' : 'rotate(90deg)'}}/>
                        </div>
                    </div> */}



                    <>
                        <div className={classes.bodyContainer}>
                            <input
                                className={classes.first}
                                type={'text'}
                                value={postName}
                                onChange={(e) => {
                                    setPostName(e.target.value);
                                }}
                            />
                        </div>
                        {/* <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Название поста <span style={{ color: "red" }}>*</span>
                            </div>
                            <div className={classes.selectSection}>
                                <input
                                    type="text"
                                    value={postNameChanges ? postName : (postName || currentPost.postName)}
                                    onChange={(e) => {
                                        setPostName(e.target.value);
                                        setPostNameChanges(true);
                                    }}
                                />
                            </div>
                        </div> */}

                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Подразделение
                            </div>
                            {(parentId && !currentPost.isHasChildPost) ?
                                (
                                    <div className={classes.selectSection}>
                                        <input
                                            type="text"
                                            value={parentDivisionName}
                                            disabled
                                        />
                                    </div>

                                ) : (
                                    <div className={classes.selectSection}>
                                        <input
                                            type="text"
                                            value={divisionName}
                                            onChange={(e) => {
                                                setDivisionName(e.target.value);
                                            }}
                                        />
                                    </div>
                                )
                            }
                        </div>

                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Руководитель
                            </div>
                            <div className={classes.selectSection}>
                                <select
                                    name="mySelect"
                                    className={classes.select}
                                    value={parentId}
                                    onChange={(e) => {
                                        selectedParentPost(e.target.value === '' ? null : e.target.value);
                                    }}
                                >
                                    <option value='' >
                                        Выберите опцию
                                    </option>
                                    {posts?.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>
                                                {item.postName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Сотрудник
                            </div>
                            <div className={classes.selectSection}>
                                <select
                                    name="mySelect"
                                    className={classes.select}
                                    value={worker}
                                    onChange={(e) => {
                                        setWorker(e.target.value === '' ? null : e.target.value);
                                    }}
                                >
                                    <option value=''>
                                        Выберите опцию
                                    </option>
                                    {workers?.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>
                                                {`${item.firstName} ${item.lastName}`}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className={classes.bodyContainer}>
                            <div className={classes.name}>
                                Организация <span style={{ color: "red" }}>*</span>
                            </div>
                            {!parentId ? (
                                <div className={classes.selectSection}>
                                    <select
                                        name="mySelect"
                                        className={classes.select}
                                        value={organization}
                                        disabled={parentId}

                                        onChange={(e) => {
                                            setOrganization(e.target.value);
                                        }}
                                    >
                                        <option value="" disabled>Выберите опцию</option>
                                        {organizations?.map((item) => {
                                            return (
                                                <option key={item.id}
                                                    value={item.id}>{item.organizationName}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            ) : (
                                <div className={classes.selectSection}>
                                    <input
                                        type="text"
                                        value={displayOrganizationName}
                                        disabled={parentId}
                                    />
                                </div>
                            )}
                        </div>

                        {/* <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Прикрепить политику
                                    </div>
                                    <div className={classes.selectSection}>
                                        <input type="text" value={policyGet?.policyName} disabled/>
                                    </div>
                                </div> */}
                    </>


                    <div className={classes.main}>
                        <>
                            {isErrorGetPostId ? (
                                <HandlerQeury Error={isErrorGetPostId}></HandlerQeury>
                            ) : (
                                <>

                                    {isLoadingGetPostId || isFetchingGetPostId ? (
                                        <HandlerQeury
                                            Loading={isLoadingGetPostId}
                                            Fetching={isFetchingGetPostId}
                                        ></HandlerQeury>
                                    ) : (
                                        <>
                                            {currentPost.id ? (
                                                <>
                                                    <div className={classes.productTeaxtaera}>
                                                        <textarea
                                                            className={classes.Teaxtaera}
                                                            placeholder="Описание продукта поста"
                                                            value={isProductChanges ? product : (product || currentPost.product)}
                                                            onChange={(e) => {
                                                                setProduct(e.target.value);
                                                                setIsProductChanges(true);
                                                            }}
                                                        />
                                                    </div>

                                                    <div className={classes.destinyTeaxtaera}>
                                                        <textarea
                                                            className={classes.Teaxtaera}
                                                            placeholder="Описнаие предназначения поста"
                                                            value={isPurposeChanges ? purpose : (purpose || currentPost.purpose)}
                                                            onChange={(e) => {
                                                                setPurpose(e.target.value);
                                                                setIsPurposeChanges(true);
                                                            }}
                                                        />
                                                    </div>

                                                    <div
                                                        className={classes.post}
                                                        onClick={() => setModalPolicyOpen(true)}
                                                    >
                                                        <img src={share} alt="blackStatistic" />
                                                        <div>
                                                            {policy !== null ?
                                                                (
                                                                    <span className={classes.nameButton}>
                                                                        Прикреплено: {currentPolicyName}
                                                                    </span>
                                                                ) : (
                                                                    <span className={classes.nameButton}>
                                                                        Прикрепить политику
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={classes.post}
                                                        onClick={() => navigate('attachStatistics')}
                                                    >
                                                        <img src={share} alt="blackStatistic" />
                                                        <div>
                                                            {statisticsIncludedPost?.length > 0 ?
                                                                (
                                                                    <span className={classes.nameButton}>
                                                                        Статистика: {' '} {statisticsIncludedPost[0]?.name}
                                                                        {statisticsIncludedPost?.length > 1 ?
                                                                            (
                                                                                <span>
                                                                                   {' '} и ещё ({statisticsIncludedPost?.length-1})
                                                                                </span>
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                    </span>
                                                                ) : (
                                                                    <span className={classes.nameButton}>
                                                                        Выбрать или создать статистику для поста
                                                                    </span>
                                                                )}

                                                        </div>
                                                    </div>
                                                    <HandlerMutation
                                                        Loading={isLoadingUpdatePostMutation}
                                                        Error={isErrorUpdatePostMutation && !manualErrorReset} // Учитываем ручной сброс
                                                        Success={
                                                            isSuccessUpdatePostMutation && !manualSuccessReset
                                                        } // Учитываем ручной сброс
                                                        textSuccess={"Пост обновлен"}
                                                        textError={ErrorUpdatePostMutation?.data?.errors[0]?.errors}
                                                    ></HandlerMutation>
                                                </>
                                            ) : (
                                                <> Выберите пост </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>

                    </div>

                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div></div>
                        <div>
                            <button onClick={() => saveUpdatePost()}> Сохранить</button>
                        </div>
                        <div>
                            {/* <img src={searchBlack}/> */}
                            {/*<img src={policy} className={classes.image}/>*/}
                            {/*<img src={stats}/>*/}
                        </div>
                    </div>
                </footer>
            </div>

            {modalPolicyOpen &&
                <AttachPolicy
                    setModalOpen={setModalPolicyOpen}
                    title={'Политики'}
                    firstArray={policiesActive}
                    componentName={'policyName'}
                    id={policy}
                    setIds={setPolicy}
                >
                </AttachPolicy>}

        </>
    );
};

export default Posts;