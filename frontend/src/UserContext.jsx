import { createContext, useContext, useState,useEffect } from "react";
import axios from 'axios';
// Create context
const SecretContext = createContext();

// Provider component
export const SecretProvider = ({ children }) => {
  const [isSecretVerified, setIsSecretVerified] = useState(false);
  const[isAdmin,setIsadmin]=useState(false)
    const [userData, setUserData] = useState(null);  // Will hold {name, email, role}

   useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });

        if (data && data.name) {
          setUserData(data);
          console.log(data);
              if (data.role === "admin") {
          setIsadmin(true); // ✅ yeh line zaroori hai
        }
           // data contains: id, name, email, role
        }
      } catch (err) {
        console.error("User not logged in or profile fetch failed:", err);
        setUserData(null);
      }
    };

    fetchProfile();
  }, []);

  return (
    <SecretContext.Provider value={{ isSecretVerified, setIsSecretVerified ,isAdmin,setIsadmin,  userData,              // ✅ pass userData
  setUserData  }}>
      {children}
    </SecretContext.Provider>
  );
};

// Custom hook to use context
export const useSecret = () => useContext(SecretContext);
