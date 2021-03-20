import axios from 'axios';
import React, { useState, useEffect } from "react";


export default function useApplicationData(initial) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {} 
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    
      Promise.all([
        axios.get("/api/days"),
        axios.get("api/appointments"),
        axios.get("api/interviewers"),
      ]).then((all) => {
        setState(prev => ({
          ...prev, days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        }));
      });
      
  }, []);

  function bookInterview(id, interview) {
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    setState({ ...state, appointments });

    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          appointments
        }));
      })
  };

  function deleteAppointment(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    console.log('appointment', appointment)
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          appointments
        }));
      })
  }

  return { state, setDay, bookInterview, deleteAppointment };

};




