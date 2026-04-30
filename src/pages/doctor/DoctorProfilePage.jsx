import { useEffect, useMemo, useState } from "react";
import { useUser } from "../../services/UserContext";
import './DoctorProfile.css';

export default function DoctorProfilePage() {
  const { userProfile, loading } = useUser();
  const [error, setError] = useState("");

  const assignedPatients = [
    { id: 1, name: "Roberto Roberts", age: 45, condition: "Hipertensión" },
    { id: 2, name: "María Martínez", age: 38, condition: "Diabetes Tipo 2" },
    { id: 3, name: "Carlos Sánchez", age: 52, condition: "Colesterol Alto" }
  ]

  if (loading) {
    return (
      <div className="doctor-profile-container">
        <div className="loading-spinner">Cargando perfil...</div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="doctor-profile-container">No se encontró información del perfil del médico.</div>;
  }

  if (userProfile.role === 'professional') {
    return (
      <div className="doctor-profile-container">
        <div className="doctor-profile">
          <div className="profile-header">
            <h1>Tu Perfil</h1>
            <button className="edit-profile-button">Editar Perfil</button>
          </div>
          <div className="doctor-info">
            <div className="doctor-details">
                <p>Nombre: {userProfile.full_name}</p>
                <p>Correo: {userProfile.email}</p>
                <p>Licencia: {userProfile.professional_profile.professional_license}</p>
                <p>Especialidad: {userProfile.professional_profile.specialty}</p>
            </div>
            <div className="profile-picture">
                <img src={userProfile.picture} alt="Foto de perfil" />
            </div>
          </div>
        </div>
        <div className="patient-list">
          <h2 className="patient-list-title">Pacientes Asignados</h2>
            {assignedPatients.length === 0 ? (
              <p>No tienes pacientes asignados.</p>
            ) : (
              <ul>
                {assignedPatients.map((patient) => (
                  <li key={patient.id}>
                    <strong>{patient.name}</strong> - {patient.age} años - {patient.condition}
                    <button className="view-patient-button">Ver Perfil</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )
    }

  return <div className="doctor-profile-container">Acceso no autorizado o rol desconocido.</div>;
}