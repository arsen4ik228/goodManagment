import React, { useState, useEffect } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from './icon/icon _ back.svg'
import menu from './icon/icon _ menu.svg'
import classes from './NewPosts.module.css';
import searchBlack from './icon/icon _ black_search.svg'
import add from './icon/icon _ add2-b.svg'
import sublist from '../Custom/icon/icon _ sublist.svg'
import share from './icon/icon _ share.svg'
import policy from './icon/icon _ attach policy.svg'
import stats from './icon/_icon _ stats.svg'
import {
    useGetPostNewQuery,
    usePostPostsMutation
} from "../../BLL/postApi";
import { useNavigate, useParams } from "react-router-dom";
import HandlerMutation from "../Custom/HandlerMutation";
import HandlerQeury from "../Custom/HandlerQeury.jsx";
import Header from "../Custom/Header/Header";
import blackStatistic from "../Custom/icon/blackStatistic.svg";


const Posts = () => {

    const navigate = useNavigate()
    const { userId } = useParams()

    const [postName, setPostName] = useState()
    const [divisionName, setDivisionName] = useState('')
    const [disabledDivisionName, setDisabledDivisionName] = useState(false)
    const [displayOrganizationName, setDisplayOrganizationName] = useState('')
    const [product, setProduct] = useState()
    const [purpose, setPurpose] = useState()
    const [policy, setPolicy] = useState();
    const [worker, setWorker] = useState("")
    const [parentId, setParentId] = useState('');
    const [organization, setOrganization] = useState('')
    const [openList, setOpenList] = useState(true);

    const [divisionOrg, setDivisionOrg] = useState('')
    const [divisionChapter, setDivisionChapter] = useState('')


    useEffect(() => {
        setWorker(divisionChapter)
        setParentId(divisionOrg)
    }, [divisionChapter, divisionOrg])

    const {
        workers = [],
        policies = [],
        posts = [],
        organizations = [],
        maxDivisionNumber = undefined,
        isLoadingGetNew,
        isErrorGetNew,
        data = []
    } = useGetPostNewQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            workers: data?.workers || [],
            policies: data?.policies || [],
            posts: data?.posts || [],
            organizations: data?.organizations || [],
            maxDivisionNumber: data?.maxDivisionNumber || undefined,
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
    console.log(organization)
    const savePosts = async () => {
        await postPosts({
            userId: userId,
            addPolicyId: policy,
            postName: postName,
            divisionName: divisionName,
            parentId: parentId === "null" ? null : parentId,
            product: product,
            purpose: purpose,
            responsibleUserId: worker,
            organizationId: organization,
        })
            .unwrap()
            .then(() => {
                // reset();
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header title={'Создание нового поста'} create={false}></Header>
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
                                        Подразделение
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

                                <div className={classes.bodyContainer}> {/* Организация organization */}
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
                                                placeholder="описание продукта поста"
                                                value={product}
                                                onChange={(e) => {
                                                    setProduct(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className={classes.destinyTeaxtaera}>
                                            <textarea
                                                className={classes.Teaxtaera}
                                                placeholder="описнаие предназначения поста"
                                                value={purpose}
                                                onChange={(e) => {
                                                    setPurpose(e.target.value);
                                                }}
                                            />
                                        </div>

                                        <div className={classes.post}>
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

                <footer className={classes.inputContainer}>
                    <div className={classes.inputRow2}>
                        <div></div>
                        <div>
                            <button onClick={() => savePosts()}> СОХРАНИТЬ</button>
                        </div>
                        <div>
                            {/* <img src={searchBlack} /> */}
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