import React, { useEffect, useState } from "react"
import classes from "./Projects.module.css"
import Target from "./Targets/Target"
import { useGetProjectIdQuery, useGetProjectNewQuery, useUpdateProjectMutation } from "../../BLL/projectApi"
import { useParams } from "react-router-dom"
import CustomSelectModal from "./CustomSelectModal/CustomSelectModal"
import deleteIcon from '../Custom//icon/icon _ delete.svg'
import Header from "../Custom/Header/Header"
import HandlerMutation from "../Custom/HandlerMutation"
import { formattedDate, resizeTextarea, transformArraiesForUpdate } from "../../BLL/constans"
import editIcon from '../Custom/icon/icon _ edit.svg'
import { current } from "@reduxjs/toolkit"

export default function NewProject() {
  const { userId, projectId } = useParams();
  const [edit, setEdit] = useState(false)
  const [dummyKey, setDummyKey] = useState(0)
  const [isRemoveProject, setIsRemoveProject] = useState(false)

  const [projectName, setProjectName] = useState('')
  const [selectedOrg, setSelectedOrg] = useState()
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [filtredPrograms, setFilterPrograms] = useState([])
  const [filtredStrategies, setFilterStrategies] = useState([])

  const [descriptionProject, setDescriptionProject] = useState('')
  const [productsArray, setProductsArray] = useState([])
  const [eventArray, setEventArray] = useState([])
  const [rulesArray, setRulesArray] = useState([])
  const [simpleArray, setSimpleArray] = useState([])
  const [statisticsArray, setStatisticsArray] = useState([])

  const [productsList, setProductsList] = useState([])
  const [eventList, setEventList] = useState([])
  const [rulesList, setRulesList] = useState([])
  const [simpleList, setSimpleList] = useState([])
  const [statisticsList, setStatisticsList] = useState([])

  const [selectedWorker, setSelectedWorker] = useState('')
  const [targetState, setTargetState] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [targetIndex, setTargetIndex] = useState()
  const [targetContent, setTargetContent] = useState('')
  const [targetType, setTargetType] = useState('')

  const TARGET_TYPES = {
    'Правила': 'rules',
    'Продукт': 'products',
    'Статистика': 'statistics',
    'Обычная': 'simple',
    'Организационные мероприятия': 'event',
    'ПравилаNEW': 'rulesNEW',
    'ПродуктNEW': 'productsNEW',
    'СтатистикаNEW': 'statisticsNEW',
    'ОбычнаяNEW': 'simpleNEW',
    'Организационные мероприятияNEW': 'eventNEW',
  };

  const SWITCH_TYPE = {
    'Правила': 'Правила',
    'Продукт': 'Продукт',
    'Статистика': 'Статистика',
    'Обычная': 'Обычная',
    'Организационные мероприятия': 'Организационные мероприятия',
    'ПравилаNEW': 'Правила',
    'ПродуктNEW': 'Продукт',
    'СтатистикаNEW': 'Статистика',
    'ОбычнаяNEW': 'Обычная',
    'Организационные мероприятияNEW': 'Организационные мероприятия',
  }

  const ADD_TARGET = {
    rules: { array: rulesArray, setFunction: setRulesArray },
    products: { array: productsArray, setFunction: setProductsArray },
    statistics: { array: statisticsArray, setFunction: setStatisticsArray },
    simple: { array: simpleArray, setFunction: setSimpleArray },
    event: { array: eventArray, setFunction: setEventArray },
    rulesNEW: { array: rulesList, setFunction: setRulesList },
    productsNEW: { array: productsList, setFunction: setProductsList },
    statisticsNEW: { array: statisticsList, setFunction: setStatisticsList },
    simpleNEW: { array: simpleList, setFunction: setSimpleList },
    eventNEW: { array: eventList, setFunction: setEventList },
  };

  const {
    currentProject = [],
    targets = [],
  } = useGetProjectIdQuery({ userId, projectId }, {
    selectFromResult: ({ data }) => ({
      currentProject: data?.currentProject,
      targets: data?.targets,
    })
  })

  const {
    organizations = [],
    programs = [],
    strategies = [],
    workers = []
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      organizations: data?.organizations,
      programs: data?.programs,
      strategies: data?.strategies,
      workers: data?.workers,
    }),
  });

  const [
    updateProject, {
      isLoading: isLoadingUpdateProjectMutation,
      isSuccess: isSuccessUpdateProjectMutation,
      isError: isErrorUpdateProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation()

  const reset = () => {


  }

  useEffect(() => {
    if (isSuccessUpdateProjectMutation) {
      setTimeout(window.location.reload(), 1000)
    }
  }, [isSuccessUpdateProjectMutation])

  useEffect(() => { // фильтр Стратегий по организации
    if (strategies.length > 0) {
      const filter = strategies.filter(strategy => strategy?.organization?.id === selectedOrg)
      setFilterStrategies(filter)
      // setSelectedStrategy('')
    }
  }, [strategies, selectedOrg])

  useEffect(() => { // фильтр Программ по организации
    if (programs.length > 0) {
      const filtredPrograms = programs.filter(program => program?.organization?.id === selectedOrg)
      setFilterPrograms(filtredPrograms)
      // setSelectedProgram('')
    }
  }, [programs, selectedOrg])

  useEffect(() => { // формирование массивов на основе targets
    if (targets.length > 0 && productsArray.length < 1 && rulesArray.length < 1 && eventArray.length < 1 && simpleArray.length < 1 && statisticsArray.length < 1) {
      targets.forEach((item) => {
        // const newElement = {
        //   _id : item?.id,
        //   content : item?.content,
        //   dateStart: item?.dateStart,
        //   deadline: item?.deadline,
        //   status: item?.status,

        // }
        // newElement?._id = item.id
        switch (item.type) {
          case 'Продукт':
            setProductsArray((prevState) => ([...prevState, item]))
            break;
          case 'Правила':
            setRulesArray((prevState) => ([...prevState, item]))
            break;
          case 'Организационные мероприятия':
            setEventArray((prevState) => ([...prevState, item]))
            break;
          case 'Обычная':
            setSimpleArray((prevState) => ([...prevState, item]))
            break;
          case 'Статистика':
            setStatisticsArray((prevState) => ([...prevState, item]))
            break;
          default:
            break
        }
      })
    }
  }, [targets])

  console.log('массивчики   ', productsArray, rulesArray, eventArray, simpleArray, statisticsArray)
  useEffect(() => { // предустановка значений при загрузке страницы
    if (currentProject.projectName) {
      setProjectName(currentProject.projectName)
    }
    if (currentProject?.organization?.id) {
      setSelectedOrg(currentProject?.organization.id)
    }
    if (currentProject?.programId) {
      setSelectedProgram(currentProject.programId)
    }
    if (currentProject?.strategy?.id) {
      setSelectedStrategy(currentProject.strategy.id)
    }
    if (currentProject?.content) {
      setDescriptionProject(currentProject?.content)
    }
  }, [currentProject])


  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      if (targetIndex < array.length) {
        const updatedArray = [...array];
        const updatedItem = { ...updatedArray[targetIndex], content: targetContent };
        updatedArray[targetIndex] = updatedItem;
        setFunction(updatedArray);
      }
    }
  }, [targetContent]);

  useEffect(() => {
    if (targetType && deadlineDate !== null) {
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], deadline: deadlineDate }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
      setDeadlineDate(null)
    }
  }, [deadlineDate])

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], holderUserId: selectedWorker }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
    }
  }, [selectedWorker])

  useEffect(() => {
    resizeTextarea('1')
  }, [descriptionProject])

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], targetState: targetState }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
    }
  }, [targetState])

  const targetFormation = (index, type) => {
    setTargetIndex(index)
    setTargetType(TARGET_TYPES[type])
  }

  const deleteTarget = (array) => {
    if (array && Array.isArray(array)) {
      array.pop();
    }
    setDummyKey((prevState) => prevState + 1)
  }

  const addTarget = (type) => {
    console.log('click')
    if (edit) {
      setTargetType(null)
      const targetType = TARGET_TYPES[type]
      const { array, setFunction } = ADD_TARGET[targetType]

      const newIndex = array.length + 1;
      const newTarget = {
        // id: new Date(),
        type: SWITCH_TYPE[type],
        orderNumber: newIndex,
        content: "",
        holderUserId: workers[0].id,
        deadline: ""
      };
      setTargetIndex(newIndex);
      setFunction(prevState => [...prevState, newTarget]);
    }
    // setTargetIndex(newIndex);
  }

  const setProgaramForProject = (value) => {
    setSelectedProgram(value)
    const currentStrategy = programs?.find(program => program.id === value)
    console.log(currentStrategy)
    if (currentStrategy)
      setSelectedStrategy(currentStrategy.strategy.id)
    else
      setSelectedStrategy('')
  }

  useEffect(() => {
    if (isRemoveProject) {
      saveProject()
    }
  }, [isRemoveProject])

  const saveProject = async () => {

    const updatedProducts = transformArraiesForUpdate(productsArray)
    const updatedRules = transformArraiesForUpdate(rulesArray)
    const updatedEvent = transformArraiesForUpdate(eventArray)
    const updatedStatistics = transformArraiesForUpdate(statisticsArray)
    const updatedSimple = transformArraiesForUpdate(simpleArray)
    console.log(productsArray, rulesArray)

    const Data = {}

    if (!edit) {
      Data.targetUpdateDtos = [
        ...updatedSimple,
        ...updatedProducts,
        ...updatedEvent,
        ...updatedRules,
        ...updatedStatistics
      ]
    }
    else {
      if ((projectName !== currentProject.projectName) && projectName) {
        Data.projectName = projectName
      }
      // if ((selectedOrg !== currentProject?.organization?.id) && selectedOrg) {
      //   Data.organizationId = selectedOrg
      // }
      if ((selectedProgram !== currentProject?.programId) && selectedProgram !== null) {
        Data.programId = selectedProgram
      }
      if ((selectedStrategy !== currentProject?.strategy?.id) && selectedStrategy !== null) {
        Data.strategyId = selectedStrategy
      }
      if ((descriptionProject !== currentProject?.content) && descriptionProject) {
        Data.content = descriptionProject
      }
      if (
        rulesList.length > 0 ||
        productsList.length > 0 ||
        statisticsList.length > 0 ||
        simpleList.length > 0 ||
        eventList.length > 0
      ) {
        Data.targetCreateDtos = [
          ...rulesList,
          ...productsList,
          ...statisticsList,
          ...simpleList,
          ...eventList,
        ];
      }
      Data.targetUpdateDtos = [
        ...updatedSimple,
        ...updatedProducts,
        ...updatedEvent,
        ...updatedRules,
        ...updatedStatistics
      ]
    }
    console.log(Data)

    console.log(Data)
    await updateProject({
      userId,
      projectId,
      _id: projectId,
      ...Data,
    })
      .unwrap()
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });
  }
  // console.log(currentProject)
  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header create={false} title={'Редактировать проект'}></Header>
        </>
        <div className={classes.body}>
          <>
            <div className={classes.selectedType}>
              {edit ? (
                <input
                  type="text"
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                />
              ) : (
                <>
                  {currentProject.projectName}
                </>
              )}
              <img src={editIcon} alt="" onClick={() => setEdit(!edit)} />
            </div>

            <div
              className={classes.bodyContainer}
            >
              <div className={classes.name}>Организация</div>
              {/* {edit ? (
                <div className={classes.selectSection}>
                  <select name="selectOrg" value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} >
                    {organizations.map((item, index) => (
                      <>
                        <option key={index} value={item.id}>{item.organizationName}</option>
                      </>
                    ))}
                  </select>
                </div>
              ) : ( */}
              <div className={classes.title}>
                {currentProject?.organization?.organizationName}
              </div>
              {/* )} */}
            </div>
            {(edit || currentProject.programId) &&
              (
                <div
                  className={classes.bodyContainer}
                >
                  <div className={classes.name}>Программа</div>
                  {edit ? (
                    <div className={classes.selectSection}>
                      <select name="selectProgram" value={selectedProgram} onChange={(e) => setProgaramForProject(e.target.value)}>
                        <option value={null}>-</option>
                        {filtredPrograms.map((item, index) => (
                          <option key={index} value={item.id}>{item.projectName}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className={classes.title}>
                      Программа №{currentProject?.programNumber}
                    </div>
                  )}
                </div>
              )}

            {(edit || currentProject?.strategy?.id) && (
              <div
                className={classes.bodyContainer}
              >
                <div className={classes.name}>Стратегия</div>
                {edit ? (
                  <div className={classes.selectSection}>
                    <select name="selectProgram" value={selectedStrategy} onChange={(e) => setSelectedStrategy(e.target.value)}>
                      <option value={null}>-</option>
                      {filtredStrategies.map((item, index) => (
                        <option value={item.id}> Стратегия №{item.strategyNumber}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className={classes.title}>
                    Стратегия №{currentProject?.strategy?.strategyNumber}
                  </div>
                )}
              </div>
            )}
          </>
          <>
            <div className={classes.targetsContainer}>

              {(currentProject?.content || edit) && (
                <>
                  <div className={classes.sectionName}>Описание</div>
                  <div className={classes.targetsFlex}>
                    <div className={classes.descriptionFlex}>
                      <div className={classes.descriptionContainer}>
                        <textarea
                          name="description"
                          id="1"
                          disabled={!edit}
                          placeholder="Введите описание проекта..."
                          value={descriptionProject}
                          onChange={(e) => {
                            setDescriptionProject(e.target.value)
                            setTimeout(resizeTextarea('1'), 0)
                          }}
                        >
                        </textarea>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(productsArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName}  >Продукт</div>
                  <div className={classes.targetsFlex}>
                    {productsArray.filter(item => item.targetState !== 'Отменена').map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Продукт')}>
                        <Target
                          id={item.id}
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          targetsList={targets}
                          selectedWorker={selectedWorker}
                          deadlineDate={deadlineDate}
                          setTargetState={setTargetState}
                          requestFunc={setIsRemoveProject}
                        >
                        </Target>
                      </div>
                    ))}
                    {edit &&
                      (
                        <>
                          {productsList.map((item, index) => (
                            <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'ПродуктNEW')}>
                              <Target
                                item={item}
                                isNew={true}
                                contentSender={setTargetContent}
                                workersList={workers}
                                setSelectedWorker={setSelectedWorker}
                                setDeadlineDate={setDeadlineDate}
                              ></Target>
                            </div>
                          ))}
                          {productsList.length > 0 && (
                            <div className={classes.deleteContainer} onClick={() => deleteTarget(productsList)}>
                              Удалить
                              <img src={deleteIcon} alt="delete" />
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </>
              )}
              {(eventArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('Организационные мероприятияNEW')}>Организационные мероприятия</div>
                  <div className={classes.targetsFlex}>
                    {eventArray.filter(item => item.targetState !== 'Отменена').map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Организационные мероприятия')}>
                        <Target
                          id={item.id}
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          targetsList={targets}
                          selectedWorker={selectedWorker}
                          deadlineDate={deadlineDate}
                          setTargetState={setTargetState}>
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <>
                        {eventList.map((item, index) => (
                          <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Организационные мероприятияNEW')}>
                            <Target
                              item={item}
                              isNew={true}
                              contentSender={setTargetContent}
                              workersList={workers}
                              setSelectedWorker={setSelectedWorker}
                              setDeadlineDate={setDeadlineDate}
                            ></Target>
                          </div>
                        ))}
                        {eventList.length > 0 && (
                          <div className={classes.deleteContainer} onClick={() => deleteTarget(eventList)}>
                            Удалить
                            <img src={deleteIcon} alt="delete" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}

              {(rulesArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('ПравилаNEW')}>Правила</div>
                  <div className={classes.targetsFlex}>
                    {rulesArray.filter(item => item.targetState !== 'Отменена').map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Правила')}>
                        <Target id={item.id}
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          targetsList={targets}
                          selectedWorker={selectedWorker}
                          deadlineDate={deadlineDate}
                          setTargetState={setTargetState}>
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <>
                        {rulesList.map((item, index) => (
                          <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'ПравилаNEW')}>
                            <Target
                              item={item}
                              isNew={true}
                              contentSender={setTargetContent}
                              workersList={workers}
                              setSelectedWorker={setSelectedWorker}
                              setDeadlineDate={setDeadlineDate}
                            ></Target>
                          </div>
                        ))}
                        {rulesList.length > 0 && (
                          <div className={classes.deleteContainer} onClick={() => deleteTarget(rulesList)}>
                            Удалить
                            <img src={deleteIcon} alt="delete" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}


              {(simpleArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('ОбычнаяNEW')}>Задачи</div>
                  <div className={classes.targetsFlex}>
                    {simpleArray.map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Обычная')}>
                        <Target id={item.id}
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          selectedWorker={selectedWorker}
                          deadlineDate={deadlineDate}
                          setTargetState={setTargetState}>
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <>
                        {simpleList.map((item, index) => (
                          <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'ОбычнаяNEW')}>
                            <Target
                              item={item}
                              isNew={true}
                              contentSender={setTargetContent}
                              workersList={workers}
                              setSelectedWorker={setSelectedWorker}
                              setDeadlineDate={setDeadlineDate}
                            ></Target>
                          </div>
                        ))}
                        {simpleList.length > 0 && (
                          <div className={classes.deleteContainer} onClick={() => deleteTarget(simpleList)}>
                            Удалить
                            <img src={deleteIcon} alt="delete" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}


              {(statisticsArray.length > 0 || edit) && (
                <>
                  <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('СтатистикаNEW')}> Метрика</div>
                  <div className={classes.targetsFlex}>
                    {statisticsArray.filter(item => item.targetState !== 'Отменена').filter(item => item.targetState !== 'Отменена').map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Статистика')}>
                        <Target
                          id={item.id}
                          item={item}
                          isNew={false}
                          edit={edit ? true : false}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}
                          targetsList={targets}
                          selectedWorker={selectedWorker}
                          deadlineDate={deadlineDate}
                          setTargetState={setTargetState}
                        >
                        </Target>
                      </div>
                    ))}
                    {edit && (
                      <>
                        {statisticsList.map((item, index) => (
                          <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'СтатистикаNEW')}>
                            <Target
                              item={item}
                              isNew={true}
                              contentSender={setTargetContent}
                              workersList={workers}
                              setSelectedWorker={setSelectedWorker}
                              setDeadlineDate={setDeadlineDate}
                            ></Target>
                          </div>
                        ))}
                        {statisticsList.length > 0 && (
                          <div className={classes.deleteContainer} onClick={() => deleteTarget(statisticsList)}>
                            Удалить
                            <img src={deleteIcon} alt="delete" />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </>

        </div>


        <>
          <footer className={classes.inputContainer}>
            <div className={classes.inputRow2}>
              <div></div>
              <div>
                <button
                  onClick={() => saveProject()}
                >
                  СОХРАНИТЬ
                </button>
              </div>
              <div>

              </div>
            </div>
          </footer>
        </>

      </div>

      {/* {modalOpen && <CustomSelectModal setModalOpen={setModalOpen} projects={projects} workers={workers} selectedProject={selectedProject} setSelectedProject={setSelectedProject} setParentFilteredProjects={setFiltredProjects}></CustomSelectModal>}
 */}     <HandlerMutation
        Loading={isLoadingUpdateProjectMutation}
        Error={isErrorUpdateProjectMutation}
        Success={isSuccessUpdateProjectMutation}
        textSuccess={"Проект успешно обновлён."}
        textError={
          Error?.data?.errors?.[0]?.errors?.[0]
            ? Error.data.errors[0].errors[0]
            : Error?.data?.message
        }
      ></HandlerMutation>
    </>
  );
}
