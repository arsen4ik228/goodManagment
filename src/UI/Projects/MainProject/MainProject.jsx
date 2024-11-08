import React, { useEffect, useState } from "react";
import classes from "./MainProject.module.css";
import Header from "../../Custom/Header/Header";
import sublist from "../../Custom/icon/icon _ sublist.svg";
import { useGetProjectQuery } from "../../../BLL/projectApi";
import { useNavigate, useParams } from "react-router-dom";

export default function MainProject() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [openProjects, setOpenProjects] = useState(false);
  const [openPrograms, setOpenPrograms] = useState(true);
  const [programsList, setProgramsList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [projectsOfProgramsList, setProjectsOfProgramsList] = useState([])

  const [open, setOpen] = useState()

  const { data = [] } = useGetProjectQuery(userId, {
    selectFromResult: ({ data }) => ({
      data: data || [],
    }),
  });
  // console.log(data)
  useEffect(() => {
    const firstArray = data.filter(
      (item) => item.type === "Проект" && item.programId == null
    );
    const secondArray = data.filter((item) => item.type === "Программа");
    const thirdArray = data.filter(item => item.type === 'Проект' && item.programId !== null)

    setProjectsList(firstArray);
    setProgramsList(secondArray);
    setProjectsOfProgramsList(thirdArray)
  }, [data]);

  const openProjectsOfProgram = (index) => {
    if (open === index) {
      setOpen(null)
    } else {
      setOpen(index)
    }
  }

  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header title={"Проекты"} create={true} ></Header>
        </>
        {/* <div className={classes.heading}>

                </div> */}
        <div className={classes.body}>
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
                  {projectsList.map((item, index) => (
                    <li
                      key={index}
                      className={classes.ProjectListItem}
                      onClick={() => navigate(item.id)}
                    >
                      {item.projectName}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            <div
              className={classes.ContainerElem}
              onClick={() => setOpenPrograms(!openPrograms)}
            >
              <div className={classes.ElemTitle}> Программы</div>
              <img
                src={sublist}
                alt="image"
                style={{ transform: openPrograms ? "none" : "rotate(90deg)" }}
              />
            </div>
            {openPrograms && (
              <div className={classes.ContainerElem1}>
                <ol className={classes.ListOfProjects}>
                  {programsList.map((item, index) => (
                    <>
                      <li key={index} className={classes.ProjectListItem} onClick={() => openProjectsOfProgram(index)}>
                        {item.projectName}
                      </li>
                      {open === index &&
                        (
                          <div className={classes.projectsOfProgram}>
                            <div onClick={() => navigate(`program/${item.id}`)}>Раскрыть Программу</div>
                            <ol className=''>
                              {projectsOfProgramsList.filter(project => project.programId === item.id).map((element, index1) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
