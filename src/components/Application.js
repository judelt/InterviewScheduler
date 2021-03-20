import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"

export default function Application(props) {
  
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

  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const interview = getInterview(state, appointment.interview);
  const interviewers = getInterviewersForDay(state, state.day);

  const schedule = dailyAppointments.map((appointment) => {
    // console.log(interview)
    return <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      deleteAppointment={deleteAppointment}
      // onEdit={bookInterview}
      // onDelete={cancelInterview}
    />;
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


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
