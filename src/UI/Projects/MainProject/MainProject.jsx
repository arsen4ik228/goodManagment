import React, { useEffect, useState } from "react";
import classes from "./MainProject.module.css";
import Header from "../../Custom/Header/Header";
import sublist from "../../Custom/icon/icon _ sublist.svg";
import { useGetProjectQuery } from "../../../BLL/projectApi";
import { useGetOrganizationsQuery } from "../../../BLL/organizationsApi";
import { useNavigate, useParams } from "react-router-dom";

export default function MainProject() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [openProjects, setOpenProjects] = useState(false);
  const [openPrograms, setOpenPrograms] = useState(true);
  const [openArchive, setOpenArchive] = useState(false)
  const [programsList, setProgramsList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [projectsOfProgramsList, setProjectsOfProgramsList] = useState([])
  const [organizationId, setOrganizationId] = useState()
  const [open, setOpen] = useState()

  const {
    organizations = []
  } = useGetOrganizationsQuery(userId, {
    selectFromResult: ({ data }) => ({
      organizations: data?.transformOrganizations,
    }),
  })
  console.log(organizations)
  const {
    projects = [],
    archivesProjects = [],
    programs = [],
    archivesPrograms = [],
    projectsWithProgram = [],
    archivesProjectsWithProgram = [],
  } = useGetProjectQuery({ userId, organizationId }, {
    selectFromResult: ({ data }) => ({
      projects: data?.projects || [],
      archivesProjects: data?.archivesProjects || [],
      programs: data?.programs || [],
      archivesPrograms: data?.archivesPrograms || [],
      projectsWithProgram: data?.projectsWithProgram || [],
      archivesProjectsWithProgram: data?.archivesProjectsWithProgram || [],
    }),
  });
  console.log(projects, archivesProjects, projectsWithProgram, archivesProjectsWithProgram, programs, archivesPrograms)

  useEffect(() => {
    if (organizations.length>0 && !organizationId)
    setOrganizationId(organizations[0].id)
  }, [organizations])
  // useEffect(() => {
  //   const firstArray = data.filter(item => {
  //     if (item.type !== "Проект") return false;

  //     if (item.target && Array.isArray(item.target)) {
  //       const hasProductType = item.target.some(targetItem => targetItem.type === "Продукт");
  //       return !hasProductType || item.targetState === 'Активная';
  //     }

  //     return item.programId == null;
  //   });

  //   const secondArray = data.filter((item) => item.type === "Программа");
  //   const thirdArray = data.filter(item => item.type === 'Проект' && item.programId !== null)

  //   setProjectsList(firstArray);
  //   setProgramsList(secondArray);
  //   setProjectsOfProgramsList(thirdArray)
  // }, [data]);

  const openProjectsOfProgram = (index) => {
    if (open === index) {
      setOpen(null)
    } else {
      setOpen(index)
    }
  }
  // console.log(projectsList, programsList)
  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header title={"Программы и Проекты"} create={true} ></Header>
        </>
        {/* <div className={classes.heading}>

                </div> */}
        <div className={classes.body}>
          <div
            className={classes.bodyContainer}
            style={{ borderBottom: "1px solid grey" }}
          >
            <div className={classes.name}>Организация</div>
            <div className={classes.selectSection}>
              <select name="selectProgram" onChange={(e) => setOrganizationId(e.target.value)}>
                {organizations.map((item,index) => (
                  <option key={index} value={item.id}>{item.organizationName}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className={classes.ColumnContainer}>
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenProjects(!openProjects)}
            >
              <div className={classes.ElemTitle}> Проекты</div>
              <img
                src={sublist}
                alt="image"
                style={{ transform: openProjects ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openProjects && (
              <div className={classes.ContainerElem1}>
                <ol className={classes.ListOfProjects}>
                  {projects.map((item, index) => (
                    <li
                      key={index}
                      className={classes.ProjectListItem}
                      onClick={() => navigate(item.id)}
                    >
                      {item.projectName}
                    </li>
                  ))}
                </ol>
                {/* <ol className={classes.ListOfProjects}>
                  {projectsWithProgram.map((item, index) => (
                    <li
                      key={index}
                      className={classes.ProjectListItem}
                      onClick={() => navigate(item.id)}
                    >
                      {item.projectName}
                    </li>
                  ))}
                </ol> */}
              </div>
            )}
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenPrograms(!openPrograms)}
            >
              <div className={classes.ElemTitle}>Программы</div>
              <img
                src={sublist}
                alt="image"
                style={{ transform: openPrograms ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openPrograms && (
              <div className={classes.ContainerElem1}>
                <ol className={classes.ListOfProjects}>
                  {programs.map((item, index) => (
                    <>
                      <li key={index} className={classes.ProjectListItem} onClick={() => openProjectsOfProgram(index)}>
                        {item.projectName}
                      </li>
                      {open === index &&
                        (
                          <div className={classes.projectsOfProgram}>
                            {/* <div onClick={() => navigate(`program/${item.id}`)}>Раскрыть Программу</div> */}
                            <ol className={classes.ListOfProgram}>
                              <li style={{ color: '#005475' }} onClick={() => navigate(`program/${item.id}`)} >Раскрыть программу</li>
                              {projectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                <li key={index1} onClick={() => navigate(element.id)}>
                                  {element.projectName}
                                </li>
                              ))}
                            </ol>
                            <ol className={classes.ListOfProgram}>
                              {archivesProjectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                <li key={index1} style={{ color: 'grey' }} onClick={() => navigate(element.id)}>
                                  {element.projectName}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                    </>
                  ))}
                </ol>
              </div>
            )}
            {/* //////////////////////////////////////////// Архив */}
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenArchive(!openArchive)}
            >
              <div className={classes.ElemTitle}>Архив</div>
              <img
                src={sublist}
                alt="image"
                style={{ transform: openArchive ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openArchive && (
              <>
                <div className={classes.ContainerElem1}>
                  <ol className={classes.ListOfProjects}>
                    {archivesPrograms.map((item, index) => (
                      <>
                        <li key={index} style={{ color: 'grey' }} className={classes.ProjectListItem} onClick={() => openProjectsOfProgram(index)}>
                          {item.projectName}
                        </li>
                        {open === index &&
                          (
                            <div className={classes.projectsOfProgram}>
                              {/* <div onClick={() => navigate(`program/${item.id}`)}>Раскрыть Программу</div> */}
                              <ol className={classes.ListOfProgram}>
                                <li style={{ color: '#005475' }} onClick={() => navigate(`program/${item.id}`)} >Раскрыть программу</li>
                                {archivesProjectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                  <li key={index1} style={{ color: 'grey' }} onClick={() => navigate(element.id)}>
                                    {element.projectName}
                                  </li>
                                ))}
                              </ol>
                              <ol className={classes.ListOfProgram}>
                                {projectsWithProgram.filter(project => project.programId === item.id).map((element, index1) => (
                                  <li key={index1} onClick={() => navigate(element.id)}>
                                    {element.projectName}
                                  </li>
                                ))}
                              </ol>

                            </div>
                          )}
                      </>
                    ))}
                  </ol>
                  <ol className={classes.ListOfProjects}>
                    {archivesProjects.map((item, index) => (
                      <li
                        key={index}
                        style={{ color: 'grey' }}
                        className={classes.ProjectListItem}
                        onClick={() => navigate(`archive/${item.id}`)}
                      >
                        {item.projectName}
                      </li>
                    ))}
                  </ol>
                  {/* <ol className={classes.ListOfProjects}>
                    {archivesProjectsWithProgram.map((item, index) => (
                      <li
                        key={index}
                        style={{ color: 'grey' }}
                        className={classes.ProjectListItem}
                        onClick={() => navigate(item.id)}
                      >
                        {item.projectName}
                      </li>
                    ))}
                  </ol> */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
