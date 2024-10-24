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

    setProjectsList(firstArray);
    setProgramsList(secondArray);
  }, [data]);
  console.log(data);
  return (
    <>
      <div className={classes.wrapper}>
        <>
          <Header title={"Проекты"} new={false}></Header>
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
                <ul className={classes.ListOfProjects}>
                  {projectsList.map((item, index) => (
                    <li
                      key={index}
                      className={classes.ProjectListItem}
                      onClick={() => navigate(item.id)}
                    >
                      {item.programId === null
                        ? `Проект №${item.projectNumber}`
                        : ""}
                    </li>
                  ))}
                </ul>
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
                <ul className={classes.ListOfProjects}>
                  {programsList.map((item, index) => (
                    <li key={index} className={classes.ProjectListItem}>
                      Программа №{item.projectNumber}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
