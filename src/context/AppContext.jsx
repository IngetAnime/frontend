import { createContext, useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  const value = {
    axios,
    isLoggedIn, setIsLoggedIn,
    userData, setUserData,
    isAdmin, setIsAdmin
  }

  // const validateUser = async () => {
  //   try {
  //     const { data } = await axios.get('api/v1/user/me')
  //     if (data.role === 'admin') {
  //       setIsAdmin(true)
  //     }
  //     setIsLoggedIn(true)
  //     setUserData(data)
  //   } catch(err) {
  //     console.log(err);
  //     setIsLoggedIn(false)
  //     setIsAdmin(false)
  //   }
  // }

  // useEffect(() => {
    // validateUser()
  // }, [])

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}