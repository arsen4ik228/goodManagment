import React, { useEffect, useState } from "react";
import classes from "./Target.module.css";
import remove from "../../Custom/icon/icon _ remove.svg"
import ConfirmRemoveModal from "../../Custom/ConfirmRemoveModal/ConfirmRemoveModal";
import { formattedDate, resizeTextarea } from "../../../BLL/constans";
import ConfirmCompleteModal from "../../Custom/ConfirmCompleteModal/ConfirmCompleteModal";

function Target({ contentSender, workersList, setSelectedWorker, setDeadlineDate, isNew, edit, item, setTargetState }) {
  const textareaHeight = 50;
  const [content, setContent] = useState('')

  const [openConfirmRemoveModal, setOpenConfirmRemoveModal] = useState(false)
  const [openConfirmCompleteModal, setOpenConfirmCompleteModal] = useState(false)
  const [worker, SetWorker] = useState()
  const [deadline, setDeadline] = useState()
  const [targetStatus, setTargetStatus] = useState()

  useEffect(() => {
    if (!isNew) {
      setContent(item?.content)
      SetWorker(item?.holderUserId)
      setDeadline(item.deadline.slice(0, 10))
      setTargetStatus(item.targetState)
      // resizeTextarea(item?.type + item?.orderNumber)
    }
  }, [item, isNew])

  // useEffect(() => {
  //   resizeTextarea(item?.type + item?.orderNumber)
  // }, [content])

  useEffect(() => {
    resizeTextarea(item?.type + item?.orderNumber)
    contentSender(content)
  }, [content])

  const completeTarget = () => {
    if (targetStatus === 'Завершена') return
    setOpenConfirmCompleteModal(true)
  }
  const removeTarget = () => {
    console.log('item:  ', item)

    setOpenConfirmRemoveModal(true)
  }

  return (
    <>
      <div className={classes.cardContainer}>
        <div className={classes.header}>
          {(!isNew && !edit && !item?.isExpired) &&
            (
              <div className={classes.confirm} onClick={() => completeTarget()}>
                {targetStatus === 'Завершена' ? 'Задача завершена' : "Завершить задачу"}
                <input type="checkbox"
                  checked={targetStatus === 'Завершена'}
                />
              </div>
            )}
          {(edit && !isNew) && (
            <div className={classes.remove}>
              <img src={remove} alt="" onClick={removeTarget} />
            </div>
          )}
        </div>
        {isNew ?
          (
            <div className={classes.content}>
              <textarea
                name="content"
                placeholder="Введите текст задачи..."
                id={item?.type + item?.orderNumber}
                value={content}
                style={{ height: `${textareaHeight}px` }}
                onChange={(e) => {
                  setContent(e.target.value)
                  setTimeout(resizeTextarea(item?.type + item?.orderNumber), 0)
                }}
              />
            </div>
          ) : (

            <div className={classes.content}>
              <textarea
                name="content"
                placeholder="Введите текст задачи..."
                id={item.type + item.orderNumber}
                value={content}
                disabled={!edit}
                style={{ height: `${textareaHeight}px` }}
                onChange={(e) => {
                  setContent(e.target.value)
                  setTimeout(resizeTextarea(item.type + item.orderNumber), 0)
                }}
              />
            </div>
          )}
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
                <select name="selectWorker" id="1" value={worker} disabled={!edit} onChange={(e) => setSelectedWorker(e.target.value)}>
                  {workersList?.map((item, index) => (
                    <option key={index} value={item.id}> {item.firstName + ' ' + item.lastName}</option>
                  ))}
                </select>
              </div>
              {(item?.isExpired) ?
                (
                  <div className={classes.deadline}>
                    {/* <input type="date" value={deadline} disabled={!edit} onChange={(e) => setDeadlineDate(e.target.value)} /> */}
                    <span> Просрочено {formattedDate(deadline)} </span>
                  </div>
                ) : (
                  targetStatus === 'Отменена' ?
                    (
                      <div className={classes.deadline}>
                      {/* <input type="date" value={deadline} disabled={!edit} onChange={(e) => setDeadlineDate(e.target.value)} /> */}
                      <span> Отменена</span>
                    </div>
                    ) : (

                      <div className={classes.deadline}>
                        <input type="date" value={deadline} disabled={!edit} onChange={(e) => setDeadlineDate(e.target.value)} />
                      </div>
                    )
                )}
            </>
          )}
        </div>

      </div>
      {openConfirmRemoveModal && <ConfirmRemoveModal
        setTargetState={setTargetState}
        setOpenModal={setOpenConfirmRemoveModal}
        item={item}
      >
      </ConfirmRemoveModal>}
      {openConfirmCompleteModal && <ConfirmCompleteModal
        setOpenModal={setOpenConfirmCompleteModal}
        item={item}
        setTargetState={setTargetState}
      >
      </ConfirmCompleteModal>}
    </>
  );
}

export default Target;
