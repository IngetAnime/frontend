import { useNavigate } from "react-router-dom";
import { loginWithMal } from "../services/auth.service";
import { toast } from "react-toastify";
import useLogin from "./useLogin";

export default function useMalLogin() {
  const navigate = useNavigate()
  const loginUser = useLogin()
  const malLogin = async (code) => {
    if (!code) return;
    const { success, message, data } = await loginWithMal(code);
    if (success) {
      loginUser(data)
      navigate('/')
    } else {
      toast.error(message)
    }
  }

  return malLogin;
}