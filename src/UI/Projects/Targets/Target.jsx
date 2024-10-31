import React, { useEffect, useState } from "react";
import classes from "./Target.module.css";

function Target({ id, contentSender, workersList, setSelectedWorker, setDeadlineDate, isNew, targetsList }) {
  const [textareaHeight, setTextareaHeight] = useState(50);
  const [content, setContent] = useState('')

  const resizeTextarea = () => {
    const textarea = document.getElementById(id);
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isNew) {
      contentSender(content)
    }
  }, [content])

  return (
    <>
      <div className={classes.cardContainer}>
        <div className={classes.content}>
          <textarea
            name="content"
            placeholder="Введите текст задачи..."
            id={id}
            value={content}
            style={{ height: `${textareaHeight}px` }}
            onChange={(e) => {
              setContent(e.target.value)
              setTimeout(resizeTextarea, 0)
            }}
          />
        </div>
        <div className={classes.bottom}>
          {isNew ? (
            <>
              <div className={classes.worker}>
                <select name="selectWorker" id="1" onChange={(e) => setSelectedWorker(e.target.value)}>
                  {workersList?.map((item, index) => (
                    <option key={index} value={item.id}> {item.firstName + ' ' + item.lastName}</option>
                  ))}
                </select>
              </div>
              <div className={classes.deadline}>
                <input type="date" onChange={(e) => setDeadlineDate(e.target.value)} />
              </div>
            </>
          ) : (
            <>
              <div className={classes.worker}>
                <select name="selectWorker" id="1" onChange={(e) => setSelectedWorker(e.target.value)}>
                  {workersList?.map((item, index) => (
                    <option key={index} value={item.id}> {item.firstName + ' ' + item.lastName}</option>
                  ))}
                </select>
              </div>
              <div className={classes.deadline}>
                <input type="date" value={targetsList[id]?.deadline.slice(0, 10)}/>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Target;
