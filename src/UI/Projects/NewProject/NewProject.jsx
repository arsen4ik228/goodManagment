import React, { useEffect, useState } from "react";
import classes from "./NewProject.module.css";
import Target from "../Targets/Target";
import { useGetProjectNewQuery } from "../../../BLL/projectApi";
import { useParams } from "react-router-dom";
import CustomSelect from "../../Custom/CustomSelect/CustomSelect";

export default function NewProject() {
  const { userId } = useParams();
  const [typeProject, setTypeProject] = useState(true);
  const [isToOrganization, setIsToOrganization] = useState([])
  const [nameSelectedOrg, setNameSelectedOrg] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  console.log(isToOrganization)
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
  console.log(
    "workers",
    workers,
    "organization",
    organizations,
    "programsWithoutProject",
    programsWithoutProject,
    "strategies",
    strategies
  );

  useEffect(()=>{
    const organization = organizations.find(org => org.id == isToOrganization);
    setNameSelectedOrg(organization?.organizationName)
  },[isToOrganization,organizations])

  const switchType = (id) => {};
  const openOrgModal = () => {
    setModalOpen(true)
  }

  return (
    <>
      <div className={classes.wrapper}>
        <></>
        <div className={classes.body}>
          <>
            <div className={classes.Type}>
              <div
                className={
                  typeProject ? classes.TitleType : classes.selectedType
                }
                onClick={() => setTypeProject(!typeProject)}
              >
                Проект
              </div>
              <div
                className={
                  typeProject ? classes.selectedType : classes.TitleType
                }
                onClick={() => setTypeProject(!typeProject)}
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
                  <select name="selectProgram" id="1"></select>
                </div>
              </div>
            )}
            <div
              className={classes.bodyContainer}
              style={{ borderBottom: "1px solid grey" }}
            >
              <div className={classes.name}>Организация</div>
              <div className={classes.OrgSection}>

                <div className={classes.OrgName} onClick={()=>setModalOpen(true)}>
                    {isToOrganization.length>0 ? `${nameSelectedOrg}` : 'Не выбрано'}
                </div>
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

      {modalOpen && <CustomSelect isToOrganizations={isToOrganization} setToOrganizations={setIsToOrganization} organizations={organizations} setModalOpen={setModalOpen} ></CustomSelect> }
    </>
  );
}
