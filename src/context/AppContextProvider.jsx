import { useState, useEffect } from "react";
import { AppContext } from "./AppContext.jsx";
import { isAuthenticated, isAdmin as checkPermission } from "../services/auth.service.js";

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userData, setUserData] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);

  const value = {
    isLoggedIn, setIsLoggedIn,
    userData, setUserData,
    isAdmin, setIsAdmin
  }

  const validateUser = async () => {
    try {
      const { data } = await isAuthenticated();
      setIsLoggedIn(true)
      setUserData(data)
    } catch(err) {
      console.log(err.message);
      setIsLoggedIn(false)
      setUserData({})
    }
  }

  const validateAdmin = async () => {
    try {
      await checkPermission()
      setIsAdmin(true)
    } catch(err) {
      console.log(err.message);
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    validateUser()
    validateAdmin()
  }, [isLoggedIn])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}