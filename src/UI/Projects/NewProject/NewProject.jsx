import React, { useEffect, useRef, useState } from "react";
import classes from "./NewProject.module.css";
import Target from "../Targets/Target";
import { useGetProjectNewQuery, usePostProjectMutation, useGetProgramNewQuery } from "../../../BLL/projectApi";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelectModal from "../CustomSelectModal/CustomSelectModal";
import deleteIcon from '../../Custom//icon/icon _ delete.svg'
import Header from "../../Custom/Header/Header";
import HandlerMutation from "../../Custom/HandlerMutation";
import { formattedDate } from "../../../BLL/constans"
import { resizeTextarea } from "../../../BLL/constans";
import listSetting from '../../Custom/icon/icon _ list setting.svg'
import AlertOnlyOneProductTarget from "../../Custom/AlertOnlyOneProductTarget/AlertOnlyOneProductTarget";
import CustomSelectSettingModal from "../CustomSelectSettingModal/CustomSelectSettingModal";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function NewProject() {
  const { userId } = useParams();
  const navigate = useNavigate()
  const uniqueIdRef = useRef(1);
  const [IsTypeProgram, setIsTypeProgram] = useState(false);
  const [selectedSections, setSelectedSections] = useState([])

  const {
    projectData = [],
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      projectData: data
    }),
    skip: IsTypeProgram
  });

  const {
    programData = [],
  } = useGetProgramNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      programData: data
    }),
    skip: !IsTypeProgram
  });

  const [openDescription, setOpenDescription] = useState(true)
  const [projectDescription, setProjectDescription] = useState('')
  const [projectName, setProjectName] = useState('')
  const [isToOrganization, setIsToOrganization] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [sortPrograms, setSortPrograms] = useState([])
  const [selectedWorker, setSelectedWorker] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [openModalAlertOnlyOneProductTarget, setOpenModalAlertOnlyOneProductTarget] = useState(false)
  const [openSelectSettingModal, setOpenSelectSettingModal] = useState(false)

  const [sortStrategy, setSortStrategy] = useState([])

  const [targetIndex, setTargetIndex] = useState()
  const [targetContent, setTargetContent] = useState('')
  const [targetType, setTargetType] = useState('')

  const [projectsForModal, setProjectsForModal] = useState([])
  const [selectedProject, setSelectedProject] = useState([])
  const [filtredProjects, setFiltredProjects] = useState([])
  const [currentProjects, setCurrentProjects] = useState([])

  const [workers, setWorkers] = useState([])
  const [programs, setPrograms] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [projects, setProjects] = useState([])
  const [strategies, setStrategies] = useState([])

  const [dummyKey, setDummyKey] = useState(0)
  const [rulesArray, setRulesArray] = useState([
    // {
    //   type: 'Правила',
    //   orderNumber: 1,
    //   content: "",
    //   holderUserId: '',
    //   deadline: ""
    // }
  ])
  const [productsArray, setProductsArray] = useState([
    {
      type: 'Продукт',
      orderNumber: 1,
      content: "",
      holderUserId: '',
      deadline: ""
    }
  ])
  const [statisticsArray, setStatisticsArray] = useState([
    // {
    //   type: 'Статистика',
    //   orderNumber: 1,
    //   content: "",
    //   holderUserId: '',
    //   deadline: ""
    // }
  ])
  const [simpleArray, setSimpleArray] = useState([
    {
      type: 'Обычная',
      orderNumber: 1,
      content: "",
      holderUserId: '',
      deadline: ""
    }
  ])
  const [eventArray, setEventArray] = useState([
    // {
    //   type: 'Организационные мероприятия',
    //   orderNumber: 1,
    //   content: "",
    //   holderUserId: '',
    //   deadline: ""
    // }
  ])

  const TARGET_TYPES = {
    'Правила': 'rules',
    'Продукт': 'products',
    'Статистика': 'statistics',
    'Обычная': 'simple',
    'Организационные мероприятия': 'event',
  };

  const ADD_TARGET = {
    rules: { array: rulesArray, setFunction: setRulesArray },
    products: { array: productsArray, setFunction: setProductsArray },
    statistics: { array: statisticsArray, setFunction: setStatisticsArray },
    simple: { array: simpleArray, setFunction: setSimpleArray },
    event: { array: eventArray, setFunction: setEventArray },
  };

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
    if (IsTypeProgram) {
      setWorkers(programData?.workers)
      setOrganizations(programData?.organizations)
      setStrategies(programData?.strategies)
      setProjects(programData?.projects)
    }
    else {
      setWorkers(projectData.workers)
      setOrganizations(projectData.organizations)
      setStrategies(projectData.strategies)
      setPrograms(projectData.programs)
    }
  }, [IsTypeProgram, programData, projectData])

  useEffect(() => {
    if (!filtredProjects || !Array.isArray(filtredProjects)) return;

    const currentProjects = filtredProjects.filter(project => {
      return selectedProject.some(id => project.id === id);
    });

    setCurrentProjects(currentProjects);
  }, [filtredProjects, selectedProject]);


  useEffect(() => {
    if (isToOrganization) {
      const filteredStrategies = strategies?.filter(
        (strategy) => strategy?.organization?.id === isToOrganization
      );
      setSortStrategy(filteredStrategies);
    }
  }, [strategies, isToOrganization]);

  useEffect(() => {
    if (isToOrganization) {
      const filteredProjects = projects?.filter(
        (project) =>
          project?.organization?.id === isToOrganization &&
          project?.targets.some(target =>
            target.targetState === "Активная" &&
            target.isExpired === false &&
            target.type === 'Продукт'
          )
      );
      setProjectsForModal(filteredProjects);
    }
  }, [projects, isToOrganization]);


  useEffect(() => {
    if (isToOrganization) {
      const filteredPrograms = programs?.filter((program) => program?.organization?.id === isToOrganization);
      setSortPrograms(filteredPrograms);
    }
  }, [programs, isToOrganization]);

  useEffect(() => {
    if (organizations?.length > 0 && !isToOrganization) {
      setIsToOrganization(organizations[0]?.id)
    }
  }, [organizations])

  useEffect(() => {
    if (targetType) {
      const { array, setFunction } = ADD_TARGET[targetType];
      if (targetIndex < array.length) {
        array[targetIndex].content = targetContent
      }
    }
  }, [targetContent])

  useEffect(() => {
    if (targetType && deadlineDate !== null) {
      const { array, setFunction } = ADD_TARGET[targetType];
      array[targetIndex].deadline = deadlineDate
      setDeadlineDate(null)
    }
  }, [deadlineDate])

  useEffect(() => {
    if (targetType && selectedWorker !== null) {
      const { array, setFunction } = ADD_TARGET[targetType];
      array[targetIndex].holderUserId = selectedWorker
      setSelectedWorker(null)
    }
  }, [selectedWorker])

  useEffect(() => {
    if (isSuccessProjectMutation) {
      setTimeout(window.location.reload(), 1000)
    }
  }, [isSuccessProjectMutation])

  const addTarget = (type) => {

    setTargetType(null)
    const targetType = TARGET_TYPES[type]
    const { array, setFunction } = ADD_TARGET[targetType]
    const newIndex = ++uniqueIdRef.current

    // if (targetType === 'products' && newIndex > 1) return setOpenModalAlertOnlyOneProductTarget(true)

    const newTarget = {
      // id: new Date(),
      type: type,
      orderNumber: newIndex,
      content: "",
      holderUserId: '',
      deadline: ""
    };
    setTargetIndex(newIndex);
    setFunction(prevState => [...prevState, newTarget]);
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
    if (IsTypeProgram && id === 0 || !IsTypeProgram && id === 1) {
      setIsTypeProgram(!IsTypeProgram);
    }
  }

  const deleteProject = (id) => {
    console.log('id   ', id)
    setSelectedProject(prevSelectedProject =>
      prevSelectedProject.filter(project => project !== id)
    );
    console.log(selectedProject)
  };

  const addProjects = () => {
    if (!projectsForModal.length > 0) return console.warn('Нет проектов для программы')
    setModalOpen(true)
  }


  useEffect(() => {
    if (selectedProgram && programs) {
      const currentStrategy = programs.find(program => program.id === selectedProgram);
      if (currentStrategy) {
        console.log(currentStrategy)
        setSelectedStrategy(currentStrategy?.strategy?.id);
      }
    }
  }, [selectedProgram]);

  const handleOnDragEnd = (result, array, setArray) => {
    const { destination, source } = result;

    if (!destination) return

    const items = Array.from(array);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    console.warn('items:   ', items)
    setArray(items)
  };


  const saveProject = async () => {

    const Data = {}

    IsTypeProgram ? Data.type = 'Программа' : Data.type = 'Проект'
    if (isToOrganization) {
      Data.organizationId = isToOrganization
    }
    if (selectedProgram && !IsTypeProgram) {
      Data.programId = selectedProgram
    }
    if (projectName) {
      Data.projectName = projectName
    }
    if (selectedStrategy) {
      Data.strategyId = selectedStrategy
    }
    if (projectDescription) {
      Data.content = projectDescription
    }
    if (IsTypeProgram && (
      rulesArray.length > 0 ||
      productsArray.length > 0 ||
      statisticsArray.length > 0 ||
      // simpleArray.length > 0 ||
      eventArray.length > 0
    )
    ) {
      Data.targetCreateDtos = [
        ...rulesArray,
        ...productsArray,
        ...statisticsArray,
        // ...simpleArray,
        ...eventArray,
      ];
    } else if (!IsTypeProgram && (
      rulesArray.length > 0 ||
      productsArray.length > 0 ||
      statisticsArray.length > 0 ||
      simpleArray.length > 0 ||
      eventArray.length > 0
    )
    ) {
      Data.targetCreateDtos = [
        ...rulesArray.map((item, index) => ({ ...item, orderNumber: index + 1})),
        ...productsArray.map((item, index) => ({ ...item, orderNumber: index + 1})),
        ...statisticsArray.map((item, index) => ({ ...item, orderNumber: index + 1})),
        ...simpleArray.map((item, index) => ({ ...item, orderNumber: index + 1})),
        ...eventArray.map((item, index) => ({ ...item, orderNumber: index + 1})),
      ];
    }
    if (IsTypeProgram) {
      Data.projectIds = [
        ...selectedProject
      ]
    }
    console.log(Data)
    await postProject({
      userId,
      ...Data,
    })
      .unwrap()
      .then((result) => {
        navigate(IsTypeProgram ? `/${userId}/Projects/program/${result?.id}` : `/${userId}/Projects/${result?.id}`)
      })
      .catch((error) => {
        console.error("Ошибка:", JSON.stringify(error, null, 2));
      });

  }
  // console.log(productsArray, eventArray, rulesArray, simpleArray, statisticsArray)
  return (
    <>
      <div className={classes.wrapper}>
        <>
          <div className={classes.header}>
            <Header create={false} title={IsTypeProgram ? 'Создание новой программы' : 'Создание нового проекта'}></Header>
            <div className={classes.saveIcon}>
              <img
                src={listSetting}
                alt="listSetting"
                onClick={() => setOpenSelectSettingModal(true)}
              />
            </div>
          </div>
        </>

        <div className={classes.body}>
          <>
            <div className={classes.Type}>
              <div
                className={
                  IsTypeProgram ? classes.TitleType : classes.selectedType
                }
                onClick={() => switchType(0)}
              >
                Проект
              </div>
              <div
                className={
                  IsTypeProgram ? classes.selectedType : classes.TitleType
                }
                onClick={() => switchType(1)}
              >
                Программа
              </div>
            </div>
            <div
              className={classes.bodyContainer}
            >
              <div className={classes.name}>Название</div>
              <div className={classes.selectSection}>
                <input type="text" onChange={(e) => setProjectName(e.target.value)} />
              </div>
            </div>
            <div
              className={classes.bodyContainer}
            >
              <div className={classes.name}>Организация</div>
              <div className={classes.selectSection}>
                <select name="selectOrg" value={isToOrganization} onChange={(e) => setIsToOrganization(e.target.value)}>
                  {organizations?.map((item, index) => (
                    <option key={index} value={item.id}>{item.organizationName}</option>
                  ))}
                </select>
              </div>
            </div>
            {!IsTypeProgram &&
              (
                <div
                  className={classes.bodyContainer}
                >
                  <div className={classes.name}>Программа</div>
                  <div className={classes.selectSection}>
                    <select name="selectProgram" disabled={!isToOrganization} onChange={(e) => setSelectedProgram(e.target.value)}>
                      <option value="">-</option>
                      {sortPrograms?.map((item, index) => (
                        <option key={index} value={item.id} >Программма №{item.projectNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            <div
              className={classes.bodyContainer}
            >
              <div className={classes.name}>Стратегия</div>
              <div className={classes.selectSection}>
                <select
                  name="selectProgram"
                  disabled={selectedProgram}
                  onChange={(e) => setSelectedStrategy(e.target.value)}>
                  <option value="">-</option>
                  {sortStrategy?.map((item, index) => (
                    <option key={index} value={item.id}>Стратегия №{item.strategyNumber}</option>
                  ))}
                </select>

              </div>
            </div>
          </>

          <>
            <div className={classes.targetsContainer}>
              {!projectsForModal?.length > 0 && IsTypeProgram ? (
                <div className={classes.alertInfo}>нет проектов для создания программы</div>
              ) : (
                <>


                  {selectedSections.includes('Описание') && (
                    <>
                      <div className={classes.sectionName} data-section-id={openDescription ? "1" : "2"} onClick={() => setOpenDescription(!openDescription)}>Описание</div>
                      <div className={classes.targetsFlex}>
                        {openDescription && (
                          <div className={classes.descriptionFlex}>
                            <div className={classes.descriptionContainer}>
                              <textarea name="description" placeholder="Введите описание проекта..." id="1"
                                onChange={(e) => {
                                  setProjectDescription(e.target.value)
                                  setTimeout(resizeTextarea('1'), 0)
                                }}
                              >
                              </textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div
                    className={classes.sectionName}
                    style={{ backgroundImage: 'none' }}
                  >
                    Продукт
                  </div>
                  <div className={classes.targetsFlex}>
                    {productsArray.map((item, index) => (
                      <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Продукт')}>
                        <Target
                          item={item}
                          isNew={true}
                          contentSender={setTargetContent}
                          workersList={workers}
                          setSelectedWorker={setSelectedWorker}
                          setDeadlineDate={setDeadlineDate}>
                        </Target>
                      </div>
                    ))}
                    {/* {productsArray.length > 0 && (
                        <div className={classes.deleteContainer} onClick={() => deleteTarget(productsArray)}>
                          Удалить
                          <img src={deleteIcon} alt="delete" />
                        </div>
                      )} */}
                  </div>

                  {selectedSections.includes('Организационные мероприятия') && (
                    <>
                      <div className={classes.sectionName} onClick={() => addTarget('Организационные мероприятия')}>Организационные мероприятия</div>
                      <div className={classes.targetsFlex}>
                        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, eventArray, setEventArray)}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                <>
                                  {eventArray.map((item, index) => (
                                    <Draggable
                                      key={item.orderNumber}
                                      draggableId={`item-${item.orderNumber}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          key={item.orderNumber}
                                          className={classes.targetContainer}
                                          onClick={() => targetFormation(index, 'Организационные мероприятия')}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <Target
                                            item={item}
                                            isNew={true}
                                            contentSender={setTargetContent}
                                            workersList={workers}
                                            setSelectedWorker={setSelectedWorker}
                                            setDeadlineDate={setDeadlineDate}
                                          >

                                          </Target>
                                        </div>

                                      )}
                                    </Draggable>
                                  ))}
                                  {eventArray.length > 0 && (
                                    <div className={classes.deleteContainer} onClick={() => deleteTarget(eventArray)}>
                                      Удалить
                                      <img src={deleteIcon} alt="delete" />
                                    </div>
                                  )}
                                </>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </>
                  )}

                  {selectedSections.includes('Правила') && (
                    <>
                      <div className={classes.sectionName} onClick={() => addTarget('Правила')}>Правила</div>
                      <div className={classes.targetsFlex}>
                        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, rulesArray, setRulesArray)}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                <>
                                  {rulesArray.map((item, index) => (
                                    <Draggable
                                      key={item.orderNumber}
                                      draggableId={`item-${item.orderNumber}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          key={item.orderNumber}
                                          className={classes.targetContainer}
                                          onClick={() => targetFormation(index, 'Правила')}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <Target
                                            item={item}
                                            isNew={true}
                                            contentSender={setTargetContent}
                                            workersList={workers}
                                            setSelectedWorker={setSelectedWorker}
                                            setDeadlineDate={setDeadlineDate}
                                          >

                                          </Target>
                                        </div>

                                      )}
                                    </Draggable>
                                  ))}
                                  {rulesArray.length > 0 && (
                                    <div className={classes.deleteContainer} onClick={() => deleteTarget(rulesArray)}>
                                      Удалить
                                      <img src={deleteIcon} alt="delete" />
                                    </div>
                                  )}
                                </>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </>
                  )}

                  {!IsTypeProgram ? (
                    <>
                      <div className={classes.sectionName} onClick={() => addTarget('Обычная')}>Задачи</div>
                      <div className={classes.targetsFlex}>
                        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, simpleArray, setSimpleArray)}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                <>
                                  {simpleArray.map((item, index) => (
                                    <Draggable
                                      key={item.orderNumber}
                                      draggableId={`item-${item.orderNumber}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          key={item.orderNumber}
                                          className={classes.targetContainer}
                                          onClick={() => targetFormation(index, 'Обычная')}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <Target
                                            item={item}
                                            isNew={true}
                                            contentSender={setTargetContent}
                                            workersList={workers}
                                            setSelectedWorker={setSelectedWorker}
                                            setDeadlineDate={setDeadlineDate}
                                          >

                                          </Target>
                                        </div>

                                      )}
                                    </Draggable>
                                  ))}
                                  {simpleArray.length > 0 && (
                                    <div className={classes.deleteContainer} onClick={() => deleteTarget(simpleArray)}>
                                      Удалить
                                      <img src={deleteIcon} alt="delete" />
                                    </div>
                                  )}
                                </>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={classes.sectionName} onClick={() => addProjects()}>Проекты</div>
                      <div className={classes.targetsFlex}>
                        {currentProjects.map((item, index) => (
                          <>
                            <div className={classes.cardContainer}>
                              <div className={classes.content}>
                                <div className={classes.titleProject}>{item.nameProject}</div>
                                <div className={classes.contentProductTarget}>{item.product}</div>
                              </div>
                              <div className={classes.bottom}>
                                <div className={classes.worker}>
                                  {item.worker}
                                </div>
                                <div className={classes.deleteContainer} onClick={() => deleteProject(item.id)}>
                                  Удалить
                                  <img src={deleteIcon} alt="delete" />
                                </div>
                                <div className={classes.deadline}>
                                  {formattedDate(item.deadline)}
                                  {/* {item.deadline?.slice(0, 10)} */}
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedSections.includes('Метрика') && (
                    <>
                      <div className={classes.sectionName} onClick={() => addTarget('Статистика')}>Метрика</div>
                      <div className={classes.targetsFlex}>
                        <DragDropContext onDragEnd={(result) => handleOnDragEnd(result, statisticsArray, setStatisticsArray)}>
                          <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                <>
                                  {statisticsArray.map((item, index) => (
                                    <Draggable
                                      key={item.orderNumber}
                                      draggableId={`item-${item.orderNumber}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          key={item.orderNumber}
                                          className={classes.targetContainer}
                                          onClick={() => targetFormation(index, 'Статистика')}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <Target
                                            item={item}
                                            isNew={true}
                                            contentSender={setTargetContent}
                                            workersList={workers}
                                            setSelectedWorker={setSelectedWorker}
                                            setDeadlineDate={setDeadlineDate}
                                          >

                                          </Target>
                                        </div>

                                      )}
                                    </Draggable>
                                  ))}
                                  {statisticsArray.length > 0 && (
                                    <div className={classes.deleteContainer} onClick={() => deleteTarget(statisticsArray)}>
                                      Удалить
                                      <img src={deleteIcon} alt="delete" />
                                    </div>
                                  )}
                                </>
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </div>
                    </>
                  )}
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
                  onClick={saveProject}
                  disabled={!projectsForModal?.length > 0 && IsTypeProgram}
                  style={{ backgroundColor: (!projectsForModal?.length > 0 && IsTypeProgram) ? 'grey' : '#005475' }}
                >
                  СОХРАНИТЬ
                </button>
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

      {modalOpen &&
        <CustomSelectModal
          setModalOpen={setModalOpen}
          projects={projectsForModal}
          workers={workers}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setParentFilteredProjects={setFiltredProjects}
        >
        </CustomSelectModal>}

      {openModalAlertOnlyOneProductTarget &&
        <AlertOnlyOneProductTarget
          setModalOpen={setOpenModalAlertOnlyOneProductTarget}
        >
        </AlertOnlyOneProductTarget>}

      {openSelectSettingModal && (
        <CustomSelectSettingModal
          setModalOpen={setOpenSelectSettingModal}
          listSelectedSections={selectedSections}
          setListSelectedSections={setSelectedSections}
        ></CustomSelectSettingModal>
      )}

      <HandlerMutation
        Loading={isLoadingProjectMutation}
        Error={isErrorProjectMutation}
        Success={isSuccessProjectMutation}
        textSuccess={IsTypeProgram ? "Программа успешно создана." : "Проект успешно создан"}
        textError={
          Error?.data?.errors?.[0]?.errors?.[0]
            ? Error.data.errors[0].errors[0]
            : Error?.data?.message
        }
      ></HandlerMutation>
    </>
  );
}
