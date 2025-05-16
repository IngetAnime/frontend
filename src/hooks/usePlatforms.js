import { useEffect, useState } from "react";
import { getPlatforms } from "../services/platform.service";
import { toast } from "react-toastify";

export const usePlatforms = () => {
  const [platforms, setPlatforms] = useState([{ text: 'Semua', value: 0 }]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const { data, success, message } = await getPlatforms();
      if (success) {
        setPlatforms([
          { text: 'Semua', value: 0 },
          ...data.map((menu) => ({
            text: menu.name,
            value: menu.id,
          }))
        ]);
      } else {
        toast.error(message);
      }
    };

    fetchPlatforms();
  }, []);

  return platforms;
};