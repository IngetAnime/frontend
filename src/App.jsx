import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import IndexPage from './pages/Index'
import AuthPage from './pages/auth/AuthPage';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import EmailVerificationPage from './pages/auth/EmailVerification';
import ErrorPage from './pages/Error';
import AnimePage from './pages/anime/AnimePage';
import Timeline from './pages/anime/timeline';
import Explore from './pages/anime/Explore';

const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'anime',
        element: <AnimePage />,
        children: [
          {
            index: true,
            element: <Explore />
          },
          {
            path: 'timeline',
            element: <Timeline />
          }
        ]
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthPage />,
    children: [
      {
        index: true,
        element: <LoginPage />
      },
      {
        path: 'login',  
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        path: 'email-verification',
        element: <EmailVerificationPage />
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />
      },
    ]
  },
])

export default function App() {
  return (
    <RouterProvider router={router}/>
  )
}