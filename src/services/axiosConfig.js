import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || `${window.location.protocol}//${window.location.hostname}:3000`;

export default axios;