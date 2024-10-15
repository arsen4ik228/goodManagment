import React, {useState, useEffect} from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from './icon/icon _ back.svg'
import menu from './icon/icon _ menu.svg'
import classes from './Posts.module.css';
import searchBlack from './icon/icon _ black_search.svg'
import add from './icon/icon _ add2-b.svg'
import sublist from '../Custom/icon/icon _ sublist.svg'
import share from './icon/icon _ share.svg'
import policy from './icon/icon _ attach policy.svg'
import stats from './icon/_icon _ stats.svg'
import {
    useGetPostIdQuery,
    useGetPostsQuery,
    useUpdatePostsMutation,
} from "../../BLL/postApi";
import {useNavigate, useParams} from "react-router-dom";
import HandlerMutation from "../Custom/HandlerMutation";
import HandlerQeury from "../Custom/HandlerQeury.jsx";
import Header from "../Custom/Header/Header";


const Posts = () => {

    const navigate = useNavigate();
    const {userId} = useParams();

    const [postName, setPostName] = useState(null);
    const [postNameChanges, setPostNameChanges] = useState(false);
    const [divisionName, setDivisionName] = useState(null);
    const [product, setProduct] = useState(null);
    const [isProductChanges, setIsProductChanges] = useState(false);
    const [purpose, setPurpose] = useState(null);
    const [isPurposeChanges, setIsPurposeChanges] = useState(false);
    const [worker, setWorker] = useState(null);
    const [organization, setOrganization] = useState(null);
    const [selectedPostId, setSelectedPostId] = useState(null);
    // Добавляем флаги для управления ручным сбросом состояния успеха и ошибки
    const [manualSuccessReset, setManualSuccessReset] = useState(false);
    const [manualErrorReset, setManualErrorReset] = useState(false);
    const [openList, setOpenList] = useState(false);

    const {
        data = [],
        isLoadingGetPosts,
        isErrorGetPosts,
    } = useGetPostsQuery(userId, {
        selectFromResult: ({data, isLoading, isError}) => ({
            data: data || [],
            isLoadingGetPosts: isLoading,
            isErrorGetPosts: isError,
        }),
    });

    const {
        currentPost = {},
        workers = [],
        organizations = [],
        policyGet = {},
        parentPost = {},
        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetPostIdQuery(
        {userId, postId: selectedPostId},
        {
            selectFromResult: ({data, isLoading, isError, isFetching}) => ({
                currentPost: data?.currentPost || {},
                workers: data?.workers || [],
                organizations: data?.organizations || [],
                parentPost: data?.parentPost || {},
                policyGet: data?.policyGet || {},
                isLoadingGetPostId: isLoading,
                isErrorGetPostId: isError,
                isFetchingGetPostId: isFetching,
            }),
            skip: !selectedPostId,
        }
    );

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
        setOrganization(null);
        setIsProductChanges(false);
        setIsPurposeChanges(false);
        setPostNameChanges(false);
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
        if (worker !== currentPost?.user?.id && worker !== null) {
            updatedData.responsibleUserId = worker;
        }
        if (
            organization !== currentPost?.organization?.id &&
            organization !== null
        ) {
            updatedData.organizationId = organization;
        }
        console.log(JSON.stringify(updatedData));
        // Проверяем, если есть данные для обновления
        if (Object.keys(updatedData).length > 0) {
            await updatePost({
                userId,
                postId: selectedPostId,
                _id: selectedPostId,
                ...updatedData, // отправляем только измененные поля
            })
                .unwrap()
                .then(() => {
                    setManualSuccessReset(false);
                    setManualErrorReset(false);
                    // После успешного обновления сбрасываем состояние
                    reset();
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
                    <Header title={'Посты'} create={true}></Header>
                </>

                <div className={classes.body}>
                    <div className={classes.bodyContainer} style={{"borderBottom": "1px solid grey"}}>
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
                    </div>

                    <div className={classes.burger} onClick={() => setOpenList(!openList)}>
                        <div className={classes.textBurger}></div>
                        {!openList && (<div className={classes.textBurger}> Развернуть</div>)}
                        <div className={classes.imgBurger}>
                            <img src={sublist} alt="icon" style={{transform: openList ? 'none' : 'rotate(90deg)'}}/>
                        </div>
                    </div>


                    {openList &&
                        (
                            <>
                                <div className={classes.bodyContainer} style={{"paddingTop": "15px"}}>
                                    <div className={classes.name}>
                                        Название поста <span style={{color: "red"}}>*</span>
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
                                </div>

                                <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Название подразделения <span style={{color: "red"}}>*</span>
                                    </div>
                                    <div className={classes.selectSection}>
                                        <input
                                            type="text"
                                            value={divisionName || currentPost.divisionName}
                                            onChange={(e) => {
                                                setDivisionName(e.target.value);
                                            }}
                                            disabled={parentPost?.divisionName}
                                        />
                                    </div>
                                </div>

                                <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Руководствующий пост
                                    </div>
                                    <div className={classes.selectSection}>
                                        <input type="text" value={parentPost?.divisionName} disabled/>
                                    </div>
                                </div>

                                <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Руководитель поста <span style={{color: "red"}}>*</span>
                                    </div>
                                    <div className={classes.selectSection}>
                                        <select
                                            name="mySelect"
                                            className={classes.select}
                                            value={worker || currentPost?.user?.id}
                                            onChange={(e) => {
                                                setWorker(e.target.value);
                                            }}
                                        >
                                            <option value="" disabled>
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
                                        Организация <span style={{color: "red"}}>*</span>
                                    </div>
                                    <div className={classes.selectSection}>
                                        <select
                                            name="mySelect"
                                            className={classes.select}
                                            value={organization || currentPost?.organization?.id}
                                            onChange={(e) => {
                                                setOrganization(e.target.value);
                                            }}
                                        >
                                            <option value="">Выберите опцию</option>
                                            {organizations?.map((item) => {
                                                return (
                                                    <option key={item.id}
                                                            value={item.id}>{item.organizationName}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Прикрепить политику
                                    </div>
                                    <div className={classes.selectSection}>
                                        <input type="text" value={policyGet?.policyName} disabled/>
                                    </div>
                                </div>
                            </>
                        )}

                    <div className={classes.main}>
                        {isErrorGetPosts ? (
                            <>
                                <HandlerQeury Error={isErrorGetPosts}></HandlerQeury>
                            </>
                        ) : (
                            <>
                                {isErrorGetPostId ? (
                                    <HandlerQeury Error={isErrorGetPostId}></HandlerQeury>
                                ) : (
                                    <>
                                        <HandlerQeury
                                            Loading={isLoadingGetPosts}
                                        ></HandlerQeury>

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
                                            placeholder="описание продукта поста"
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
                                            placeholder="описнаие предназначения поста"
                                            value={isPurposeChanges ? purpose : (purpose || currentPost.purpose)}
                                            onChange={(e) => {
                                                setPurpose(e.target.value);
                                                setIsPurposeChanges(true);
                                            }}
                                        />
                                                        </div>

                                                        <div className={classes.post}>
                                                            <img src={share} alt="blackStatistic"/>
                                                            <div>
                                          <span className={classes.nameButton}>
                                            Выбрать или создать статистику для поста
                                          </span>
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
                        )}
                    </div>

                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div></div>
                        <div>
                            <button onClick={() => saveUpdatePost()}> Отредактировать</button>
                        </div>
                        <div>
                            <img src={searchBlack}/>
                            {/*<img src={policy} className={classes.image}/>*/}
                            {/*<img src={stats}/>*/}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Posts;