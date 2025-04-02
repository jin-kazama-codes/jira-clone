"use client";

export const useCookie = (cookieParam: string) => {
  // Check if running on the client
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookies = document.cookie.split(";");
  const cookieObj = cookies.find((cookie) =>
    cookie.trim().startsWith(`${cookieParam}=`)
  );

  if (cookieObj) {
    try {
      const cookieVal = cookieObj.split("=")[1];
      if (cookieVal) {
        return JSON.parse(cookieVal);
      } else {
        console.warn(`${cookieParam} cookie value is undefined`);
      }
    } catch (error) {
      console.error(`Error parsing ${cookieParam} Cookie:`, error);
    }
  } else {
    console.warn(`${cookieParam} cookie not found`);
  }
  return null;
};