import React, { useEffect, useState } from "react";
import classes from "./NewProject.module.css";
import Target from "../Targets/Target";
import { useGetProjectNewQuery, usePostProjectMutation } from "../../../BLL/projectApi";
import { useParams } from "react-router-dom";
import CustomSelect from "../../Custom/CustomSelect/CustomSelect";
import deleteIcon from '../../Custom//icon/icon _ delete.svg'
import Header from "../../Custom/Header/Header";
import HandlerMutation from "../../Custom/HandlerMutation";

export default function NewProject() {
  const { userId } = useParams();
  const [typeProject, setTypeProject] = useState(true);
  const [isToOrganization, setIsToOrganization] = useState([])
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [nameSelectedOrg, setNameSelectedOrg] = useState('')
  const [selectedWorker, setSelectedWorker] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const [dummyKey, setDummyKey] = useState(0)
  const [rulesArray, setRulesArray] = useState([])
  const [productsArray, setProductsArray] = useState([])
  const [statisticsArray, setStatisticsArray] = useState([])
  const [simpleArray, setSimpleArray] = useState([])

  const [targetIndex, setTargetIndex] = useState()
  const [targetContent, setTargetContent] = useState('')
  const [targetType, setTargetType] = useState('')


  const TARGET_TYPES = {
    Правила: 'rules',
    Продукт: 'products',
    Статистика: 'statistics',
    Обычная: 'simple'
  };

  const ADD_TARGET = {
    rules: { array: rulesArray, setFunction: setRulesArray },
    products: { array: productsArray, setFunction: setProductsArray },
    statistics: { array: statisticsArray, setFunction: setStatisticsArray },
    simple: { array: simpleArray, setFunction: setSimpleArray }
  };

  console.log(rulesArray, productsArray, statisticsArray, simpleArray)
  // console.log(isToOrganization)
  const {
    workers = [],
    organizations = [],
    programsWithoutProject = [],
    strategies = [],
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      programsWithoutProject: data?.programsWithoutProject,
      organizations: data?.organizations,
      strategies: data?.strategies,
      workers: data?.workers,
    }),
  });
  // console.log(
  //   "workers",
  //   workers,
  //   "organization",
  //   organizations,
  //   "programsWithoutProject",
  //   programsWithoutProject,
  //   "strategies",
  //   strategies
  // );

  const [
    postProject,
    {
      isLoading: isLoadingProjectMutation,
      isSuccess: isSuccessProjectMutation,
      isError: isErrorProjectMutation,
      error: Error,
    },
  ] = usePostProjectMutation();

  useEffect(() => {
    const organization = organizations.find(org => org.id == isToOrganization);
    setNameSelectedOrg(organization?.organizationName)
  }, [isToOrganization, organizations])

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      if (targetIndex < array.length) {
        array[targetIndex].content = targetContent
      }
    }
  }, [targetContent])

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      array[targetIndex].deadline = deadlineDate
    }
  }, [deadlineDate])

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      array[targetIndex].holderUserId = selectedWorker
    }
  }, [selectedWorker])

  const addTarget = (type) => {
    setTargetType(null)
    const targetType = TARGET_TYPES[type]
    const { array, setFunction } = ADD_TARGET[targetType]

    const newIndex = array.length + 1;
    const newTarget = {
      id: new Date(),
      type: type,
      orderNumber: newIndex,
      content: "",
      holderUserId: workers[0].id,
      deadline: ""
    };
    setTargetIndex(newIndex);
    setFunction(prevState => [...prevState, newTarget]);
    // setTargetIndex(newIndex);
  }

  const deleteTarget = (array) => {
    if (array && Array.isArray(array)) {
      array.pop();
    }
    setDummyKey((prevState) => prevState + 1)
  }

  const targetFormation = (index, type) => {
    setTargetIndex(index)
    setTargetType(TARGET_TYPES[type])
  }

  const switchType = (id) => {
    if (typeProject && id === 0 || !typeProject && id === 1) {
      setTypeProject(!typeProject);
    }
  }

  const closeOrgModal = () => {
    console.log('organization change')
  }

  const reset = () => { }

  const saveProject = async () => {

    const Data = {}

    typeProject ? Data.type = 'Программа' : Data.type = 'Проект'
    if (isToOrganization) {
      Data.organizationId = isToOrganization[0]
    }
    if (selectedProgram) {
      Data.programId = selectedProgram
    }
    if (
      rulesArray.length > 0 ||
      productsArray.length > 0 ||
      statisticsArray.length > 0 ||
      simpleArray.length > 0
    ) {
      Data.targetCreateDtos = [
        ...rulesArray,
        ...productsArray,
        ...statisticsArray,
        ...simpleArray,
      ];
    }
    console.log(Data)
    await postProject({
      userId,
      ...Data,
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2)); // выводим детализированную ошибку
      });

  }

  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header create={false} title={typeProject ? 'Создание новой программы' : 'Создание нового проекта'}></Header>
        </>
        <div className={classes.body}>
          <>
            <div className={classes.Type}>
              <div
                className={
                  typeProject ? classes.TitleType : classes.selectedType
                }
                onClick={() => switchType(0)}
              >
                Проект
              </div>
              <div
                className={
                  typeProject ? classes.selectedType : classes.TitleType
                }
                onClick={() => switchType(1)}
              >
                Программа
              </div>
            </div>
            {!typeProject && (
              <div
                className={classes.bodyContainer}
                style={{ borderBottom: "1px solid grey" }}
              >
                <div className={classes.name}>Программа</div>
                <div className={classes.selectSection}>
                  <select name="selectProgram" id="1" onChange={(e) => setSelectedProgram(e.target.value)}>
                    <option value="">-</option>
                    {programsWithoutProject.map((item,index) => (
                      <option key={index} value={item.id} >Программма №{item.projectNumber}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Организация</div>
              <div className={classes.OrgSection}>
                <div className={nameSelectedOrg ? 'none' : classes.OrgName} onClick={() => setModalOpen(true)}>
                  {isToOrganization.length > 0 ? `${nameSelectedOrg}` : 'Не выбрано'}
                </div>
              </div>
            </div>
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Стратегия</div>
              <div className={classes.selectSection}>
                <select name="selectProgram" id="1">
                  {strategies.map((item, index) => (
                    <option key={index} value={item.id}>Стратегия №{item.strategyNumber}</option>
                  ))}
                </select>

              </div>
            </div>
          </>
        </div>
        <>
          <div className={classes.targetsContainer}>
            <div className={classes.sectionName} onClick={() => addTarget('Правила')}>Правила</div>
            <div className={classes.targetsFlex}>
              {rulesArray.map((item, index) => (
                <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Правила')}>
                  <Target id={item.id} isNew={true} contentSender={setTargetContent} workersList={workers} setSelectedWorker={setSelectedWorker} setDeadlineDate={setDeadlineDate}></Target>
                </div>
              ))}
              {rulesArray.length > 0 && (
                <div className={classes.deleteContainer} onClick={() => deleteTarget(rulesArray)}>
                  Удалить
                  <img src={deleteIcon} alt="delete" />
                </div>
              )}
            </div>

            <div className={classes.sectionName} onClick={() => addTarget('Продукт')}>Продукт</div>
            <div className={classes.targetsFlex}>
              {productsArray.map((item, index) => (
                <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Продукт')}>
                  <Target id={item.id} isNew={true} contentSender={setTargetContent} workersList={workers} setSelectedWorker={setSelectedWorker} setDeadlineDate={setDeadlineDate}></Target>
                  </div>
              ))}
              {productsArray.length > 0 && (
                <div className={classes.deleteContainer} onClick={() => deleteTarget(productsArray)}>
                  Удалить
                  <img src={deleteIcon} alt="delete" />
                </div>
              )}
            </div>

            <div className={classes.sectionName} onClick={() => addTarget('Статистика')}>Статистика</div>
            <div className={classes.targetsFlex}>
              {statisticsArray.map((item, index) => (
                <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Статистика')}>
                  <Target id={item.id} isNew={true} contentSender={setTargetContent} workersList={workers} setSelectedWorker={setSelectedWorker} setDeadlineDate={setDeadlineDate}></Target>
                  </div>
              ))}
              {statisticsArray.length > 0 && (
                <div className={classes.deleteContainer} onClick={() => deleteTarget(statisticsArray)}>
                  Удалить
                  <img src={deleteIcon} alt="delete" />
                </div>
              )}
            </div>

            <div className={classes.sectionName} onClick={() => addTarget('Обычная')}>Обычная</div>
            <div className={classes.targetsFlex}>
              {simpleArray.map((item, index) => (
                <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Обычная')}>
                  <Target id={item.id} isNew={true} contentSender={setTargetContent} workersList={workers} setSelectedWorker={setSelectedWorker} setDeadlineDate={setDeadlineDate}></Target>
                  </div>
              ))}
              {simpleArray.length > 0 && (
                <div className={classes.deleteContainer} onClick={() => deleteTarget(simpleArray)}>
                  Удалить
                  <img src={deleteIcon} alt="delete" />
                </div>
              )}
            </div>

          </div>
        </>
        <>
          <footer className={classes.inputContainer}>
            <div className={classes.inputRow2}>
              <div></div>
              <div>
                <button onClick={saveProject}> СОХРАНИТЬ</button>
              </div>
              <div>
                {/* <img src={searchBlack} /> */}
                {/*<img src={policy} className={classes.image}/>*/}
                {/*<img src={stats}/>*/}
              </div>
            </div>
          </footer>
        </>
      </div>

      {modalOpen && <CustomSelect requestFunc={closeOrgModal} isToOrganizations={isToOrganization} setToOrganizations={setIsToOrganization} organizations={organizations} setModalOpen={setModalOpen} ></CustomSelect>}
      <HandlerMutation
        Loading={isLoadingProjectMutation}
        Error={isErrorProjectMutation}
        Success={isSuccessProjectMutation}
        textSuccess={"Проект успешно создан."}
        textError={
          Error?.data?.errors?.[0]?.errors?.[0] 
            ? Error.data.errors[0].errors[0] 
            : Error?.data?.message
        }
      ></HandlerMutation>
    </>
  );
}
