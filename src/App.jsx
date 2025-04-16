import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

const router = createBrowserRouter([
  {
    path: 'auth/login',
    element: <LoginPage />
  },
  {
    path: 'auth/register',
    element: <RegisterPage />
  }
])

export default function App() {
  return (
    <RouterProvider router={router}/>
  )
}
