import React, { useEffect, useState } from 'react'
import classes from "./CustomSelectModal.module.css"
import close from "../../Custom/SearchModal/icon/icon _ add.svg"

export default function CustomSelectModal({ setModalOpen, projects, workers, selectedProject, setSelectedProject, setParentFilteredProjects }) {

    const [filteredProjects, setFilteredProjects] = useState([]);

    const selectProject = (id) => {
        setSelectedProject(prevSelectedProject =>
            prevSelectedProject.includes(id)
                ? prevSelectedProject.filter(item => item !== id)
                : [...prevSelectedProject, id]
        )
    }
    console.log(projects, selectedProject)
    useEffect(() => {
        setParentFilteredProjects(filteredProjects)
    }, [filteredProjects])

    useEffect(() => {
        if (projects && Array.isArray(projects) && workers) {
            const filteredArray = projects.map(project => {
                const targetWithProductType = project.targets.find(target => target.type === 'Продукт');

                if (targetWithProductType) {
                    const worker = workers.find(worker => worker.id === targetWithProductType.holderUserId);
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

            setFilteredProjects(filteredArray);
        }
    }, [projects, workers]);


    console.log(filteredProjects)

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.column}>
                    <div className={classes.close} onClick={() => setModalOpen(false)}>
                        <img src={close} />
                    </div>
                    <div className={classes.element_srch}>
                        <input type={classes.search} placeholder="Поиск" />
                    </div>

                    <div className={classes.body}>
                        {filteredProjects.map((item, index) => (
                            <div key={index} className={classes.projectContainer} style={{boxShadow: selectedProject.includes(item.id) ? '0px 0px 2px 1px rgba(0, 84, 117, 1)' : '0px 0px 1px 0px rgba(0, 0, 0, 1)'}} onClick={() => selectProject(item.id)}>
                                <div className={classes.content}>
                                    <div className={classes.title}>{item.nameProject}</div>
                                    <div className={classes.worker}>{item?.product}</div>
                                    <div className={classes.worker}>{item?.worker}</div>
                                    <div className={classes.data}>{item?.deadline?.slice(0, 10)}</div>
                                </div>
                                <div className={classes.checkBox}>
                                    <input type="checkbox" checked={selectedProject.includes(item.id)} />
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className={classes.btn}>
                        <button onClick={() => setModalOpen(false)}>ДОБАВИТЬ</button>
                    </div>
                </div>
            </div>
        </>
    )
}