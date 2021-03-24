//returns appointments for an specific day
export function getAppointmentsForDay(state, day) {
  const dayObject = state.days.find((d) => d.name === day);
  if (!dayObject) return [];

  const appointments = dayObject.appointments.map(
    (appointmentId) => state.appointments[appointmentId]
  );

  return appointments;
}
//returns object with the student and interviewer for an specific inteview
export function getInterview(state, interview) {
  let result;
  if (!interview) return null;

  const interviewers = state.interviewers;
  for (const key in interviewers) {
    if (interview.interviewer === interviewers[key].id) {
      result = {
        student: interview.student,
        interviewer: interviewers[key],
      };
      break;
    }
  }
  return result;
}
//returns interviewers for an specific day
export function getInterviewersForDay(state, day) {
  const dayObject = state.days.find((d) => d.name === day);
  if (!dayObject) return [];

  const interviewers = dayObject.interviewers.map(
    (id) => state.interviewers[id]
  );

  return interviewers;
}
