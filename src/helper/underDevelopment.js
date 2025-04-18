import { toast } from 'react-toastify';

export default function underDevelopment(e) {
  if (e)
    e.preventDefault()
  toast.error('Masih dalam tahap pengembangan :)')
}