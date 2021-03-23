import axios from "axios";
import { useState, useEffect } from "react";

export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  //Gets data of days, appointments, interviewers from API and sets state for those
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  //Calculates remaining spots for a day and returns days array
  const spotsRemaining = function (spotCount) {
    const dayOfWeek = state.days.find(day => day.name === state.day);
    const days = [...state.days];

    days.forEach((day) => {
      if (day.id === dayOfWeek.id) day.spots += spotCount;
    });
   
    return days;
  };

  //Creates a new appointment and updates spots remaining
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = spotsRemaining(-1);

    setState({ ...state, appointments });

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          appointments,
          days
        }));
      })
  }

  //Deletes appointment and updates spots remaining
  function deleteAppointment(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = spotsRemaining(1);

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          appointments,
          days
        }));
      })
  }

  return { state, setDay, bookInterview, deleteAppointment };
}
