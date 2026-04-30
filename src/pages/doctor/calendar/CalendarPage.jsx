import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css';

import { useUser } from "../../../services/UserContext";
import { useAuth0 } from "@auth0/auth0-react";

import PatientCalendarPage from './PatientCalendarPage';
import DoctorCalendarPage from './DoctorCalendarPage';

export default function CalendarPage() {
  const { userProfile, loading } = useUser();
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  if (loading) {
    return (
      <div className="calendar-container">
        <div className="loading-spinner">Cargando calendario...</div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="calendar-container">No se pudo cargar el perfil. Reintenta iniciar sesión.</div>;
  }

  if (userProfile.role === 'professional') {
    return <DoctorCalendarPage />;
  }

  if (userProfile.role === 'patient') {
    return <PatientCalendarPage />;
  }

  return <div className="calendar-container">Acceso no autorizado o rol desconocido.</div>;
}