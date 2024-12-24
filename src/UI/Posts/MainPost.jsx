import React, { useEffect, useState } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import backRow from '../Custom/icon/icon _ back.svg'
import iconAdd from '../Custom/icon/icon _ add _ blue.svg'
import menu from '../Custom/icon/icon _ menu.svg'
import edit from '../Custom/icon/icon _ edit _ grey.svg'
import classes from './MainPost.module.css'
import searchBlack from '../Custom/icon/icon _ black_search.svg'
import add from '../Custom/icon/icon _ add _ 005476.svg'
import stats from '../Custom/icon/_icon _ stats.svg'
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Custom/Header/Header";
import sublist from '../Custom/icon/icon _ sublist.svg'
import leftArrow from '../Custom/icon/icon _ leftarrow.svg'
import rightArrow from '../Custom/icon/icon _ rightarrow.svg'
import CustomSelect from '../Custom/CustomSelect/CustomSelect';
import { useGetPostsQuery } from '../../BLL/postApi';
import { organizationId } from '../../BLL/constans';



const MainPost = () => {

    const { userId } = useParams()
    const navigate = useNavigate()
    const [openModal, setOpenModal] = useState(false)

    const {
        data = [],
        isLoadingGetPosts,
        isErrorGetPosts,
    } = useGetPostsQuery(undefined, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            data: data || [],
            isLoadingGetPosts: isLoading,
            isErrorGetPosts: isError,
        }),
    });
    console.log(data)

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header create={true} title={'Посты'}></Header>
                    {/* <div className={classes.iconAdd}>
                        <img src={iconAdd} alt="" onClick={() => setOpenModal(true)} />
                    </div> */}
                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> Выберите Пост:</div>
                            <div className={classes.right}>
                                {/* <div
                                    className={classes.title}
                                    onClick={() => setOpenInstruction(!openInstruction)}
                                >
                                    <div>
                                        <span>Инструкции</span>
                                        <img src={sublist} alt='sublist' style={{ transform: !openInstruction ? 'rotate(90deg)' : 'none' }} />
                                    </div>
                                </div> */}

                                <>

                                    <ul className={classes.selectList}>
                                        {data?.map((item, index) => (
                                            <li
                                                key={index}
                                                onClick={() => navigate(item.id)}
                                            >
                                                {item?.postName}
                                            </li>
                                        ))}
                                    </ul>
                                </>



                            </div>
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default MainPost;