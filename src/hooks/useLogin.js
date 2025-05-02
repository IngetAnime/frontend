import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useLogin() {
  const { setIsLoggedIn, setUserData } = useContext(AppContext)
  const navigate = useNavigate()

  const loginUser = (userData) => {
    setIsLoggedIn(true)
    setUserData(userData)
    navigate('/')
    toast.success(`Okaerinasai, ${userData.username}-san!`)
  }

  return loginUser
}