import axios from "axios";
import { useReducer, useEffect } from "react";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview ? { ...action.interview } : null,
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment,
      };

      const days = spotsRemaining(state.day, state.days, appointments);

      return { ...state, appointments, days };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  //Gets data of days, appointments, interviewers from API and sets state for those
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });
  }, []);

  //Counts spots available for an specific day
  const counter = (dayObj, appointments) => {
    let count = 0;
    for (const id of dayObj.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        count++;
      }
    }
    return count;
  };

  //Updates spots for an specific day
  const spotsRemaining = function (dayName, days, appointments) {
    const day = days.find((item) => item.name === dayName);
    const remaining = counter(day, appointments);

    const newArr = days.map((item) => {
      if (item.name === dayName) {
        return { ...item, spots: remaining };
      }
      return item;
    });
    return newArr;
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
    const days = spotsRemaining(state.day, state.days, appointments);

    setState({ ...state, appointments });

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((response) => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      });
  }

  //Deletes appointment and updates spots remaining
  function deleteAppointment(id) {
    return axios.delete(`/api/appointments/${id}`).then((response) => {
      dispatch({ type: SET_INTERVIEW, id, interview: null });
    });
  }

  return { state, setDay, bookInterview, deleteAppointment };
}
