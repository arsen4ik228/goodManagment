import React from 'react';
import classes from './MainPost.module.css'
import { useNavigate } from "react-router-dom";
import Header from "../Custom/CustomHeader/Header";
import { useGetPostsQuery } from '../../BLL/postApi';


const MainPost = () => {

    const navigate = useNavigate()

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
                    <Header onRightIcon={true} title={'Посты'}>Личный помощник</Header>

                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> Выберите Пост:</div>
                            <div className={classes.right}>
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