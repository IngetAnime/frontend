// import { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AppContent } from '../context/AppContext';
// import { toast } from 'react-toastify';

// export default function useLogout() {
//   const { axios, setIsLoggedIn, setIsAdmin } = useContext(AppContent);
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await axios.post('api/v1/auth/logout');
//       setIsLoggedIn(false);
//       setIsAdmin(false);
//       toast.success('Anda berhasil keluar');
//       navigate('/auth/login'); // Optional
//     } catch (err) {
//       console.error(err);
//       toast.error('Gagal logout');
//     }
//   };

//   return handleLogout;
// }