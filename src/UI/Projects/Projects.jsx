import React from "react";
import classes from "./Projects.module.css";
import { useGetProjectIdQuery } from "../../BLL/projectApi";
import { useParams } from "react-router-dom";
import Target from "./Targets/Target";

function Projects(props) {
  const { userId, projectId } = useParams();

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
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Программа</div>
              <div className={classes.selectSection}>
                <select name="selectProgram" id="1"></select>
              </div>
            </div>
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
                    !projectToOrganizations.length > 0
                      ? classes.OrgName
                      : "none"
                  }
                >
                  {projectToOrganizations.length > 0 ? (
                    <>
                      {projectToOrganizations[0].organization?.organizationName}
                        <div className={classes.smallText}>
                            и ещё(
                            {projectToOrganizations.length - 1})
                        </div>
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
              <div className={classes.targetContainer}>
                <Target></Target>
              </div>
              <div className={classes.targetContainer}>
                <Target></Target>
              </div>
            </div>

            <div className={classes.sectionName}>Продукт</div>
            <div className={classes.targetsFlex}>
              <div className={classes.targetContainer}>
                <Target></Target>
              </div>
            </div>
            <div className={classes.sectionName}>Статистика</div>
            <div className={classes.targetsFlex}>
              <div className={classes.targetContainer}>
                <Target></Target>
              </div>
            </div>
            <div className={classes.sectionName}>Обычная</div>
            <div className={classes.targetsFlex}>
              <div className={classes.targetContainer}>
                <Target></Target>
              </div>
            </div>
          </div>
        </>
      </div>
    </>
  );
}

export default Projects;
