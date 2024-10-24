import React from "react";
import classes from "./Target.module.css";

function Target(props) {
  return (
    <>
          <div className={classes.cardContainer}>
            <div className={classes.content}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus eum ex ipsam eveniet quo placeat reprehenderit enim sapiente doloribus fugit!</div>
            <div className={classes.bottom}>
                <div className={classes.worker}>
                    <select name="selectWorker" id="1">
                        <option value="">Валерий null</option>
                    </select>
                </div>
                <div className={classes.deadline}>
                    01.01.2024
                </div>
            </div>
          </div>
    </>
  );
}

export default Target;
