export function getAppointmentsForDay (state, day) {
  const result = [];
  const days = state.days;
  const appointments = state.appointments;
  let appointmentIds = [];
  
  //get appointments ids
  for (const particularDay of days) {
    if (particularDay.name === day) {
      appointmentIds = [...particularDay.appointments]
      break;
    }
  }
  
  //get specific appointments that match the ids
  for (const particularDay of appointmentIds) {
    for (const key in appointments) {
      if (particularDay === appointments[key].id) {
        result.push(appointments[key]);
        break;
      }
    }
  }
  return result;
}