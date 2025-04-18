export default function getLastPath() {
  const lastPath = localStorage.getItem('lastPath');
  if (lastPath) {
    localStorage.removeItem('lastPath')
    return lastPath
  } else {
    return '/'
  }
}