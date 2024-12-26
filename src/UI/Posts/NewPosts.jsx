import React, { useState, useEffect } from 'react';
import classes from './NewPosts.module.css';
import attachpolicy from './icon/icon _ attach policy.svg'

import {
    useGetPostNewQuery,
    usePostPostsMutation
} from "../../BLL/postApi";
import { useNavigate } from "react-router-dom";
import HandlerMutation from "../Custom/HandlerMutation";
import HandlerQeury from "../Custom/HandlerQeury.jsx";
import Header from "../Custom/CustomHeader/Header";
import blackStatistic from "../Custom/icon/blackStatistic.svg";
import AttachPolicy from '../Custom/AttachPolicy/AttachPolicy.jsx';
import AlertSavePost from '../Custom/AlertSavePost/AlertSavePost.jsx';
import { selectedOrganizationId } from '../../BLL/constans.js';
import { ButtonContainer } from '../Custom/CustomButtomContainer/ButtonContainer.jsx';


const Posts = () => {

    const navigate = useNavigate()

    const [postName, setPostName] = useState()
    const [divisionName, setDivisionName] = useState('')
    const [disabledDivisionName, setDisabledDivisionName] = useState(false)
    const [displayOrganizationName, setDisplayOrganizationName] = useState('')
    const [product, setProduct] = useState()
    const [purpose, setPurpose] = useState()
    const [policy, setPolicy] = useState(null);
    const [worker, setWorker] = useState("")
    const [parentId, setParentId] = useState('');
    const [organization, setOrganization] = useState('')
    const [openList, setOpenList] = useState(true);
    const [currentPolicyName, setCurrentPolicyName] = useState(null)

    const [modalPolicyOpen, setModalPolicyOpen] = useState(false)
    const [modalStatisticsOpen, setModalStatisticsOpen] = useState(false)

    const {
        workers = [],
        policies = [],
        posts = [],
        organizations = [],
        maxDivisionNumber = undefined,
        isLoadingGetNew,
        isErrorGetNew,
        data = []
    } = useGetPostNewQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            workers: data?.workers || [],
            policies: data?.policies || [],
            posts: data?.posts || [],
            organizations: data?.organizations || [],
            maxDivisionNumber: data?.maxDivisionNumber + 1 || undefined,
            isLoadingGetNew: isLoading,
            isErrorGetNew: isError,
            data: data,
        }),
    });
    console.log(posts)

    const [
        postPosts,
        {
            isLoading: isLoadingPostMutation,
            isSuccess: isSuccessPostMutation,
            isError: isErrorPostMutation,
            error: ErrorPostMutation
        },
    ] = usePostPostsMutation();

    useEffect(() => {
        if (divisionName == '' && maxDivisionNumber)
            setDivisionName(`Подразделение №${maxDivisionNumber}`)
    }, [maxDivisionNumber])

    useEffect(() => {
        const foundPolicy = policies?.find(item => item.id === policy);
        setCurrentPolicyName(foundPolicy ? foundPolicy?.policyName : null);
    }, [policy]);

    const reset = () => {
        setPostName("");
        setDivisionName("");
        setProduct("");
        setPurpose("");
        setPolicy("");
        setWorker("");
        setParentId("null");
        setOrganization("");

        setTimeout(() => {
            navigate(-1);
        }, 1800);
    };

    const selectedParentPost = (id) => {
        setParentId(id);
        if (id) {
            const obj = posts.find(
                (item) => item.id === id
            );
            setOrganization(obj.organization.id)
            setDisplayOrganizationName(obj.organization.organizationName)
        }
        else setOrganization('')
    }

    const savePosts = async () => {
        const Data = {}
        if (parentId) {
            Data.parentId = parentId
        }
        if (worker) {
            Data.responsibleUserId = worker
        }
        if (policy !== null) {
            Data.addPolicyId = policy
        }
        await postPosts({
            // addPolicyId: policy,
            postName: postName,
            divisionName: divisionName,
            product: product,
            purpose: purpose,
            organizationId: selectedOrganizationId,
            ...Data
        })
            .unwrap()
            .then((result) => {
                // reset();
                navigate(`/Posts/${result?.id}`)
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Создание нового поста'}>Личный помощник</Header>
                </>

                <div className={classes.body}>

                    {openList &&
                        (
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

                                <div className={classes.bodyContainer}>{/* Подразделение divisionName */}
                                    <div className={classes.name}>
                                        Подразделение <span style={{ color: "red" }}>*</span>
                                    </div>
                                    <div className={classes.selectSection}>
                                        <input
                                            type="text"
                                            value={divisionName}
                                            onChange={(e) => {
                                                setDivisionName(e.target.value);
                                            }}
                                        />
                                    </div>
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
                                                // setParentId(e.target.value);
                                                // const obj = posts.find(
                                                //     (item) => item.id === e.target.value
                                                // );
                                                // setDivisionOrg(obj?.organization.organizationName);
                                                selectedParentPost(e.target.value)
                                            }}
                                        >
                                            <option value="">
                                                Выберите опцию
                                            </option>
                                            {posts?.map((item) => {
                                                return <option key={item.id} value={item.id}>{item.postName}</option>;
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className={classes.bodyContainer}>{/* СОТРУДНИК worker */}
                                    <div className={classes.name}>
                                        Сотрудник
                                    </div>
                                    <div className={classes.selectSection}>
                                        <select
                                            name="mySelect"
                                            className={classes.select}
                                            value={worker}
                                            onChange={(e) => {
                                                setWorker(e.target.value);
                                            }}
                                        >
                                            <option value="">
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


                                {/* <div className={classes.bodyContainer}>
                                    <div className={classes.name}>
                                        Прикрепить политику
                                    </div>
                                    <div className={classes.selectSection}>
                                        <select
                                            name="mySelect"
                                            className={classes.select}
                                            value={policy}
                                            onChange={(e) => {
                                                setPolicy(e.target.value);
                                            }}
                                        >
                                            <option value="null"> —</option>
                                            {policies?.map((item) => {
                                                return <option key={item.id} value={item.id}>{item.policyName}</option>;
                                            })}
                                        </select>
                                    </div>
                                </div> */}
                            </>
                        )}

                    <div className={classes.main}>
                        {isErrorGetNew ? (
                            <HandlerQeury Error={isErrorGetNew}></HandlerQeury>
                        ) : (
                            <>
                                {isLoadingGetNew ? (
                                    <HandlerQeury Loading={isLoadingGetNew}></HandlerQeury>
                                ) : (
                                    <>
                                        <div className={classes.productTeaxtaera}>
                                            <textarea
                                                className={classes.Teaxtaera}
                                                placeholder="Описание продукта поста"
                                                value={product}
                                                onChange={(e) => {
                                                    setProduct(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className={classes.destinyTeaxtaera}>
                                            <textarea
                                                className={classes.Teaxtaera}
                                                placeholder="Описнаие предназначения поста"
                                                value={purpose}
                                                onChange={(e) => {
                                                    setPurpose(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div
                                            className={classes.post}
                                            onClick={() => setModalPolicyOpen(true)}

                                        >
                                            <img src={attachpolicy} alt="blackStatistic" />
                                            <div>
                                                {policy ? (
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
                                            onClick={() => setModalStatisticsOpen(true)}
                                        >
                                            <img src={blackStatistic} alt="blackStatistic" />
                                            <div>
                                                <span className={classes.nameButton}>
                                                    Выбрать или создать статистику для поста
                                                </span>
                                            </div>
                                        </div>
                                        <HandlerMutation
                                            Loading={isLoadingPostMutation}
                                            Error={isErrorPostMutation}
                                            Success={isSuccessPostMutation}
                                            textSuccess={"Пост успешно создан."}
                                            textError={ErrorPostMutation?.data?.errors[0]?.errors}
                                        ></HandlerMutation>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                </div>

                <ButtonContainer
                    clickFunction={savePosts}
                >
                    СОХРАНИТЬ
                </ButtonContainer>
            </div>
            {modalPolicyOpen &&
                <AttachPolicy
                    setModalOpen={setModalPolicyOpen}
                    title={'Политики'}
                    firstArray={policies}
                    componentName={'policyName'}
                    id={policy}
                    setIds={setPolicy}
                >
                </AttachPolicy>}
            {modalStatisticsOpen &&
                <AlertSavePost
                    requestFunc={savePosts}
                    setModalOpen={setModalStatisticsOpen}
                >
                </AlertSavePost>}
        </>
    );
};

export default Posts;