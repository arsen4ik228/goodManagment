import React, {useEffect, useState} from 'react';
import classes from "./NewPolicy.module.css";
import Header from "../Custom/Header/Header";
import search from "./icon/icon _ search.svg";
import MyEditor from "../Custom/Editor/MyEditor";
import searchBlack from "./icon/icon _ black_search.svg";
import add from "./icon/icon _ add2-b.svg";
import share from "./icon/icon _ share.svg";
import SearchModal from "../Custom/SearchModal/SearchModal";
import {useNavigate, useParams} from "react-router-dom";
import {convertToRaw, EditorState} from "draft-js";
import {useGetPoliciesNewQuery, usePostPoliciesMutation} from "../../BLL/policyApi";
import draftToHtml from "draftjs-to-html";
import CustomSelect from "../Custom/CustomSelect/CustomSelect";
import HandlerMutation from "../Custom/HandlerMutation";

function NewPolicy(props) {

    const {userId} = useParams()
    const navigate = useNavigate()
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [valueType, setValueType] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectPolicyId, setSelectPolicyId] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [htmlContent, setHtmlContent] = useState();
    const [type, setType] = useState('');
    const [policyToOrganizations, setPolicyToOrganizations] = useState([]);

    const {
        organizations = [],
        isLoadingNewPolicies,
        isErrorNewPolicies,
    } = useGetPoliciesNewQuery(userId, {
        selectFromResult: ({ data, isLoading, isError }) => ({
            organizations: data?.organizations || [], // Если нет данных или organizations, вернем пустой массив
            isLoadingNewPolicies: isLoading,
            isErrorNewPolicies: isError,
        }),
    });

    const [
        postPolicy,
        {
            isLoading: isLoadingPostPoliciesMutation,
            isSuccess: isSuccessPostPoliciesMutation,
            isError: isErrorPostPoliciesMutation,
            error: ErrorPostPoliciesMutation,
        },
    ] = usePostPoliciesMutation();

    const reset = () => {
        setTimeout(() => {
            navigate(-1);
        }, 1800);
    };
    const savePolicy = async () => {
        await postPolicy({
            userId,
            policyName: inputValue,
            state: "Черновик",
            type: type,
            content: htmlContent,
            policyToOrganizations: policyToOrganizations,
        })
            .unwrap()
            .then(() => {
                reset();
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };
    useEffect(() => {
        (valueType === '2') ? setType('Инструкция') : setType('Директива');
    },[valueType, type])

    useEffect(() => {
        const rawContent = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        setHtmlContent(rawContent);
    }, [editorState]);

    const buttonClick = () => {
        setModalOpen(true)
    }

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header create={false} title={'Создание Политики'}></Header>
                </>
                <div className={classes.inputRow1}>
                    <div className={classes.first}>
                        <input value={inputValue} type={'text'} onChange={(e) => setInputValue(e.target.value)} />
                        {/*<img src={search} onClick={openModal}/>*/}
                    </div>
                    <div className={classes.second}>
                        <select value={valueType} onChange={(e) => setValueType(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value='1'> Директива</option>
                            <option value='2'> Инструкция</option>
                        </select>
                    </div>
                </div>

                <div className={classes.body}>
                    <>
                        <MyEditor
                            editorState={editorState}
                            setEditorState={setEditorState}
                            policyContent={true}

                        />
                    </>
                </div>

                <footer className={classes.inputContainer}>
                    <div className={classes.inputColumn}>
                        <div className={classes.inputRow2}>
                            <button onClick={()=>buttonClick()}> СОЗДАТЬ </button>
                        </div>
                    </div>
                </footer>
            </div>

            <HandlerMutation
                Loading={isLoadingNewPolicies}
                Error={isErrorNewPolicies}
                Success={isSuccessPostPoliciesMutation}
                textSuccess={"Политика успешно создана."}
                textError={ErrorPostPoliciesMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>

            {isModalOpen &&

                <CustomSelect
                    organizations={organizations}
                    isToOrganizations={policyToOrganizations}
                    setToOrganizations={setPolicyToOrganizations}
                    setModalOpen={setModalOpen}
                    requestFunc={savePolicy}
                ></CustomSelect>
            }        </>
    );
}

export default NewPolicy;