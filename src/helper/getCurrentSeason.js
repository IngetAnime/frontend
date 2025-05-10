import dayjs from "dayjs";

export default function getCurrentSeason() {
    const now = dayjs();
    const month = now.month()
    const year = now.year()

    let season;
    if (month >= 0 && month <= 2) {
      season = 'winter';
    } else if (month >= 3 && month <= 5) {
      season = 'spring';
    } else if (month >= 6 && month <= 8) {
      season = 'summer';
    } else {
      season = 'fall';
    }

    return { year, season }
  }