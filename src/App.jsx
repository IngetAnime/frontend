import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import DashboardUser from './pages/DashboardUser';
import DashboardAdmin from './pages/DashboardAdmin';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import EmailVerificationPage from './pages/auth/EmailVerification';
import ErrorPage from './pages/Error';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardUser />,
    errorElement: <ErrorPage />
  },
  {
    path: '/admin/dashboard',
    element: <DashboardAdmin />
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
    // children: [
    //   {
    //     path: '/auth/register',
    //     element: <RegisterPage />
    //   },
    //   // {
    //   //   path: '/auth/email-verification',
    //   //   element: <EmailVerification />
    //   // },
    // ]
  },
])

export default function App() {
  return (
    <RouterProvider router={router}/>
  )
}