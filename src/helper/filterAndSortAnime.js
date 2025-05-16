export default function filterAndSortAnime(originalAnimes, accessType, status, platformId) {
  let filteredAnime = [...originalAnimes]
  
  // Filter accessType
  if (accessType === 'available_for_free') {
    filteredAnime = filteredAnime.filter(anime =>
      Array.isArray(anime.platforms) &&
      anime.platforms.some(platform => platform?.accessType === 'free')
    );
  } else if (accessType === 'limited_time') {
    filteredAnime = filteredAnime.filter(anime =>
      Array.isArray(anime.platforms) &&
      anime.platforms.length > 0 &&
      anime.platforms.every(platform => platform?.accessType === 'limited_time')
    );
  } else if (accessType === 'subscription_only') {
    filteredAnime = filteredAnime.filter(anime =>
      Array.isArray(anime.platforms) &&
      anime.platforms.length > 0 &&
      anime.platforms.every(platform => platform?.accessType === 'subscription')
    );
  }

  // Filter status
  if (status === 'none') {
    filteredAnime = filteredAnime.filter(anime => !anime.myListStatus?.status);
  } else if (status !== 'all') {
    filteredAnime = filteredAnime.filter(anime => anime.myListStatus?.status === status);
  }

  // Filter platform
  if (platformId !== 0) {
    filteredAnime = filteredAnime.filter(anime =>
      Array.isArray(anime.platforms) &&
      anime.platforms.some(platform => platform?.platform?.id === platformId)
    );
  }

  return filteredAnime
}