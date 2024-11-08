import React, { useEffect, useState } from "react";
import classes from "./NewProject.module.css";
import Target from "../Targets/Target";
import { useGetProjectNewQuery, usePostProjectMutation, useGetProgramNewQuery } from "../../../BLL/projectApi";
import { useParams } from "react-router-dom";
import CustomSelectModal from "../CustomSelectModal/CustomSelectModal";
import deleteIcon from '../../Custom//icon/icon _ delete.svg'
import Header from "../../Custom/Header/Header";
import HandlerMutation from "../../Custom/HandlerMutation";
import { formattedDate } from "../../../BLL/constans"

export default function NewProject() {
  const { userId } = useParams();
  const [typeProject, setTypeProject] = useState(true);
  const [openDescription, setOpenDescription] = useState(false)
  const [projectDescription, setProjectDescription] = useState('')
  const [projectName, setProjectName] = useState('')
  const [isToOrganization, setIsToOrganization] = useState('')
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('')
  const [sortPrograms, setSortPrograms] = useState([])
  const [selectedWorker, setSelectedWorker] = useState('')
  const [deadlineDate, setDeadlineDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const [dummyKey, setDummyKey] = useState(0)
  const [rulesArray, setRulesArray] = useState([])
  const [productsArray, setProductsArray] = useState([])
  const [statisticsArray, setStatisticsArray] = useState([])
  const [simpleArray, setSimpleArray] = useState([])
  const [eventArray, setEventArray] = useState([])

  const [sortStrategy, setSortStrategy] = useState([])

  const [targetIndex, setTargetIndex] = useState()
  const [targetContent, setTargetContent] = useState('')
  const [targetType, setTargetType] = useState('')

  const [selectedProject, setSelectedProject] = useState([])
  const [filtredProjects, setFiltredProjects] = useState([])
  const [currentProjects, setCurrentProjects] = useState([])

  const [workers, setWorkers] = useState([])
  const [programs, setPrograms] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [projects, setProjects] = useState([])
  const [strategies, setStrategies] = useState([])

  console.log('selectedProject   ', selectedProject)

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


  const {
    projectData = [],
  } = useGetProjectNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      projectData: data
    }),
  });

  const {
    programData = [],
  } = useGetProgramNewQuery(userId, {
    selectFromResult: ({ data }) => ({
      programData: data
    }),
  });

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
    if (typeProject) {
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
  }, [typeProject, programData, projectData])

  useEffect(() => {
    if (!filtredProjects || !Array.isArray(filtredProjects)) return;

    const currentProjects = filtredProjects.filter(project => {
      return selectedProject.some(id => project.id === id);
    });

    setCurrentProjects(currentProjects);
  }, [filtredProjects, selectedProject]);


  useEffect(() => {
    if (isToOrganization) {
      const filteredStrategies = strategies.filter(
        (strategy) => strategy?.organization?.id === isToOrganization
      );
      setSortStrategy(filteredStrategies);
    }
  }, [strategies, isToOrganization]);

  useEffect(() => {
    if (isToOrganization) {
      const filteredPrograms = programs.filter(
        (program) => program?.organization?.id === isToOrganization
      );
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
      // id: new Date(),
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

  const deleteProject = (id) => {
    console.log('id   ', id)
    setSelectedProject(prevSelectedProject =>
      prevSelectedProject.filter(project => project !== id)
    );
    console.log(selectedProject)
  };

  console.warn(selectedProject)
  const reset = () => { }

  const saveProject = async () => {

    const Data = {}

    typeProject ? Data.type = 'Программа' : Data.type = 'Проект'
    if (isToOrganization) {
      Data.organizationId = isToOrganization
    }
    if (selectedProgram && !typeProject) {
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
    if (
      rulesArray.length > 0 ||
      productsArray.length > 0 ||
      statisticsArray.length > 0 ||
      simpleArray.length > 0 ||
      eventArray.length > 0
    ) {
      Data.targetCreateDtos = [
        ...rulesArray,
        ...productsArray,
        ...statisticsArray,
        ...simpleArray,
        ...eventArray,
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
        console.error("Ошибка:", JSON.stringify(error, null, 2));
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
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Название</div>
              <div className={classes.selectSection}>
                <input type="text" onChange={(e) => setProjectName(e.target.value)} />
              </div>
            </div>
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
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
            {!typeProject && (
              <div
                className={classes.bodyContainer}
                style={{ borderBottom: "1px solid grey" }}
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
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Стратегия</div>
              <div className={classes.selectSection}>
                <select name="selectProgram" disabled={!isToOrganization} onChange={(e) => setSelectedStrategy(e.target.value)}>
                  <option value="">-</option>
                  {sortStrategy?.map((item, index) => (
                    <option key={index} value={item.id}>Стратегия №{item.strategyNumber}</option>
                  ))}
                </select>

              </div>
            </div>
          </>
        </div>
        <>
          <div className={classes.targetsContainer}>
            <div className={classes.sectionName} data-section-id={openDescription ? "1" : "2"} onClick={() => setOpenDescription(!openDescription)}>Описание</div>
            <div className={classes.targetsFlex}>
              {openDescription && (
                <div className={classes.descriptionFlex}>
                  <div className={classes.descriptionContainer}>
                    <textarea name="description" placeholder="Введите описание проекта..." onChange={(e) => setProjectDescription}></textarea>
                  </div>
                </div>
              )}
            </div>
            <div className={classes.sectionName} onClick={() => addTarget('Продукт')}>Продукт</div>
            <div className={classes.targetsFlex}>
              {productsArray.map((item, index) => (
                <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Продукт')}>
                  <Target
                    id={item.id}
                    isNew={true}
                    contentSender={setTargetContent}
                    workersList={workers}
                    setSelectedWorker={setSelectedWorker}
                    setDeadlineDate={setDeadlineDate}>

                  </Target>
                </div>
              ))}
              {productsArray.length > 0 && (
                <div className={classes.deleteContainer} onClick={() => deleteTarget(productsArray)}>
                  Удалить
                  <img src={deleteIcon} alt="delete" />
                </div>
              )}
            </div>
            <div className={classes.sectionName} onClick={() => addTarget('Организационные мероприятия')}>Организационные мероприятия</div>
            <div className={classes.targetsFlex}>
              {eventArray.map((item, index) => (
                <div key={index} className={classes.targetContainer} onClick={() => targetFormation(index, 'Организационные мероприятия')}>
                  <Target id={item.id} isNew={true} contentSender={setTargetContent} workersList={workers} setSelectedWorker={setSelectedWorker} setDeadlineDate={setDeadlineDate}></Target>
                </div>
              ))}
              {eventArray.length > 0 && (
                <div className={classes.deleteContainer} onClick={() => deleteTarget(eventArray)}>
                  Удалить
                  <img src={deleteIcon} alt="delete" />
                </div>
              )}
            </div>
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

            {!typeProject ? (
              <>
                <div className={classes.sectionName} onClick={() => addTarget('Обычная')}>Задачи</div>
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
              </>
            ) : (
              <>
                <div className={classes.sectionName} onClick={() => setModalOpen(true)}>Проекты</div>
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

            <div className={classes.sectionName} onClick={() => addTarget('Статистика')}> Метрика</div>
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

      {modalOpen && <CustomSelectModal setModalOpen={setModalOpen} projects={projects} workers={workers} selectedProject={selectedProject} setSelectedProject={setSelectedProject} setParentFilteredProjects={setFiltredProjects}></CustomSelectModal>}
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
