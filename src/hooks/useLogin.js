import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useValidateUser from "./useValidateUser";

export default function useLogin() {
  const { setIsLoggedIn, setUserData, setIsAdmin } = useContext(AppContext)
  const navigate = useNavigate()
  const validateUser = useValidateUser()

  const loginUser = async (userData) => {
    await validateUser(setIsLoggedIn, setUserData, setIsAdmin)
    navigate('/')
    toast.success(`Okaerinasai, ${userData.username}-san!`)
  }

  return loginUser
}