import { toast } from "react-toastify";
import { verifyEmail } from "../services/auth.service"
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function useVerifyEmail() {
  const navigate = useNavigate()
  const verifyAccount =  useCallback(async (token) => {
    if (!token) return
    const { success, message } = await verifyEmail(token)
    if (success) {
      toast.success(message);
      navigate('/')
    } else {
      toast.error(message);
    }
  }, [navigate])

  return verifyAccount;
}