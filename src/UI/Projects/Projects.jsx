import React, { useEffect, useState } from "react";
import classes from "./Projects.module.css";
import { useGetProjectIdQuery } from "../../BLL/projectApi";
import { useParams } from "react-router-dom";
import Target from "./Targets/Target";

function Projects(props) {
  const { userId, projectId } = useParams();

  const [edit, setEdit] = useState(false)
  const [rulesList, setRulesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [statisticsList, setStatisticsList] = useState([]);
  const [simpleList, setSimpleList] = useState([]);
  
  const {
    currentProject = [],
    targets = [],
    projectToOrganizations = [],
  } = useGetProjectIdQuery(
    { userId, projectId: projectId },
    {
      selectFromResult: ({ data }) => ({
        currentProject: data?.currentProject || [],
        targets: data?.targets || [],
        projectToOrganizations: data?.projectToOrganizations || [],
      }),
    }
  );

  
  useEffect(() => {
    if (targets.length > 0) {
      const updatedLists = {
        rulesList: [],
        productsList: [],
        statisticsList: [],
        simpleList: []
      };
  
      targets.forEach(target => {
        switch (target.type) {
          case 'Обычная':
            updatedLists.simpleList.push(target);
            break;
          case 'Правила':
            updatedLists.rulesList.push(target);
            break;
          case 'Продукт':
            updatedLists.productsList.push(target);
            break;
          case 'Статистика':
            updatedLists.statisticsList.push(target);
            break;
          default:
            console.warn(`Неизвестный тип цели: ${target.type}`);
        }
      });
  
      // Обновляем состояния
      setRulesList(updatedLists.rulesList);
      setProductsList(updatedLists.productsList);
      setStatisticsList(updatedLists.statisticsList);
      setSimpleList(updatedLists.simpleList);
    }
  }, [targets]);

  console.log("currentProject  ", currentProject);
  console.log("targets  ", targets);
  console.log("projectToOrganizations  ", projectToOrganizations);

  return (
    <>
      <div className={classes.wrapper}>
        <></>
        <div className={classes.body}>
          <>
            <div className={classes.Title}>
              {currentProject.type === "Проект"
                ? `Проект №${currentProject.projectNumber}`
                : `Программа`}
            </div>
            {currentProject.type === "Проект" && (
              <div
                className={classes.bodyContainer}
                style={{ borderBottom: "1px solid grey" }}
              >
                <div className={classes.name}>Программа</div>
                <div className={classes.selectSection}>
                  <select name="selectProgram" id="1" disabled={!edit}>
                    <option>{currentProject?.programId ? `${currentProject?.programId}` : '-'}</option>
                  </select>
                </div>
              </div>)}
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Стратегия</div>
              <div className={classes.selectSection}>
                <select name="selectProgram" id="1"></select>
              </div>
            </div>
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Организация</div>
              <div className={classes.OrgSection}>
                <div
                  className={
                    !projectToOrganizations
                      ? classes.OrgName
                      : "none"
                  }
                >
                  {projectToOrganizations ? (
                    <>
                      {projectToOrganizations?.organizationName}
                      {/* <div className={classes.smallText}>
                        и ещё(
                        {projectToOrganizations.length - 1})
                      </div> */}
                    </>
                  ) : (
                    "Не выбрано"
                  )}
                </div>
              </div>
            </div>
          </>
        </div>
        <>
          <div className={classes.targetsContainer}>
            <div className={classes.sectionName}>Правила</div>
            <div className={classes.targetsFlex}>
              {rulesList.map((item,index) => (
                <div className={classes.targetContainer}>
                <Target isNew={false} id={index} targetsList={rulesList}></Target>
              </div>
              ))}
              <div className={classes.targetContainer}>
                {/* <Target></Target> */}
              </div>
            </div>

            <div className={classes.sectionName}>Продукт</div>
            <div className={classes.targetsFlex}>
              <div className={classes.targetContainer}>
                {/* <Target></Target> */}
              </div>
            </div>
            <div className={classes.sectionName}>Статистика</div>
            <div className={classes.targetsFlex}>
              <div className={classes.targetContainer}>
                {/* <Target></Target> */}
              </div>
            </div>
            <div className={classes.sectionName}>Обычная</div>
            <div className={classes.targetsFlex}>
              <div className={classes.targetContainer}>
                {/* <Target></Target> */}
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default Projects;
