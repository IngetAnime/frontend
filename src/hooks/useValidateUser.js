import { isAdmin, isAuthenticated } from "../services/auth.service";

export default function useValidateUser() {
  const validateLogin = async (setIsLoggedIn, setUserData) => {
    try {
      const { data } = await isAuthenticated();
      setIsLoggedIn(true);
      setUserData(data);
    } catch (err) {
      console.log(err.message);
      setIsLoggedIn(false);
      setUserData({});
    }
  };

  const validateAdmin = async (setIsAdmin) => {
    try {
      await isAdmin();
      setIsAdmin(true);
    } catch (err) {
      console.log(err.message);
      setIsAdmin(false);
    }
  };

  const validateUser = async (setIsLoggedIn, setUserData, setIsAdmin) => {
    await validateLogin(setIsLoggedIn, setUserData)
    await validateAdmin(setIsAdmin)
  }


  return validateUser;
}