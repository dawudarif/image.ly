export const getTokenFromCookie = (cookieName, cookieString) => {
  if (!cookieString) {
    return null;
  }

  const cookieArray = cookieString.split('; ');
  for (const cookie of cookieArray) {
    const [name, value] = cookie.split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
};
