import { createContext, useContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiRequest } from "./apiClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const {
    getAccessTokenSilently,
    user: auth0User,
    isAuthenticated,
    isLoading: auth0Loading,
  } = useAuth0();

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async () => {
    setLoading(true);

    try {
      const token = await getAccessTokenSilently();
      const response = await apiRequest("/api/auth/me", {
        method: "GET",
        token,
      });
      const baseUser = response.user;
      let fullProfile = { ...baseUser };
      console.log("Perfil base cargado:", fullProfile);

      if (baseUser.role === "patient") {
        const patientData = await apiRequest("/api/patient/profile", {
          method: "GET",
          token,
        });
        fullProfile = { ...fullProfile, ...patientData };
        console.log("Perfil de paciente cargado:", fullProfile);
        
      } else if (baseUser.role === "professional") {
        const allProfessionals = await apiRequest("/api/professional", { method: "GET", token });
        const myProfile = allProfessionals.find(prof => prof.id === baseUser.id);
        if (myProfile) {
          const professionalData = await apiRequest(`/api/professional/${myProfile.id}`, {
            method: "GET",
            token,
          });
          fullProfile = { ...fullProfile, ...professionalData };
          console.log("Perfil profesional encontrado:", fullProfile);
        } else {
          console.warn("No se encontró un perfil profesional para este usuario en la lista global.");
        }

      } else if (baseUser.role === "superadmin") {
        console.log("Acceso como administrador confirmado");
      }

      setUserProfile(fullProfile);
    } catch (error) {
      console.error("Error cargando el perfil:", error);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth0Loading) return;

    if (!isAuthenticated || !auth0User) {
      setUserProfile(null);
      setLoading(false);
      return;
    }
    loadUserProfile();
  }, [auth0Loading, isAuthenticated, auth0User]);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        user: userProfile,
        loading,
        reload: loadUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);