export default function convertAnimeStatus(status) {
  const statusAnime = status === 'currently_airing' ? 'Sedang tayang' :
    status === 'finished_airing' ? 'Selesai tayang' :
    'Belum tayang'
  return statusAnime;
}