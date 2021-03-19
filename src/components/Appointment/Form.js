import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";


export default function Form(props) {

  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  // const reset = () => {
  //   setName("");
  //   setInterviewer(null);
  // }

  // const cancel = () => {
  //   reset()
  //   props.onCancel()
  // }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="appointment__create-input text--semi-bold"
            type="text"
            placeholder="Enter Student Name"
          />
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
          onChange={(event) => setInterviewer(event.target.value)}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          {/* <Button danger onClick={cancel}>Cancel</Button>  */}
          <Button danger onClick={props.onCancel}>Cancel</Button> 
          <Button confirm onClick={props.onSave}>Save</Button>
        </section>
      </section>
    </main>
  );
}



