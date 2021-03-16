import React from "react";
import classnames from "classnames";
import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {
  const selected = props.selected;
  const interviewerClass = classnames("interviewers__item", {
    "interviewers__item--selected": selected
  });

  const formatName = function (name) {
    if (selected) return name ;
    return;
  };

  return (
    <li key={props.id} className={interviewerClass} onClick={() => props.setInterviewer(props.name)}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {formatName(props.name) }
    </li>
  );
}


// Our InterviewerListItem component takes in the following props:

// id:number - the id of the interviewer
// name:string - the name of the interviewer
// avatar:url - a url to an image of the interviewer
// selected:boolean - to determine if an interview is selected or not
// setInterviewer:function - sets the interviewer upon selection