import React, { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Custom/Header/Header";
import CustomSelect from "../Custom/CustomSelect/CustomSelect";
import HandlerMutation from "../Custom/HandlerMutation";
import PolicySearchModal from "./PolicySearchModal/PolicySearchModule"
import AlertUpdateData from '../Custom/AlertUpdateData/AlertUpdateData';
import Mdxeditor from '../Custom/MDXEditor/Mdxeditor';


const Policy = () => {

    const { userId, policyId } = useParams()
    const navigate = useNavigate()
    const [editorState, setEditorState] = useState('');
    const [valueType, setValueType] = useState('')
    const [policyState, setPolicyState] = useState('')
    const [isModalOpen, setModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [htmlContent, setHtmlContent] = useState();
    const [policyToOrganizations, setPolicyToOrganizations] = useState();
    const [extractedOrganizations, setExtractedOrganizations] = useState([]);
    const [ModalOrgOpen, setModalOrgOpen] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false)
    const [disabled, setDisabled] = useState(false)


    const {
        currentPolicy = {},
        organizations = [],
        isLoadingGetPoliciesId,
        isFetchingGetPoliciesId,
        isErrorGetPoliciesId,
    } = useGetPoliciesIdQuery(
        { userId, policyId },
        {
            selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
                currentPolicy: data?.currentPolicy || {},
                organizations: data?.organizations || [],
                isLoadingGetPoliciesId: isLoading,
                isErrorGetPoliciesId: isError,
                isFetchingGetPoliciesId: isFetching,
            }),
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

    useEffect(() => {
        setInputValue(currentPolicy.policyName === 'Политика' ? `Политика №${currentPolicy.policyNumber}` : currentPolicy.policyName);
        currentPolicy.type === 'Инструкция' ? setValueType('Инструкция') : setValueType('Директива');
        setPolicyState(currentPolicy.state)
        if (currentPolicy.state === 'Отменён') setDisabled(true)
    }, [policyId, currentPolicy.policyName, currentPolicy.type, currentPolicy.state])

    useEffect(() => {
        setExtractedOrganizations(currentPolicy.policyToOrganizations?.map(item => item.organization))
    }, [currentPolicy.policyToOrganizations,]);

    useEffect(() => {
        setPolicyToOrganizations(extractedOrganizations?.map(item => item.id))
    }, [extractedOrganizations])

    // useEffect(() => {//Editor
    //     const rawContent = draftToHtml(
    //         convertToRaw(editorState.getCurrentContent())
    //     );
    //     setHtmlContent(rawContent);
    // }, [editorState]);

    // useEffect(() => {//Editor content
    //     if (currentPolicy.content) {
    //         const { contentBlocks, entityMap } = convertFromHTML(
    //             currentPolicy.content
    //         );
    //         const contentState = ContentState.createFromBlockArray(
    //             contentBlocks,
    //             entityMap
    //         );
    //         const oldEditorState = EditorState.createWithContent(contentState);
    //         setEditorState(oldEditorState);
    //     }
    // }, [currentPolicy.content]);
    
    const saveUpdatePolicy = async () => {
        const Data = {}
        if (inputValue !== currentPolicy.policyName) Data.policyName = inputValue
        if (policyState !== currentPolicy.state) Data.state = policyState
        if (valueType !== currentPolicy.type) Data.type = valueType
         Data.content = editorState
        if (policyToOrganizations !== currentPolicy.organization?.id) Data.policyToOrganizations = policyToOrganizations
        console.log(Data)
        if (Object.keys(Data).length > 0) {
            await updatePolicy({
                policyId: policyId,
                userId: userId,
                _id: policyId,
                ...Data,
            })
                .unwrap()
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
                });
        }
        else {
            console.log('Проверка не прошла')
            setOpenAlertModal(true)
        }
    };

    const openOrgModal = () => {
        setModalOrgOpen(true)
    }
    console.log(editorState)

    return (
        <>
            <div className={classes.wrapper}>

                <>
                    <Header create={false} title={'Политики'}></Header>
                </>

                <div className={classes.inputRow1}>

                    <div className={classes.first}>
                        <input value={inputValue} disabled={disabled} type={'text'} onChange={(e) => setInputValue(e.target.value)} />
                    </div>
                    {disabled && (
                        <div className={classes.organizationInfo}>
                            <span>Организация:</span>
                            <span>Soplya firma</span>
                        </div>
                    )}
                    <div className={classes.second}>
                        <select value={valueType} disabled={disabled} onChange={(e) => setValueType(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value='Директива'> Директива</option>
                            <option value='Инструкция'> Инструкция</option>
                        </select>
                        <select value={policyState} disabled={disabled} onChange={(e) => setPolicyState(e.target.value)}>
                            {/*<option value={''}></option>*/}
                            <option value='Черновик'>Черновик</option>
                            <option value='Активный'> Активный</option>
                            <option value='Отменён'> Отменён</option>
                        </select>
                    </div>
                </div>

                <div className={classes.body}>
                    {Object.keys(currentPolicy).length>0 && (
                        <>
                        {/* <MyEditor
                            editorState={editorState}
                            setEditorState={disabled ? '' : setEditorState}
                            policyContent={true}
                        /> */}
                        <Mdxeditor
                            key={currentPolicy?.id}
                            editorState={currentPolicy?.content}
                            setEditorState={setEditorState}
                            userId={userId}
                            isArchive={disabled}
                        >
                        </Mdxeditor>
                    </>
                )}
                </div>

                {!disabled && (
                    <footer className={classes.inputContainer}>
                        <div className={classes.inputRow2}>
                            <div>
                                <button onClick={() => openOrgModal()}> Сохранить</button>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
            <HandlerMutation
                Loading={isLoadingUpdatePoliciesMutation}
                Error={isErrorUpdatePoliciesMutation}
                Success={isSuccessUpdatePoliciesMutation}
                textSuccess={"Политика успешно сохранена."}
                textError={ErrorUpdatePoliciesMutation?.data?.errors[0]?.errors}
            ></HandlerMutation>
            {openAlertModal && <AlertUpdateData setModalOpen={setOpenAlertModal}></AlertUpdateData>}
            {ModalOrgOpen && <CustomSelect setModalOpen={setModalOrgOpen} organizations={organizations} requestFunc={saveUpdatePolicy} setToOrganizations={setPolicyToOrganizations} isToOrganizations={policyToOrganizations} ></CustomSelect>}
        </>
    );
};

export default Policy;