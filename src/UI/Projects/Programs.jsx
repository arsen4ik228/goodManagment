import React, { useEffect, useState } from "react"
import classes from "./Programs.module.css"
import Target from "./Targets/Target"
import { useGetProgramIdQuery, useGetProgramNewQuery, useUpdateProjectMutation } from "../../BLL/projectApi"
import { useNavigate, useParams } from "react-router-dom"
import CustomSelectModal from "./CustomSelectModal/CustomSelectModal"
import deleteIcon from '../Custom//icon/icon _ delete.svg'
import Header from "../Custom/Header/Header"
import HandlerMutation from "../Custom/HandlerMutation"
import { formattedDate, transformArraiesForUpdate } from "../../BLL/constans"
import editIcon from '../Custom/icon/icon _ save.svg'
import CustomSelectModalProgram from "./CustomSelectModalProgram/CustomSelectModalProgram"

export default function Programs() {
  const { userId, programId } = useParams();
  const navigate = useNavigate()
  const [edit, setEdit] = useState(false)
  const [dummyKey, setDummyKey] = useState(0)
  const [sectionId, setSectionId] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState([])
  const [filtredProjects, setFiltredProjects] = useState([])
  const [selectedProjectsForRequest, setSelectedProjectsForRequest] = useState([])

  const [projectsList, setProjectsList] = useState([])
  const [allProjects, setAllProjects] = useState([])

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
    currentProjects = [],
  } = useGetProgramIdQuery({ userId, programId }, {
    selectFromResult: ({ data }) => ({
      currentProject: data?.currentProgram,
      targets: data?.targets,
      currentProjects: data?.currentProjects,
      //   targets: data?.targets,
    })
  })
  console.log(rulesList)

  const {
    workers = [],
    projects = [],
    strategies = [],
    organizations = [],
  } = useGetProgramNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      workers: data?.workers,
      projects: data?.projects,
      strategies: data?.strategies,
      organizations: data?.organizations,
    }),
  });
  console.log(currentProjects, projects, workers)

  const [
    updateProject, {
      isLoading: isLoadingUpdateProjectMutation,
      isSuccess: isSuccessUpdateProjectMutation,
      isError: isErrorUpdateProjectMutation,
      error: Error,
    },
  ] = useUpdateProjectMutation()


  useEffect(() => {
    if ((!projectsList.length > 0) && workers.length > 0) {
      const filteredArray = currentProjects.map(project => {
        const targetWithProductType = project.targets.find(target => target.type === 'Продукт');
        console.warn(targetWithProductType?.holderUserId)
        if (targetWithProductType) {
          const worker = workers.find(worker => worker?.id === targetWithProductType?.holderUserId);
          console.warn(worker)
          return {
            id: project.id,
            nameProject: project.projectName,
            product: targetWithProductType.content,
            deadline: targetWithProductType.deadline,
            worker: worker ? worker.firstName + ' ' + worker.lastName : null,
            avatar_url: worker ? worker.avatar_url : null
          };
        }

        return {
          id: project.id,
          nameProject: project.projectName,
          product: null,
          deadline: null,
          worker: null,
          avatar_url: null
        };
      });
      setProjectsList(filteredArray)
      setAllProjects(filteredArray)
    }
  }, [currentProjects, workers])


  useEffect(() => {
    if(projects && !filtredProjects.length>0) {
      const filtredProjects = projects.filter(project => project?.organization?.id === selectedOrg)
      setFiltredProjects(filtredProjects)
    }
  }, [projects, selectedOrg])

  useEffect(() => {
      const newIds = projectsList?.map(item => item?.id);
      setSelectedProjectsForRequest(newIds);
  }, [projectsList])
  
  console.error(selectedProjectsForRequest)
  // useEffect(() => {
  //   if (currentProjects && Array.isArray(currentProjects)) {
  //     const ids = currentProjects.map(project => project.id);
  //     setSelectedProject(ids);
  //   }
  // }, [currentProjects]);


  // useEffect(() => {
  //   if (!filtredProjects || !Array.isArray(filtredProjects)) return;

  //   const projectsList = filtredProjects.filter(project => {
  //     return selectedProject.some(id => project.id === id);
  //   });

  //   setProjectsList(currentProjects);
  // }, [filtredProjects, selectedProject]);

  useEffect(() => { // фильтр Стратегий по организации
    if (strategies) {
      const filtredStrategies = strategies.filter(strategy => strategy?.organization?.id === selectedOrg)
      setFilterStrategies(filtredStrategies)
    }
  }, [strategies, selectedOrg])

  useEffect(() => { // формирование массивов на основе targets
    if (targets.length > 0 && productsArray.length < 1 && rulesArray.length < 1 && eventArray.length < 1 && simpleArray.length < 1 && statisticsArray.length < 1) {
      targets.forEach((item) => {
        switch (item.type) {
          case 'Продукт':
            setProductsArray([...productsArray, { ...item, holderUserIdchange: item.holderUserId }])
            break;
          case 'Правила':
            setRulesArray([...rulesArray, { ...item, holderUserIdchange: item.holderUserId }])
            break;
          case 'Организационные мероприятия':
            setEventArray([...eventArray, { ...item, holderUserIdchange: item.holderUserId }])
            break;
          case 'Обычная':
            setSimpleArray([...simpleArray, { ...item, holderUserIdchange: item.holderUserId }])
            break;
          case 'Статистика':
            setStatisticsArray([...statisticsArray, { ...item, holderUserIdchange: item.holderUserId }])
            break;
        }
        // setEvent(
        //   targets
        //   .filter((item) => item.type === "Организационные мероприятия")
        //   .map((item) => ({ ...item, holderUserIdchange: item.holderUserId }))
        //   .sort((a, b) => a.orderNumber - b.orderNumber)
        //   );
      })
    }
  }, [targets])

  console.log('массивчики   ', productsArray, rulesArray, eventArray, simpleArray, statisticsArray)

  useEffect(() => { // предустановка значений при загрузке страницы
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
        // Создаем копию массива и объекта для обновления
        const updatedArray = [...array];
        const updatedItem = { ...updatedArray[targetIndex], content: targetContent };

        // Обновляем элемент в массиве
        updatedArray[targetIndex] = updatedItem;

        // Обновляем массив с помощью setFunction
        setFunction(updatedArray);
      }
    }
  }, [targetContent]);

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      const updatedArray = [...array]
      const updatedItem = { ...updatedArray[targetIndex], deadline: deadlineDate }
      updatedArray[targetIndex] = updatedItem
      setFunction(updatedArray)
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
    if (targetType) {
      console.warn('ОТработка пошла')
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
    console.log('TargetFormation on click  ', targetIndex, '  ', targetType)
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
  const deleteProject = (id) => {
    console.log('id   ', id)
    setSelectedProject(prevSelectedProject =>
      prevSelectedProject.filter(project => project !== id)
    );
    console.log(selectedProject)
  };

  const reset = () => {

  }

  const saveProject = async () => {

    const updatedProducts = transformArraiesForUpdate(productsArray)
    const updatedRules = transformArraiesForUpdate(rulesArray)
    const updatedEvent = transformArraiesForUpdate(eventArray)
    const updatedStatistics = transformArraiesForUpdate(statisticsArray)
    // const updatedSimple = transformArraiesForUpdate(simpleArray)

    const Data = {}

    Data._id = programId

    if ((selectedOrg !== currentProject?.organization?.id) && selectedOrg) {
      Data.organizationId = selectedOrg
    }
    if ((selectedProgram !== currentProject?.programId) && selectedProgram) {
      Data.programId = selectedProgram
    }
    if ((selectedStrategy !== currentProject?.strategy?.id) && selectedStrategy) {
      Data.strategyId = selectedStrategy
    }
    if ((descriptionProject !== currentProject?.content) && descriptionProject) {
      Data.content = descriptionProject
    }
    if (
      rulesList.length > 0 ||
      productsList.length > 0 ||
      statisticsList.length > 0 ||
      // simpleList.length > 0 ||
      eventList.length > 0
    ) {
      Data.targetCreateDtos = [
        ...rulesList,
        ...productsList,
        ...statisticsList,
        // ...simpleList,
        ...eventList,
      ];
    }
    Data.targetUpdateDtos = [
      // ...updatedSimple,
      ...updatedProducts,
      ...updatedEvent,
      ...updatedRules,
      ...updatedStatistics
    ]
    Data.projectIds = [
      ...selectedProjectsForRequest
    ]

    console.log(Data)
      // await updateProject({
      //   userId,
      //   projectId: programId,
      //   ...Data,
      // })
      //   .unwrap()
      //   .then(() => {
      //     reset();
      //   })
      //   .catch((error) => {
      //     console.error("Ошибка:", JSON.stringify(error, null, 2));
      //   });
  }
  console.warn(projectsList)
  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header create={false} title={'Создание новой программы'}></Header>
        </>
        <div className={classes.body}>
          <>
            <div className={classes.selectedType}>
              {currentProject.projectName}
              <img src={editIcon} alt="" onClick={() => setEdit(!edit)} />
            </div>

            <div
              className={classes.bodyContainer}
            >
              <div className={classes.name}>Организация</div>
              {edit ? (
                <div className={classes.selectSection}>
                  <select name="selectOrg" disabled value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)} >
                    {organizations.map((item, index) => (
                      <>
                        <option key={index} value={item.id}>{item.organizationName}</option>
                      </>
                    ))}
                  </select>
                </div>
              ) : (
                <div className={classes.title}>
                  {currentProject?.organization?.organizationName}
                </div>
              )}
            </div>
            {/* {(edit || currentProject.programId) &&
              (
                <div
                  className={classes.bodyContainer}
                  style={{ borderBottom: "1px solid grey" }}
                >
                  <div className={classes.name}>Программа</div>
                  {edit ? (
                    <div className={classes.selectSection}>
                      <select name="selectProgram" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
                        <option value=''>-</option>
                        {filtredPrograms.map((item, index) => (
                          <option value={item.id}>{item.projectName}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className={classes.title}>
                      {currentProject?.programNumber}
                    </div>
                  )}
                </div>
              )} */}

            {(edit || currentProject?.strategy?.id) && (
              <div
                className={classes.bodyContainer}
              >
                <div className={classes.name}>Стратегия</div>
                {edit ? (
                  <div className={classes.selectSection}>
                    <select name="selectProgram" value={selectedStrategy} onChange={(e) => setSelectedStrategy(e.target.value)}>
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
        </div>
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
                        placeholder="Введите описание проекта..."
                        value={descriptionProject}
                        onChange={(e) => setDescriptionProject(e.target.value)}></textarea>
                    </div>
                  </div>
                </div>
              </>
            )}

            {(productsArray.length > 0 || edit) && (
              <>
                <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('ПродуктNEW')}>Продукт</div>
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
                      >
                      </Target>
                    </div>
                  ))}
                  {productsList.map((item, index) => (
                    <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'ПродуктNEW')}>
                      <Target
                        id={item.id}
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
                </div>
              </>
            )}
             {(eventArray.length > 0 || edit) && (
              <>
                <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('Организационные мероприятияNEW')}>Организационные мероприятия</div>
                <div className={classes.targetsFlex}>
                  {eventArray.map((item, index) => (
                    <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Организационные мероприятия')}>
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
                  {rulesArray.map((item, index) => (
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

            <>
              <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => setModalOpen(true)}>Проекты</div>
              <div className={classes.targetsFlex}>
                {projectsList.map((item, index) => (
                  <>
                    <div className={classes.cardContainer} 
                    onClick={() => navigate(`/${userId}/Projects/${item.id}`)}
                    >
                      <div className={classes.content}>
                        <div className={classes.titleProject}>{item?.nameProject}</div>
                        <div className={classes.contentProductTarget}>{item?.product}</div>
                      </div>
                      <div className={classes.bottom}>
                        <div className={classes.worker}>
                          {item?.worker}
                        </div>
                        {/* <div className={classes.deleteContainer} onClick={() => deleteProject(item.id)}>
                          Удалить
                          <img src={deleteIcon} alt="delete" />
                        </div> */}
                        <div className={classes.deadline}>
                          {formattedDate(item?.deadline)}
                          {/* {item.deadline?.slice(0, 10)} */}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </>
            {(statisticsArray.length > 0 || edit) && (
              <>
                <div className={classes.sectionName} data-section-id={edit ? "1" : "none"} onClick={() => addTarget('СтатистикаNEW')}> Метрика</div>
                <div className={classes.targetsFlex}>
                  {statisticsArray.filter(item => item.targetState !== 'Отменена').map((item, index) => (
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

        <>
          <footer className={classes.inputContainer}>
            <div className={classes.inputRow2}>
              <div></div>
              <div>
                <button onClick={() => saveProject()}>{edit ? 'РЕДАКТИРОВАТЬ' : 'СОХРАНИТЬ'}</button>
              </div>
              <div>

              </div>
            </div>
          </footer>
        </>

      </div>
      {modalOpen && <CustomSelectModalProgram setModalOpen={setModalOpen} workers={workers} projectsList={projectsList} setParentFiltredProjects={setFiltredProjects} setProjectsList={setProjectsList} parentFilteredProjects={filtredProjects}></CustomSelectModalProgram>}

      {/* {modalOpen && <CustomSelectModal setModalOpen={setModalOpen} projects={projects} workers={workers} selectedProject={selectedProject} setSelectedProject={setSelectedProject} setParentFilteredProjects={setFiltredProjects}></CustomSelectModal>}
    */}  <HandlerMutation
        Loading={isLoadingUpdateProjectMutation}
        Error={isErrorUpdateProjectMutation}
        Success={isSuccessUpdateProjectMutation}
        textSuccess={"Программа успешно создан."}
        textError={
          Error?.data?.errors?.[0]?.errors?.[0]
            ? Error.data.errors[0].errors[0]
            : Error?.data?.message
        }
      ></HandlerMutation> 
    </>
  );
}
