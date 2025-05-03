import { useState, useEffect, useRef } from "react";
import { AppContext } from "./AppContext.jsx";
import useValidateUser from "../hooks/useValidateUser.js";

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userData, setUserData] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const validateUser = useValidateUser()
  const didRun = useRef(false)

  const value = {
    isLoggedIn, setIsLoggedIn,
    userData, setUserData,
    isAdmin, setIsAdmin
  }

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    
    validateUser(setIsLoggedIn, setUserData, setIsAdmin)
  }, [validateUser])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}