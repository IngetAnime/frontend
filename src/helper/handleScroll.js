export const handleScroll = (setOffset, limit) => {
  const scrollTop = window.scrollY;
  const clientHeight = window.innerHeight;
  const scrollHeight = document.documentElement.scrollHeight
  if (scrollTop + clientHeight + 1 >= scrollHeight - clientHeight) {
    setOffset((offset) => offset + limit);
  }
}