import { useContext, useState } from "react"
import { AppContent } from "../context/AppContext";
import axios from "axios";

export default function LoginUser() {
  const { backendUrl, setIsLoggedIn,  } = useContext(AppContent)

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmitHandler(e) {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true; // Cookie also will be send

      const data = await axios.post(backendUrl + '/api/v1/auth/login', {
        identifier, password
      })
      console.log(data);
      if (data.status === 200) {
        setIsLoggedIn(true);
        alert('Login berhasil')
      }
    } catch(error) {
      alert(error.message)
    }
  }

  return (
    <div className="">
      <h1>Halaman Login</h1>
      <form onSubmit={onSubmitHandler}>
        <input 
          onChange={(e) => setIdentifier(e.target.value)}
          value={identifier}
          type="text" name="identifier" id="identifier" placeholder="Masukkan alamat email atau username ..."
        /> <br />
        <input 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password" name="password" id="password" placeholder="Masukkan password ..."
        /> <br />
        <button>Login</button>
      </form>
    </div>
  )
}