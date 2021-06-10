import axios from "axios";
import { useReducer, useEffect } from "react";

//Updates spots for an specific day
const spotsRemaining = function (dayName, days, appointments) {
  const spots = days
    .find((day) => day.name === dayName)
    .appointments.reduce(
      (spots, appointmentID) =>
        !appointments[appointmentID].interview ? ++spots : spots,
      0
    );

  const newArr = days.map((day) => {
    if (day.name === dayName) {
      return { ...day, spots };
    }
    return day;
  });

  return newArr;
};

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

const initialState = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {},
};

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  

  // exampleSocket.onmessage = function (event) {
  //   console.log(event.data);
  // }
  // if (webSocket.bufferedAmount === 0) {
    // exampleSocket.close();
  // }
  

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

  
  useEffect(() => {
    let ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.onopen = () => ws.send('websocket connection open')
    
    ws.onmessage = e => {
      const message = JSON.parse(e.data);
      if (message.type === "SET_INTERVIEW") {
        dispatch({
          type: SET_INTERVIEW,
          id: message.id,
          interview: message.interview,
        });
      }
      console.log('e', message);
    };
    return () => {
      ws.close();
    }

  }, [])

  //Creates a new appointment and updates spots remaining
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

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
