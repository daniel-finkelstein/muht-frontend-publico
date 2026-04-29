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

      const baseUser = await apiRequest("/api/auth/sync", {
        method: "POST",
        token,
        body: {
          email: auth0User.email,
          full_name: auth0User.name,
        },
      });

      let fullProfile = { ...baseUser };

      try {
        const patientData = await apiRequest("/api/patient/profile", {
          method: "GET",
          token,
        });

        fullProfile = {
          ...fullProfile,
          ...patientData,
          role: "patient",
        };

        // console.log("Perfil de paciente cargado:", fullProfile);
      } catch (patientError) {
        // console.log("No es paciente. Usando rol profesional temporal.");

        fullProfile = {
          ...fullProfile,
          role: "superadmin",
          isMockProfessional: false,
        };
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