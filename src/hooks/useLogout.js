import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { logout } from "../services/auth.service";
import useValidateUser from "./useValidateUser";

export default function useLogout() {
  const { setIsLoggedIn, setUserData, setIsAdmin, userData } = useContext(AppContext)
  const validateUser = useValidateUser()
  const logoutUser = async () => {
    const { success, message } = await logout()
    if (success) {
      validateUser(setIsLoggedIn, setUserData, setIsAdmin);
      toast.success(`Matane, ${userData.username}-san!`);
    } else {
      toast.error(message);
    }
  }

  return logoutUser
}