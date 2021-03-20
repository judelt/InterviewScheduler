import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

import useVisualMode from "../../hooks/useVisualMode";

import "./styles.scss";


export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
  
    transition(SAVING);
  
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
    
    console.log('appt props', props) 
  }

  function deleting() {
    
    transition(DELETING, true)
    
    props.deleteAppointment(props.id)
      .then(() => transition(EMPTY))
      .catch((err) => transition(ERROR_DELETE, true))
    
    console.log('appt props', props) 
  }
  
    
  return (
    <>
      <article className="appointment">
        <Header time={props.time} />
        {mode === EMPTY &&
          <Empty onAdd={() => transition(CREATE)}/>}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer} 
            onEdit={() => transition(EDIT)}
            onDelete={() => transition(CONFIRM)}
          />
        )}
         {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save}
          />
        )}
         {mode === EDIT && (
          <Form
            name={props.interview.student}
          // student name and the list of interviewers with the prop values
            interviewers={props.interviewers}
            interviewer = {props.interview.interviewer.id}
            onCancel={() => back()}
            onSave={save}
          />
        )}
        {mode === SAVING && (
          <Status
            message='Saving'
          />
        )}
         {mode === DELETING && (
          <Status
            message='Deleting'
          />
        )}
         {mode === CONFIRM && (
          <Confirm
            message='Are you sure you want to delete?'
            onCancel={() => back()}
            onConfirm={deleting}
          />
        )}
      </article>
    </>
  );
}
