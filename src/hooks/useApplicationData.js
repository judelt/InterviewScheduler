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

  console.log("appointments", state.appointments);
  console.log("initial days spotsRemaining", state.days);

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("api/appointments"),
      axios.get("api/interviewers"),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  const spotsRemaining = function (spotCount) {
    const dayOfWeek = state.days.find(day => day.name === state.day);
    const days = [...state.days];

    for (const day of days) {
      if (day.id === dayOfWeek.id) {
        day.spots += spotCount;
      }
    }
    return days;
  };

  function bookInterview(id, interview) {
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = spotsRemaining(-1);
    console.log("days spotsRemaining when book Interview", days);
      
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

  function deleteAppointment(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    console.log("appointment", appointment);
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    const days = spotsRemaining(1);
    console.log("days spotsRemaining when delete", days);

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
