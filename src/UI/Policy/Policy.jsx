import React, {useEffect, useState} from 'react';
import MyEditor from "../Custom/Editor/MyEditor";
import backRow from './icon/icon _ back.svg'
import menu from './icon/icon _ menu.svg'
import classes from './Policy.module.css';
import search from './icon/icon _ search.svg'
import searchBlack from './icon/icon _ black_search.svg'
import add from './icon/icon _ add2-b.svg'
import share from './icon/icon _ share.svg'
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html"; // Импортируем конвертер
import { convertToRaw } from "draft-js";
import {
    useGetPoliciesQuery,
    useGetPoliciesIdQuery,
    useUpdatePoliciesMutation,
} from "../../BLL/policyApi";
import SearchModal from "../Custom/SearchModal/SearchModal";
// import draftToHtml from "draftjs-to-html";
import draftjs from 'draft-js';
import {useNavigate, useParams} from "react-router-dom";
import Header from "../Custom/Header/Header";
import CustomSelect from "../Custom/CustomSelect/CustomSelect";
import HandlerMutation from "../Custom/HandlerMutation";
import PolicySearchModal from "./PolicySearchModal/PolicySearchModule"


const Policy = () => {

    const {userId} = useParams()
    const navigate = useNavigate()
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [valueType, setValueType] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectPolicyId, setSelectPolicyId] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [htmlContent, setHtmlContent] = useState();
    const [policyToOrganizations, setPolicyToOrganizations] = useState([]);
    const [extractedOrganizations, setExtractedOrganizations] = useState([]);
    const [ModalOrgOpen, setModalOrgOpen] = useState(false);

    const {
        instructions = [],
        directives = [],
        isLoadingGetPolicies,
        isErrorGetPolicies,
        isFetchingGetPolicies
    } = useGetPoliciesQuery(userId, {
        selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
            isLoadingGetPolicies: isLoading,
            isErrorGetPolicies: isError,
            isFetchingGetPolicies: isFetching,
            instructions: data?.instructions || [],
            directives: data?.directives || [],
        }),
    });

    const {
        currentPolicy = {},
        organizations = [],
        isLoadingGetPoliciesId,
        isFetchingGetPoliciesId,
        isErrorGetPoliciesId,
    } = useGetPoliciesIdQuery(
        { userId, policyId: selectPolicyId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentPolicy: data?.currentPolicy || {},
                organizations: data?.organizations || [],
                isLoadingGetPoliciesId: isLoading,
                isErrorGetPoliciesId: isError,
                isFetchingGetPoliciesId: isFetching,
            }),
            skip: !selectPolicyId,
        }
    );
    const [
        updatePolicy,
        {
            isLoading: isLoadingUpdatePoliciesMutation,
            isSuccess: isSuccessUpdatePoliciesMutation,
            isError: isErrorUpdatePoliciesMutation,
            error: ErrorUpdatePoliciesMutation,
        },
    ] = useUpdatePoliciesMutation();



    const saveUpdatePolicy = async () => {
        console.log( userId,selectPolicyId,userId,currentPolicy.policyName,currentPolicy.state,currentPolicy.type,currentPolicy.policyToOrganizations)
        await updatePolicy({
            policyId: selectPolicyId,
            userId: userId,
            _id: selectPolicyId,
            policyName: inputValue,
            state: currentPolicy.state,
            type: valueType,
            content: htmlContent,
            policyToOrganizations: policyToOrganizations,

        })
            .unwrap()
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
            });
    };

    useEffect(() => {
        setInputValue(currentPolicy.policyName);
        currentPolicy.type === 'Инструкция' ? setValueType('Инструкция') : setValueType('Директива');
    },[selectPolicyId,currentPolicy.policyName,currentPolicy.type])

    useEffect(() => {
        setExtractedOrganizations(currentPolicy.policyToOrganizations?.map(item => item.organization))
    }, [currentPolicy.policyToOrganizations,]);

    useEffect(() => {
        setPolicyToOrganizations(extractedOrganizations?.map(item => item.id))
    },[extractedOrganizations])

    useEffect(() => {
        const rawContent = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        setHtmlContent(rawContent);
    }, [editorState]);

    useEffect(() => {
        if (currentPolicy.content) {
            const { contentBlocks, entityMap } = convertFromHTML(
                currentPolicy.content
            );
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
                entityMap
            );
            const oldEditorState = EditorState.createWithContent(contentState);
            setEditorState(oldEditorState);
        }
    }, [currentPolicy.content]);

    useEffect(() => {
        const firstInstructionId = instructions.length > 0 ? instructions[0].id : null;
        setSelectPolicyId(firstInstructionId);
    }, [instructions]);


    const openModal = () => {
        setModalOpen(true);
        console.log(isModalOpen)
    }
    const openOrgModal = () => {
        setModalOrgOpen(true)
    }
    return (
        <>
        <div className={classes.wrapper}>

            <>
             <Header create={true} title={'Политики'}></Header>
            </>

            <div className={classes.inputRow1}>
                <div className={classes.first}>
                    <input value={inputValue} type={'text'} onChange={(e) => setInputValue(e.target.value)} />
                    <img src={search} onClick={openModal}/>
                </div>
                <div className={classes.second}>
                    <select value={valueType} onChange={(e) => setValueType(e.target.value)}>
                        {/*<option value={''}></option>*/}
                        <option value='Директива'> Директива</option>
                        <option value='Инструкция'> Инструкция</option>
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
                <div className={classes.inputRow2}>
                    <div></div>
                    <div>
                        <button onClick={() => openOrgModal()}> Отредактировать</button>
                    </div>
                    <div>
                        <img src={searchBlack} onClick={() => navigate('CreateDirectory')} />
                        {/*<img src={policy} className={classes.image}/>*/}
                        {/*<img src={stats}/>*/}
                    </div>
                </div>
            </footer>
        </div>
            <HandlerMutation
                Loading={isLoadingUpdatePoliciesMutation}
                Error={isErrorGetPolicies}
                Success={isSuccessUpdatePoliciesMutation}
                textSuccess={"Пост успешно создан."}
                textError={ErrorUpdatePoliciesMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>
            {isModalOpen &&
                <PolicySearchModal setSelectedId={setSelectPolicyId} setModalOpen={setModalOpen} firstTitle={'Инструкции'} firstArray={instructions} secondTitle={'Директивы'} secondArray={directives} componentName={'policyName'}  /> }
            {ModalOrgOpen && <CustomSelect setModalOpen={setModalOrgOpen} organizations={organizations} requestFunc={saveUpdatePolicy} setToOrganizations={setPolicyToOrganizations} isToOrganizations={policyToOrganizations} ></CustomSelect> }
</>
);
};

export default Policy;